import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const mockCreatePaymentIntent = vi.hoisted(() => vi.fn())

vi.mock('stripe', () => ({
  default: class MockStripe {
    paymentIntents = { create: mockCreatePaymentIntent }
  },
}))

// ── Import después de mocks ───────────────────────────────────────────────────
import { POST } from '../route'

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/pago/intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const baseItems = [
  { product: { id: 'prod-1', name: 'Catan', price: 35 }, quantity: 2 },
]

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/pago/intent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
    mockCreatePaymentIntent.mockResolvedValue({ client_secret: 'pi_test_secret_xxx' })
  })

  // ── Validación ───────────────────────────────────────────────────────────

  it('devuelve 400 si el carrito está vacío', async () => {
    const res = await POST(makeRequest({ items: [], shippingCost: 0, discount: 0 }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it('devuelve 400 si items no existe', async () => {
    const res = await POST(makeRequest({ shippingCost: 0, discount: 0 }))
    expect(res.status).toBe(400)
  })

  // ── Happy path ───────────────────────────────────────────────────────────

  it('devuelve clientSecret al frontend', async () => {
    const res = await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 0 }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.clientSecret).toBe('pi_test_secret_xxx')
  })

  it('calcula el importe correcto en céntimos (2×35€ = 7000)', async () => {
    await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 0 }))
    expect(mockCreatePaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 7000, currency: 'eur' })
    )
  })

  it('suma los gastos de envío al total', async () => {
    await POST(makeRequest({ items: baseItems, shippingCost: 4.95, discount: 0 }))
    // 70 + 4.95 = 74.95 → 7495 céntimos
    expect(mockCreatePaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 7495 })
    )
  })

  it('resta el descuento del total', async () => {
    // 70€ - 7€ (10%) = 63€ → 6300 céntimos
    await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 7 }))
    expect(mockCreatePaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 6300 })
    )
  })

  it('incluye automatic_payment_methods habilitado', async () => {
    await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 0 }))
    expect(mockCreatePaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ automatic_payment_methods: { enabled: true } })
    )
  })

  it('incluye userId en metadata si se proporciona', async () => {
    await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 0, userId: 'user-abc' }))
    expect(mockCreatePaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { user_id: 'user-abc' } })
    )
  })

  it('usa user_id vacío en metadata si no hay userId', async () => {
    await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 0 }))
    expect(mockCreatePaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { user_id: '' } })
    )
  })

  // ── Errores ──────────────────────────────────────────────────────────────

  it('devuelve 500 si Stripe lanza un error', async () => {
    mockCreatePaymentIntent.mockRejectedValue(new Error('Stripe error'))
    const res = await POST(makeRequest({ items: baseItems, shippingCost: 0, discount: 0 }))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })
})
