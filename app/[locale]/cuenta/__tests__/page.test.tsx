import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockRedirect = vi.hoisted(() => vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`) }))
const mockGetUser  = vi.hoisted(() => vi.fn())
const mockFrom     = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
      from: mockFrom,
    })
  ),
}))

vi.mock('@/components/cuenta/CuentaDashboard', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="cuenta-dashboard">
      <span data-testid="user-email">{(props.user as { email: string })?.email}</span>
      <span data-testid="orders-count">{(props.orders as unknown[])?.length}</span>
    </div>
  ),
}))

import CuentaPage from '../page'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildChain(data: unknown) {
  const chain: Record<string, unknown> = {}
  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.order = vi.fn(() => chain)
  chain.single = vi.fn().mockResolvedValue({ data, error: null })
  // For queries that return arrays directly (without .single())
  Object.defineProperty(chain, 'then', {
    get() {
      return (resolve: (v: { data: unknown; error: null }) => void) =>
        Promise.resolve({ data, error: null }).then(resolve)
    },
  })
  return chain
}

const loggedUser = {
  id: 'user_123',
  email: 'user@example.com',
}

describe('CuentaPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirige al login si no hay usuario autenticado', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    await expect(
      CuentaPage({ params: Promise.resolve({ locale: 'es' }) })
    ).rejects.toThrow('NEXT_REDIRECT:/es/login')
  })

  it('redirige con el locale correcto al login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    await expect(
      CuentaPage({ params: Promise.resolve({ locale: 'en' }) })
    ).rejects.toThrow('NEXT_REDIRECT:/en/login')
  })

  it('llama a redirect con la ruta de login correcta', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    try {
      await CuentaPage({ params: Promise.resolve({ locale: 'es' }) })
    } catch {
      // Expected redirect
    }

    expect(mockRedirect).toHaveBeenCalledWith('/es/login')
  })

  it('renderiza el CuentaDashboard si el usuario está autenticado', async () => {
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })

    // Mock de las distintas llamadas .from()
    const profileChain = buildChain({ id: 'user_123', nombre: 'Juan', telefono: null, direccion: null, ciudad: null, codigo_postal: null, pais: null })
    const ordersChain = buildChain([])
    const favoritesChain = buildChain([])
    const reviewsChain = buildChain([])

    // profileChain is used with .single(), rest return arrays
    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(ordersChain)
      .mockReturnValueOnce(favoritesChain)
      .mockReturnValueOnce(reviewsChain)

    const page = await CuentaPage({ params: Promise.resolve({ locale: 'es' }) })
    render(page as React.ReactElement)

    expect(screen.getByTestId('cuenta-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
  })

  it('pasa orders vacío si la consulta no devuelve pedidos', async () => {
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })

    const profileChain = buildChain(null)
    const ordersChain = buildChain(null)  // null → orders ?? [] = []
    const favoritesChain = buildChain([])
    const reviewsChain = buildChain([])

    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(ordersChain)
      .mockReturnValueOnce(favoritesChain)
      .mockReturnValueOnce(reviewsChain)

    const page = await CuentaPage({ params: Promise.resolve({ locale: 'es' }) })
    render(page as React.ReactElement)

    const ordersCountEls = screen.getAllByTestId('orders-count')
    expect(ordersCountEls[ordersCountEls.length - 1]).toHaveTextContent('0')
  })
})
