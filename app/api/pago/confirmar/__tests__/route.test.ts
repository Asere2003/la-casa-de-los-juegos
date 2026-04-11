import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const mockRetrievePI = vi.hoisted(() => vi.fn())
const mockSendConfirmacion = vi.hoisted(() => vi.fn())
const mockSendAdmin = vi.hoisted(() => vi.fn())
const mockFrom = vi.hoisted(() => vi.fn())
const mockRpc = vi.hoisted(() => vi.fn())

vi.mock('stripe', () => ({
  default: class MockStripe {
    paymentIntents = { retrieve: mockRetrievePI }
  },
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: mockFrom,
    rpc: mockRpc,
  })),
}))

vi.mock('@/lib/email/confirmacion-pedido', () => ({
  sendConfirmacionPedido: mockSendConfirmacion,
  sendNuevoPedidoAdmin: mockSendAdmin,
}))

// ── Import después de mocks ───────────────────────────────────────────────────
import { POST } from '../route'

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/pago/confirmar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const baseShipping = {
  nombre: 'Ana García',
  email: 'ana@test.com',
  direccion: 'Calle Mayor 1',
  ciudad: 'Granada',
  codigo_postal: '18001',
  pais: 'ES',
}

const baseItems = [
  { product: { id: 'prod-1', name: 'Catan', slug: 'catan', price: 35, images: ['img.jpg'] }, quantity: 2 },
]

function buildChain(resolveWith: unknown) {
  const chain: Record<string, unknown> = {}
  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.single = vi.fn().mockResolvedValue(resolveWith)
  chain.maybeSingle = vi.fn().mockResolvedValue(resolveWith)
  chain.insert = vi.fn(() => chain)
  chain.update = vi.fn(() => chain)
  return chain
}

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/pago/confirmar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
    process.env.RESEND_API_KEY = 'resend_test'
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'info@test.com'
    process.env.ADMIN_EMAIL = 'admin@test.com'

    mockRpc.mockResolvedValue({ error: null })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)
  })

  // ── Validación ───────────────────────────────────────────────────────────

  it('devuelve 400 si faltan datos obligatorios', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('devuelve 400 si el carrito está vacío', async () => {
    const res = await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: [],
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))
    expect(res.status).toBe(400)
  })

  it('devuelve 400 si el PaymentIntent no está en succeeded', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'requires_payment_method', id: 'pi_test' })

    const res = await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  // ── Idempotencia ─────────────────────────────────────────────────────────

  it('devuelve el pedido existente sin duplicar si ya existe', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })
    const existingChain = buildChain({ data: { id: 'existing-order-id' }, error: null })
    mockFrom.mockReturnValue(existingChain)

    const res = await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.orderId).toBe('existing-order-id')
    // No debe haber insertado nada nuevo
    expect(mockRpc).not.toHaveBeenCalled()
  })

  // ── Happy path ───────────────────────────────────────────────────────────

  it('crea el pedido correctamente y devuelve orderId', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'new-order-id', total: 70, shipping_cost: 0 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)  // check idempotencia
      .mockReturnValueOnce(insertChain)   // insert order
      .mockReturnValueOnce(orderItemChain) // insert order_item

    const res = await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.orderId).toBe('new-order-id')
  })

  it('calcula subtotal y total correctamente', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    let capturedInsert: Record<string, unknown> | null = null
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn((data: Record<string, unknown>) => {
      capturedInsert = data
      return insertChain
    })
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order-calc', total: 69.05, shipping_cost: 4.95 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(orderItemChain)

    // 2×35 = 70 subtotal, + 4.95 envío - 5.9 descuento = 69.05
    await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 4.95,
      discount: 5.9,
      shippingData: baseShipping,
    }))

    expect(capturedInsert).not.toBeNull()
    expect((capturedInsert as Record<string, unknown>).subtotal).toBe(70)
    expect((capturedInsert as Record<string, unknown>).shipping_cost).toBe(4.95)
    expect((capturedInsert as Record<string, unknown>).discount).toBe(5.9)
  })

  it('descuenta stock llamando a rpc por cada item', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order-rpc', total: 70, shipping_cost: 0 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(orderItemChain)

    await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems, // quantity: 2
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))

    expect(mockRpc).toHaveBeenCalledWith('decrementar_stock', {
      producto_id: 'prod-1',
      cantidad: 2,
    })
  })

  it('envía email de confirmación al cliente', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order-email', total: 70, shipping_cost: 0 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(orderItemChain)

    await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))

    expect(mockSendConfirmacion).toHaveBeenCalledOnce()
    expect(mockSendConfirmacion).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'ana@test.com' })
    )
  })

  it('envía email al admin', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order-admin', total: 70, shipping_cost: 0 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(orderItemChain)

    await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))

    expect(mockSendAdmin).toHaveBeenCalledOnce()
    expect(mockSendAdmin).toHaveBeenCalledWith(
      expect.objectContaining({ customerEmail: 'ana@test.com' })
    )
  })

  it('guarda la dirección en el perfil si guardarDireccion es true', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order-save', total: 70, shipping_cost: 0 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })
    const updateChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(orderItemChain)
      .mockReturnValueOnce(updateChain) // update profiles

    await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: { ...baseShipping, guardarDireccion: true },
      userId: 'user-123',
    }))

    // Debe haber llamado a .from('profiles').update(...)
    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ direccion: 'Calle Mayor 1', ciudad: 'Granada' })
    )
  })

  it('no guarda la dirección en el perfil si guardarDireccion es false', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order-nosave', total: 70, shipping_cost: 0 },
      error: null,
    })
    const orderItemChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(orderItemChain)

    await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: { ...baseShipping, guardarDireccion: false },
      userId: 'user-123',
    }))

    // Solo 3 llamadas a from: check, insert order, insert order_item — ninguna de profiles
    expect(mockFrom).toHaveBeenCalledTimes(3)
  })

  // ── Error BD ─────────────────────────────────────────────────────────────

  it('devuelve 500 si falla la inserción del pedido', async () => {
    mockRetrievePI.mockResolvedValue({ status: 'succeeded', id: 'pi_test' })

    const noExistChain = buildChain({ data: null, error: null })
    const insertChain: Record<string, unknown> = {}
    insertChain.insert = vi.fn(() => insertChain)
    insertChain.select = vi.fn(() => insertChain)
    insertChain.single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    })

    mockFrom
      .mockReturnValueOnce(noExistChain)
      .mockReturnValueOnce(insertChain)

    const res = await POST(makeRequest({
      paymentIntentId: 'pi_test',
      items: baseItems,
      shippingCost: 0,
      discount: 0,
      shippingData: baseShipping,
    }))

    expect(res.status).toBe(500)
  })
})
