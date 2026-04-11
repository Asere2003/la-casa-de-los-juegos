import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CartSummary from '../CartSummary'
import type { LocalCartItem, Product } from '@/types'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockItems       = vi.fn<() => LocalCartItem[]>()
const mockTotalPrice  = vi.fn<() => number>()

vi.mock('@/store/cartStore', () => ({
  useCartStore: (selector: (s: { items: LocalCartItem[]; totalPrice: () => number }) => unknown) =>
    selector({ items: mockItems(), totalPrice: mockTotalPrice }),
}))

const mockPush = vi.fn()
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params && 'remaining' in params) return `free_shipping_note:${params.remaining}`
    if (params && 'count' in params)     return `${key}:${params.count}`
    return key
  },
  useLocale: () => 'es',
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1', name: 'Catan', slug: 'catan', price: 30, stock: 10,
    images: [], featured: false, active: true,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeItem(price: number, qty = 1, id = 'prod-1'): LocalCartItem {
  return { product: makeProduct({ id, price }), quantity: qty }
}

// ─────────────────────────────────────────────────────────────────────────────

describe('components/carrito/CartSummary.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    })
  })

  // ── Cálculo de totales ─────────────────────────────────────────────────────

  it('muestra subtotal correcto', () => {
    mockItems.mockReturnValue([makeItem(30, 2)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    // React genera dos nodos de texto separados: "60,00" y "€"
    // Aparece al menos en el subtotal y el total (envío gratis)
    expect(screen.getAllByText(/60,00/).length).toBeGreaterThanOrEqual(1)
  })

  it('muestra envío gratis cuando el subtotal es ≥ 50€', () => {
    mockItems.mockReturnValue([makeItem(55)])
    mockTotalPrice.mockReturnValue(55)

    render(<CartSummary />)

    expect(screen.getByText('free')).toBeInTheDocument()
  })

  it('muestra coste de envío (4,95€) cuando el subtotal es < 50€', () => {
    mockItems.mockReturnValue([makeItem(30)])
    mockTotalPrice.mockReturnValue(30)

    render(<CartSummary />)

    expect(screen.getByText('4,95€')).toBeInTheDocument()
  })

  it('muestra nota de envío gratis pendiente cuando el subtotal es < 50€', () => {
    mockItems.mockReturnValue([makeItem(30)])
    mockTotalPrice.mockReturnValue(30)

    render(<CartSummary />)

    expect(screen.getByText(/free_shipping_note/)).toBeInTheDocument()
  })

  it('muestra el total correcto sin cupón ni envío', () => {
    mockItems.mockReturnValue([makeItem(55)])
    mockTotalPrice.mockReturnValue(55)

    render(<CartSummary />)

    // subtotal 55 + envío 0 = 55,00€
    // El total y el subtotal coinciden cuando hay envío gratis
    const amounts = screen.getAllByText('55,00€')
    expect(amounts.length).toBeGreaterThanOrEqual(1)
  })

  // ── Cupón ──────────────────────────────────────────────────────────────────

  it('aplica el cupón JUEGOS10 y muestra descuento del 10%', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.type(screen.getByLabelText(/coupon/i), 'JUEGOS10')
    await userEvent.click(screen.getByRole('button', { name: /^OK$/i }))

    await waitFor(() => {
      // El componente renderiza "✓ discount_applied"
      expect(screen.getByRole('status')).toHaveTextContent('discount_applied')
    })
  })

  it('muestra descuento correcto tras aplicar JUEGOS10 (10% de 60€ = 6€)', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.type(screen.getByLabelText(/coupon/i), 'JUEGOS10')
    await userEvent.click(screen.getByRole('button', { name: /^OK$/i }))

    await waitFor(() => {
      expect(screen.getByText('−6,00€')).toBeInTheDocument()
    })
  })

  it('acepta JUEGOS10 en minúsculas o mayúsculas', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.type(screen.getByLabelText(/coupon/i), 'juegos10')
    await userEvent.click(screen.getByRole('button', { name: /^OK$/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('discount_applied')
    })
  })

  it('muestra error con un código de cupón inválido', async () => {
    mockItems.mockReturnValue([makeItem(40)])
    mockTotalPrice.mockReturnValue(40)

    render(<CartSummary />)

    await userEvent.type(screen.getByLabelText(/coupon/i), 'NOEXISTE')
    await userEvent.click(screen.getByRole('button', { name: /^OK$/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('invalid_code')
  })

  it('deshabilita el input de cupón tras aplicarlo', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.type(screen.getByLabelText(/coupon/i), 'JUEGOS10')
    await userEvent.click(screen.getByRole('button', { name: /^OK$/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/coupon/i)).toBeDisabled()
    })
  })

  // ── Checkout ───────────────────────────────────────────────────────────────

  it('navega a /pago al hacer click en el botón de checkout', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.click(screen.getByRole('button', { name: /checkout/i }))

    expect(mockPush).toHaveBeenCalledOnce()
    expect(mockPush).toHaveBeenCalledWith('/pago')
  })

  it('no llama a fetch al hacer checkout', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.click(screen.getByRole('button', { name: /checkout/i }))

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('el botón de checkout nunca queda deshabilitado tras el click', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    const btn = screen.getByRole('button', { name: /checkout/i })
    await userEvent.click(btn)

    expect(btn).not.toBeDisabled()
  })

  it('navega a /pago incluso con cupón aplicado', async () => {
    mockItems.mockReturnValue([makeItem(60)])
    mockTotalPrice.mockReturnValue(60)

    render(<CartSummary />)

    await userEvent.type(screen.getByLabelText(/coupon/i), 'JUEGOS10')
    await userEvent.click(screen.getByRole('button', { name: /^OK$/i }))
    await userEvent.click(screen.getByRole('button', { name: /checkout/i }))

    expect(mockPush).toHaveBeenCalledWith('/pago')
  })

  it('navega a /pago con subtotal menor que 50€', async () => {
    mockItems.mockReturnValue([makeItem(30)])
    mockTotalPrice.mockReturnValue(30)

    render(<CartSummary />)

    await userEvent.click(screen.getByRole('button', { name: /checkout/i }))

    expect(mockPush).toHaveBeenCalledWith('/pago')
  })
})
