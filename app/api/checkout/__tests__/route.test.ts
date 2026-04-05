import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ── vi.hoisted — las variables se crean antes del hoisting de vi.mock() ───────

const { mockCreateSession, mockGetUser, mockProfileSingle } = vi.hoisted(() => ({
  mockCreateSession:  vi.fn(),
  mockGetUser:        vi.fn(),
  mockProfileSingle:  vi.fn(),
}))

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('stripe', () => ({
  default: class MockStripe {
    checkout = {
      sessions: {
        create: (...args: unknown[]) => mockCreateSession(...args),
      },
    }
  },
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: mockProfileSingle,
    })),
  })),
}))

// ── Importar DESPUÉS de los mocks ─────────────────────────────────────────────

import { POST } from '../route'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/checkout', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

const baseItems = [
  {
    product:  { name: 'Catan', images: ['https://img.example.com/catan.jpg'], price: 45.99 },
    quantity: 2,
  },
]

// ─────────────────────────────────────────────────────────────────────────────

describe('app/api/checkout/route.ts — POST', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY    = 'sk_test_fake'
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'

    // Por defecto: usuario no autenticado
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockProfileSingle.mockResolvedValue({ data: null })

    // Por defecto: Stripe devuelve una session URL
    mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/test-session' })
  })

  // ── Validación de entrada ────────────────────────────────────────────────

  it('devuelve 400 si el carrito está vacío', async () => {
    const req = makeRequest({ items: [], shippingCost: 0, discount: 0, locale: 'es' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('devuelve 400 si items no existe en el body', async () => {
    const req = makeRequest({ shippingCost: 0, discount: 0, locale: 'es' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  // ── Happy path — usuario invitado ────────────────────────────────────────

  it('crea la sesión de Stripe con line_items correctos', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    expect(mockCreateSession).toHaveBeenCalledTimes(1)
    const callArg = mockCreateSession.mock.calls[0][0]

    expect(callArg.line_items[0]).toMatchObject({
      price_data: {
        currency:     'eur',
        product_data: { name: 'Catan' },
        unit_amount:  4599,
      },
      quantity: 2,
    })
  })

  it('devuelve la URL de Stripe al frontend', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.url).toBe('https://checkout.stripe.com/test-session')
  })

  it('usa modo "payment" en la sesión de Stripe', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    expect(mockCreateSession.mock.calls[0][0].mode).toBe('payment')
  })

  it('incluye success_url y cancel_url con el locale correcto', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    const callArg = mockCreateSession.mock.calls[0][0]
    expect(callArg.success_url).toContain('/es/pedido/confirmacion')
    expect(callArg.cancel_url).toContain('/es/carrito')
  })

  it('solicita dirección de envío cuando el usuario es invitado', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    const callArg = mockCreateSession.mock.calls[0][0]
    expect(callArg.shipping_address_collection).toBeDefined()
    expect(callArg.shipping_address_collection.allowed_countries).toContain('ES')
  })

  // ── Happy path — usuario autenticado ────────────────────────────────────

  it('no solicita dirección si el usuario tiene perfil con dirección completa', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'uid-1', email: 'user@test.com' } },
    })
    mockProfileSingle.mockResolvedValue({
      data: { nombre: 'Ana', direccion: 'Calle Mayor 1', ciudad: 'Granada', codigo_postal: '18001', pais: 'ES' },
    })

    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    const callArg = mockCreateSession.mock.calls[0][0]
    expect(callArg.shipping_address_collection).toBeUndefined()
  })

  it('solicita dirección si el perfil existe pero le falta la ciudad', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'uid-1', email: 'user@test.com' } },
    })
    mockProfileSingle.mockResolvedValue({
      data: { nombre: 'Ana', direccion: 'Calle Mayor 1', ciudad: null },
    })

    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    const callArg = mockCreateSession.mock.calls[0][0]
    expect(callArg.shipping_address_collection).toBeDefined()
  })

  it('incluye el email del usuario en la sesión de Stripe', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'uid-1', email: 'user@test.com' } },
    })

    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    expect(mockCreateSession.mock.calls[0][0].customer_email).toBe('user@test.com')
  })

  it('incluye user_id en los metadata', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'uid-abc', email: 'user@test.com' } },
    })

    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    expect(mockCreateSession.mock.calls[0][0].metadata).toMatchObject({
      user_id: 'uid-abc',
      locale:  'es',
    })
  })

  // ── Envío y descuento ────────────────────────────────────────────────────

  it('añade línea de envío si shippingCost es mayor que 0', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 4.95, discount: 0, locale: 'es' })
    await POST(req)

    const lineItems = mockCreateSession.mock.calls[0][0].line_items
    const shippingLine = lineItems.find(
      (li: { price_data: { product_data: { name: string } } }) =>
        li.price_data.product_data.name === 'Gastos de envío'
    )
    expect(shippingLine).toBeDefined()
    expect(shippingLine.price_data.unit_amount).toBe(495)
  })

  it('no añade línea de envío si shippingCost es 0', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    await POST(req)

    const lineItems = mockCreateSession.mock.calls[0][0].line_items
    const shippingLine = lineItems.find(
      (li: { price_data: { product_data: { name: string } } }) =>
        li.price_data.product_data.name === 'Gastos de envío'
    )
    expect(shippingLine).toBeUndefined()
  })

  it('añade línea de descuento negativa si discount es mayor que 0', async () => {
    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 5, locale: 'es' })
    await POST(req)

    const lineItems = mockCreateSession.mock.calls[0][0].line_items
    const discountLine = lineItems.find(
      (li: { price_data: { unit_amount: number } }) => li.price_data.unit_amount < 0
    )
    expect(discountLine).toBeDefined()
    expect(discountLine.price_data.unit_amount).toBe(-500)
  })

  // ── Errores ──────────────────────────────────────────────────────────────

  it('devuelve 500 si Stripe lanza un error', async () => {
    mockCreateSession.mockRejectedValue(new Error('Stripe network error'))

    const req = makeRequest({ items: baseItems, shippingCost: 0, discount: 0, locale: 'es' })
    const res = await POST(req)

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})
