import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const mockSend = vi.hoisted(() => vi.fn())

vi.mock('resend', () => {
  class MockResend {
    emails = { send: mockSend }
  }
  return { Resend: MockResend }
})

// ─── Import after mocks ───────────────────────────────────────────────────────
import { sendConfirmacionPedido, sendNuevoPedidoAdmin } from '../confirmacion-pedido'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const baseItems = [
  { product_name: 'Catan', product_image: null, quantity: 2, price: 30, subtotal: 60 },
  { product_name: 'Carcassonne', product_image: null, quantity: 1, price: 25, subtotal: 25 },
]

const baseConfirmacionProps = {
  to: 'cliente@example.com',
  orderNumber: 'ABC12345',
  total: 85,
  shippingCost: 0,
  items: baseItems,
  shippingName: 'Juan García',
  shippingAddress: 'Calle Mayor 1',
  shippingCity: 'Granada',
  shippingPostalCode: '18001',
}

const baseAdminProps = {
  customerEmail: 'cliente@example.com',
  orderNumber: 'ABC12345',
  orderId: 'order-uuid-abc',
  total: 85,
  shippingCost: 4.95,
  items: baseItems,
  shippingName: 'Juan García',
  shippingAddress: 'Calle Mayor 1',
  shippingCity: 'Granada',
  shippingPostalCode: '18001',
}

describe('sendConfirmacionPedido', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'resend_test_key'
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'info@lacasadelosjuegos.com'
    mockSend.mockResolvedValue({ data: { id: 'email_id' }, error: null })
  })

  it('llama a resend.emails.send con el destinatario correcto', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'cliente@example.com' })
    )
  })

  it('incluye el número de pedido en el asunto', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.subject).toContain('ABC12345')
  })

  it('incluye el número de pedido en el HTML', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('ABC12345')
  })

  it('incluye el nombre de los productos en el HTML', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('Catan')
    expect(call.html).toContain('Carcassonne')
  })

  it('incluye el total formateado en el HTML', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('85.00')
  })

  it('muestra "Gratis" cuando shippingCost es 0', async () => {
    await sendConfirmacionPedido({ ...baseConfirmacionProps, shippingCost: 0 })
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('Gratis')
  })

  it('muestra el coste de envío cuando shippingCost > 0', async () => {
    await sendConfirmacionPedido({ ...baseConfirmacionProps, shippingCost: 4.95 })
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('4.95')
    expect(call.html).not.toContain('>Gratis<')
  })

  it('incluye la dirección de envío cuando existe', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('Calle Mayor 1')
    expect(call.html).toContain('Granada')
    expect(call.html).toContain('18001')
  })

  it('no incluye datos de dirección si shippingAddress es null', async () => {
    await sendConfirmacionPedido({ ...baseConfirmacionProps, shippingAddress: null, shippingCity: null, shippingPostalCode: null })
    const call = mockSend.mock.calls[0][0]
    // The actual address content (street, city) must not appear
    expect(call.html).not.toContain('Calle Mayor 1')
    expect(call.html).not.toContain('18001')
  })

  it('usa la variable NEXT_PUBLIC_CONTACT_EMAIL como remitente', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.from).toContain('info@lacasadelosjuegos.com')
  })

  it('no lanza si resend devuelve error (solo loguea)', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Rate limit' } })
    await expect(sendConfirmacionPedido(baseConfirmacionProps)).resolves.not.toThrow()
  })

  it('incluye las cantidades y precios de los productos', async () => {
    await sendConfirmacionPedido(baseConfirmacionProps)
    const call = mockSend.mock.calls[0][0]
    // Catan: 2 × 30.00 €
    expect(call.html).toContain('2 × 30.00 €')
    expect(call.html).toContain('60.00 €')
  })
})

describe('sendNuevoPedidoAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'resend_test_key'
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'info@lacasadelosjuegos.com'
    process.env.ADMIN_EMAIL = 'admin@lacasadelosjuegos.com'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://lacasadelosjuegos.com'
    mockSend.mockResolvedValue({ data: { id: 'email_id' }, error: null })
  })

  it('no envía email si ADMIN_EMAIL no está definido', async () => {
    delete process.env.ADMIN_EMAIL
    await sendNuevoPedidoAdmin(baseAdminProps)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('envía al email de admin cuando está configurado', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'admin@lacasadelosjuegos.com' })
    )
  })

  it('incluye el número de pedido en el asunto', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.subject).toContain('ABC12345')
  })

  it('incluye el email del cliente en el HTML', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('cliente@example.com')
  })

  it('incluye el total formateado en el HTML', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('85.00')
  })

  it('incluye enlace al panel de admin con el orderId', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('order-uuid-abc')
    expect(call.html).toContain('/es/admin/pedidos/')
  })

  it('muestra "Gratis" para envío cuando shippingCost es 0', async () => {
    await sendNuevoPedidoAdmin({ ...baseAdminProps, shippingCost: 0 })
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('Gratis')
  })

  it('muestra coste de envío cuando shippingCost > 0', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('4.95 €')
  })

  it('incluye la dirección de envío cuando existe', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('Calle Mayor 1')
    expect(call.html).toContain('Granada')
  })

  it('no incluye datos de dirección si shippingAddress es null', async () => {
    await sendNuevoPedidoAdmin({ ...baseAdminProps, shippingAddress: null, shippingCity: null, shippingPostalCode: null })
    const call = mockSend.mock.calls[0][0]
    expect(call.html).not.toContain('Calle Mayor 1')
    expect(call.html).not.toContain('18001')
  })

  it('no lanza si resend devuelve error (solo loguea)', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Quota exceeded' } })
    await expect(sendNuevoPedidoAdmin(baseAdminProps)).resolves.not.toThrow()
  })

  it('incluye el nombre del cliente si está disponible', async () => {
    await sendNuevoPedidoAdmin(baseAdminProps)
    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain('Juan García')
  })
})
