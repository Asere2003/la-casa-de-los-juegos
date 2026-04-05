import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CuentaDashboard from '../CuentaDashboard'

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

vi.mock('@/lib/useUserReviews', () => ({
  useUserReviews: () => ({ data: [] }),
}))

// Mocks de componentes hijos pesados
vi.mock('../PedidosTab', () => ({
  default: () => <div data-testid="pedidos-tab">PedidosTab</div>,
}))

vi.mock('../FavoritosTab', () => ({
  default: () => <div data-testid="favoritos-tab">FavoritosTab</div>,
}))

vi.mock('../Resenastab', () => ({
  default: () => <div data-testid="resenas-tab">ResenasTab</div>,
}))

vi.mock('../AjustesTab', () => ({
  default: () => <div data-testid="ajustes-tab">AjustesTab</div>,
}))

// ─── Datos de prueba ──────────────────────────────────────────────────────────
const mockUser = {
  id: 'user_123',
  email: 'user@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01',
} as import('@supabase/supabase-js').User

const mockProfile = {
  id: 'user_123',
  nombre: 'Juan García',
  telefono: '600123456',
  direccion: 'Calle Mayor 1',
  ciudad: 'Granada',
  codigo_postal: '18001',
  pais: 'ES',
}

const defaultProps = {
  user: mockUser,
  profile: mockProfile,
  orders: [],
  favorites: [],
  reviews: [],
  purchasedProductIds: [],
}

describe('CuentaDashboard', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('renderiza el saludo con el primer nombre del perfil', () => {
    render(<CuentaDashboard {...defaultProps} />)
    // El nombre "Juan García" → primer nombre "Juan" aparece en el greeting
    expect(screen.getByText('Juan')).toBeInTheDocument()
  })

  it('muestra el email del usuario', () => {
    render(<CuentaDashboard {...defaultProps} />)
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
  })

  it('usa el nombre de usuario del email si no hay perfil con nombre', () => {
    render(<CuentaDashboard {...defaultProps} profile={null} />)
    // user@example.com → "user" como nombre
    expect(screen.getByText('user')).toBeInTheDocument()
  })

  it('muestra la pestaña de pedidos activa por defecto', () => {
    render(<CuentaDashboard {...defaultProps} />)
    expect(screen.getByTestId('pedidos-tab')).toBeInTheDocument()
  })

  it('no muestra otros tabs al inicio', () => {
    render(<CuentaDashboard {...defaultProps} />)
    expect(screen.queryByTestId('favoritos-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('resenas-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ajustes-tab')).not.toBeInTheDocument()
  })

  // ── Navegación de tabs ────────────────────────────────────────────────────
  it('cambia a la pestaña de favoritos al hacer click', async () => {
    render(<CuentaDashboard {...defaultProps} />)
    const favBtn = screen.getAllByRole('button').find(b => b.textContent?.includes('tabs.favoritos'))
    await user.click(favBtn!)

    await waitFor(() => {
      expect(screen.getByTestId('favoritos-tab')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('pedidos-tab')).not.toBeInTheDocument()
  })

  it('cambia a la pestaña de ajustes al hacer click', async () => {
    render(<CuentaDashboard {...defaultProps} />)
    const ajustesBtn = screen.getAllByRole('button').find(b => b.textContent?.includes('tabs.ajustes'))
    await user.click(ajustesBtn!)

    await waitFor(() => {
      expect(screen.getByTestId('ajustes-tab')).toBeInTheDocument()
    })
  })

  it('cambia a la pestaña de reseñas al hacer click', async () => {
    render(<CuentaDashboard {...defaultProps} />)
    const resenasBtn = screen.getAllByRole('button').find(b => b.textContent?.includes('tabs.resenas'))
    await user.click(resenasBtn!)

    await waitFor(() => {
      expect(screen.getByTestId('resenas-tab')).toBeInTheDocument()
    })
  })

  // ── Badges ────────────────────────────────────────────────────────────────
  it('muestra badge con el número de pedidos cuando hay pedidos', () => {
    const ordersWithData = [
      { id: 'order_1', status: 'paid', total: 50, created_at: '2024-01-01' },
      { id: 'order_2', status: 'delivered', total: 30, created_at: '2024-01-02' },
    ] as unknown as import('@/types/orders').Order[]

    render(<CuentaDashboard {...defaultProps} orders={ordersWithData} />)
    // Debe aparecer el badge "2" (hay 2 pedidos)
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
  })

  it('muestra badge con el número de favoritos cuando hay favoritos', () => {
    const favoritesWithData = [
      { id: 'fav_1', user_id: 'user_123', product_id: 'prod_1' },
    ] as unknown as import('@/types/cuentas').Favorite[]

    render(<CuentaDashboard {...defaultProps} favorites={favoritesWithData} />)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
  })

  it('no muestra badge de pedidos cuando no hay pedidos', () => {
    render(<CuentaDashboard {...defaultProps} orders={[]} />)
    // No debe haber un badge de número de pedidos
    // El texto del badge sería "0" pero no aparece si es 0
    const buttons = screen.getAllByRole('button')
    const pedidosBtn = buttons.find(b => b.textContent?.includes('tabs.pedidos'))
    // No debe contener ningún número badge
    expect(pedidosBtn?.textContent).not.toMatch(/\b[1-9]\d*\b/)
  })
})
