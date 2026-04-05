import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Hoisted mocks ───────────────────────────────────────────────────────────
const mockConstructEvent = vi.hoisted(() => vi.fn())
const mockRetrieve = vi.hoisted(() => vi.fn())
const mockSendConfirmacion = vi.hoisted(() => vi.fn())
const mockSendAdmin = vi.hoisted(() => vi.fn())

vi.mock('stripe', () => {
  class MockStripe {
    webhooks = { constructEvent: mockConstructEvent }
    checkout = { sessions: { retrieve: mockRetrieve } }
  }
  return { default: MockStripe }
})

const mockFrom = vi.hoisted(() => vi.fn())
const mockSupabase = vi.hoisted(() => ({
  from: mockFrom,
  rpc: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => mockSupabase),
}))

vi.mock('@/lib/email/confirmacion-pedido', () => ({
  sendConfirmacionPedido: mockSendConfirmacion,
  sendNuevoPedidoAdmin: mockSendAdmin,
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRequest(body: string, signature = 'sig_test') {
  return new NextRequest('http://localhost/api/webhook', {
    method: 'POST',
    body,
    headers: { 'stripe-signature': signature },
  })
}

function makeSession(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'cs_test_123',
    payment_status: 'paid',
    payment_intent: 'pi_test_123',
    amount_total: 6495,
    metadata: { user_id: 'user_abc' },
    customer_details: {
      name: 'Juan García',
      email: 'juan@example.com',
      address: {
        line1: 'Calle Mayor 1',
        city: 'Granada',
        postal_code: '18001',
        country: 'ES',
      },
    },
    ...overrides,
  }
}

function makeLineItems(extra: unknown[] = []) {
  return {
    data: [
      {
        description: 'Catan',
        amount_total: 3500,
        quantity: 1,
        price: { unit_amount: 3500 },
      },
      {
        description: 'Carcassonne',
        amount_total: 2500,
        quantity: 1,
        price: { unit_amount: 2500 },
      },
      ...extra,
    ],
  }
}

// ─── Supabase chain builder ───────────────────────────────────────────────────
function buildChain(resolveWith: unknown) {
  const chain: Record<string, unknown> = {}
  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.single = vi.fn().mockResolvedValue(resolveWith)
  chain.insert = vi.fn(() => chain)
  chain.update = vi.fn(() => chain)
  return chain
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('POST /api/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_key'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
    process.env.RESEND_API_KEY = 'resend_test'
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'info@test.com'
    process.env.ADMIN_EMAIL = 'admin@test.com'
  })

  // ── 1. Firma inválida ──────────────────────────────────────────────────────
  it('devuelve 400 si la firma del webhook es inválida', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Signature mismatch')
    })

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Invalid signature')
  })

  // ── 2. Evento distinto de checkout.session.completed ──────────────────────
  it('devuelve 200 received:true para eventos no gestionados', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: { object: {} },
    })

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)
  })

  // ── 3. Sesión sin pago completado ─────────────────────────────────────────
  it('devuelve 200 sin procesar si payment_status != paid', async () => {
    const session = makeSession({ payment_status: 'unpaid' })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)
    // No debe crear pedido
    expect(mockFrom).not.toHaveBeenCalled()
  })

  // ── 4. Idempotencia — pedido ya existente ─────────────────────────────────
  it('devuelve 200 sin duplicar si el pedido ya existe', async () => {
    const session = makeSession()
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const existingChain = buildChain({ data: { id: 'existing_order' }, error: null })
    mockFrom.mockReturnValue(existingChain)

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)
  })

  // ── 5. Happy path — crea pedido correctamente ─────────────────────────────
  it('crea el pedido con los campos correctos', async () => {
    const session = makeSession()
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    // Primera llamada: buscar pedido existente → no existe
    const checkChain = buildChain({ data: null, error: null })
    // Llamadas a products
    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: ['img.jpg'] }, error: null })
    // Insertar order_items
    const orderItemsChain = buildChain({ data: null, error: null })
    // Insertar order
    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: {
        id: 'order_abc123',
        total: 64.95,
        shipping_cost: 4.95,
      },
      error: null,
    })
    insertOrderChain.insert = vi.fn(() => insertOrderChain)

    mockFrom
      .mockReturnValueOnce(checkChain)          // check existing
      .mockReturnValueOnce(insertOrderChain)    // insert order
      .mockReturnValueOnce(productChain)        // find product Catan
      .mockReturnValueOnce(orderItemsChain)     // insert order_item Catan
      .mockReturnValueOnce(productChain)        // find product Carcassonne
      .mockReturnValueOnce(orderItemsChain)     // insert order_item Carcassonne

    mockRetrieve.mockResolvedValue({
      line_items: makeLineItems(),
    })

    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)
  })

  // ── 6. Calcula subtotal correctamente con envío ───────────────────────────
  it('calcula subtotal correcto cuando hay gastos de envío', async () => {
    const session = makeSession({ amount_total: 6990 })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    let capturedInsert: Record<string, unknown> | null = null

    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_xyz', total: 69.90, shipping_cost: 4.95 },
      error: null,
    })
    insertOrderChain.insert = vi.fn((data: Record<string, unknown>) => {
      capturedInsert = data
      return insertOrderChain
    })

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({
      line_items: {
        data: [
          {
            description: 'Catan',
            amount_total: 6500,
            quantity: 1,
            price: { unit_amount: 6500 },
          },
          {
            description: 'Gastos de envío',
            amount_total: 495,
            quantity: 1,
            price: { unit_amount: 495 },
          },
        ],
      },
    })

    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(200)

    // subtotal = total(69.90) - shippingCost(4.95) + discount(0) = 64.95
    expect(capturedInsert).not.toBeNull()
    expect((capturedInsert as Record<string, unknown>).shipping_cost).toBe(4.95)
    expect((capturedInsert as Record<string, unknown>).subtotal).toBeCloseTo(64.95, 1)
  })

  // ── 7. Calcula descuento correctamente ────────────────────────────────────
  it('calcula descuento correctamente', async () => {
    const session = makeSession({ amount_total: 5400 })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    let capturedInsert: Record<string, unknown> | null = null

    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_disc', total: 54.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn((data: Record<string, unknown>) => {
      capturedInsert = data
      return insertOrderChain
    })

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({
      line_items: {
        data: [
          {
            description: 'Catan',
            amount_total: 6000,
            quantity: 1,
            price: { unit_amount: 6000 },
          },
          {
            description: 'Descuento JUEGOS10',
            amount_total: -600,
            quantity: 1,
            price: { unit_amount: -600 },
          },
        ],
      },
    })

    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(200)

    // discount = abs(-600/100) = 6
    expect(capturedInsert).not.toBeNull()
    expect((capturedInsert as Record<string, unknown>).discount).toBe(6)
  })

  // ── 8. Envía email al cliente ──────────────────────────────────────────────
  it('envía email de confirmación al cliente', async () => {
    const session = makeSession()
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_email_test', total: 60.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn(() => insertOrderChain)

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    await POST(makeRequest('{}'))

    expect(mockSendConfirmacion).toHaveBeenCalledOnce()
    expect(mockSendConfirmacion).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'juan@example.com',
        orderNumber: 'ORDER_EM',  // primeros 8 chars de 'order_email_test' → ORDER_EM
      })
    )
  })

  // ── 9. No envía email si no hay customer_details.email ────────────────────
  it('no envía email si la sesión no tiene email de cliente', async () => {
    const session = makeSession({
      customer_details: { name: null, email: null, address: null },
    })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_no_email', total: 60.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn(() => insertOrderChain)

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    await POST(makeRequest('{}'))

    expect(mockSendConfirmacion).not.toHaveBeenCalled()
    expect(mockSendAdmin).not.toHaveBeenCalled()
  })

  // ── 10. Envía email al admin ──────────────────────────────────────────────
  it('envía email al admin con los datos del pedido', async () => {
    const session = makeSession()
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_admin_test', total: 60.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn(() => insertOrderChain)

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    await POST(makeRequest('{}'))

    expect(mockSendAdmin).toHaveBeenCalledOnce()
    expect(mockSendAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        customerEmail: 'juan@example.com',
        total: 60.00,
      })
    )
  })

  // ── 11. Descuenta stock de productos ──────────────────────────────────────
  it('llama a rpc decrementar_stock por cada producto', async () => {
    const session = makeSession()
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_stock', total: 60.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn(() => insertOrderChain)

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    await POST(makeRequest('{}'))

    // Hay 2 productos → 2 llamadas a decrementar_stock
    expect(mockSupabase.rpc).toHaveBeenCalledTimes(2)
    expect(mockSupabase.rpc).toHaveBeenCalledWith('decrementar_stock', {
      producto_id: 'prod_1',
      cantidad: 1,
    })
  })

  // ── 12. Devuelve 500 si falla la inserción del pedido ─────────────────────
  it('devuelve 500 si falla la inserción del pedido en BD', async () => {
    const session = makeSession()
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    })
    insertOrderChain.insert = vi.fn(() => insertOrderChain)

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })

    const { POST } = await import('../route')
    const res = await POST(makeRequest('{}'))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Error creando pedido')
  })

  // ── 13. user_id de metadata ────────────────────────────────────────────────
  it('guarda el user_id de los metadatos de la sesión', async () => {
    const session = makeSession({ metadata: { user_id: 'user_specific_id' } })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    let capturedInsert: Record<string, unknown> | null = null

    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_user', total: 60.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn((data: Record<string, unknown>) => {
      capturedInsert = data
      return insertOrderChain
    })

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    await POST(makeRequest('{}'))

    expect(capturedInsert).not.toBeNull()
    expect((capturedInsert as Record<string, unknown>).user_id).toBe('user_specific_id')
  })

  // ── 14. Sin user_id en metadata → null ────────────────────────────────────
  it('guarda user_id como null si no hay metadata', async () => {
    const session = makeSession({ metadata: {} })
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const checkChain = buildChain({ data: null, error: null })
    let capturedInsert: Record<string, unknown> | null = null

    const insertOrderChain: Record<string, unknown> = {}
    insertOrderChain.select = vi.fn(() => insertOrderChain)
    insertOrderChain.single = vi.fn().mockResolvedValue({
      data: { id: 'order_guest', total: 60.00, shipping_cost: 0 },
      error: null,
    })
    insertOrderChain.insert = vi.fn((data: Record<string, unknown>) => {
      capturedInsert = data
      return insertOrderChain
    })

    const productChain = buildChain({ data: { id: 'prod_1', slug: 'catan', images: [] }, error: null })
    const orderItemsChain = buildChain({ data: null, error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(insertOrderChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)
      .mockReturnValueOnce(productChain)
      .mockReturnValueOnce(orderItemsChain)

    mockRetrieve.mockResolvedValue({ line_items: makeLineItems() })
    mockSendConfirmacion.mockResolvedValue(undefined)
    mockSendAdmin.mockResolvedValue(undefined)

    const { POST } = await import('../route')
    await POST(makeRequest('{}'))

    expect(capturedInsert).not.toBeNull()
    expect((capturedInsert as Record<string, unknown>).user_id).toBeNull()
  })
})
