import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ClearCart from '../ClearCart'

// ── Mock del cartStore ────────────────────────────────────────────────────────

const mockClearCart = vi.fn()

vi.mock('@/store/cartStore', () => ({
  useCartStore: (selector: (s: { clearCart: () => void }) => unknown) =>
    selector({ clearCart: mockClearCart }),
}))

// ─────────────────────────────────────────────────────────────────────────────

describe('components/pedido/ClearCart.tsx', () => {
  beforeEach(() => {
    mockClearCart.mockClear()
  })

  it('llama a clearCart al montarse', () => {
    render(<ClearCart />)
    expect(mockClearCart).toHaveBeenCalledTimes(1)
  })

  it('no renderiza contenido visible', () => {
    const { container } = render(<ClearCart />)
    expect(container.firstChild).toBeNull()
  })

  it('no llama a clearCart más de una vez en el montaje inicial', () => {
    render(<ClearCart />)
    expect(mockClearCart).toHaveBeenCalledTimes(1)
  })
})
