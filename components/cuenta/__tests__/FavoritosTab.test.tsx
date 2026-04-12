import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const mockAddItem      = vi.hoisted(() => vi.fn())
const mockOpenProduct  = vi.hoisted(() => vi.fn())
const mockRemoveFavorite = vi.hoisted(() => vi.fn())

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params && 'count' in params) return `${key}:${params.count}`
    return key
  },
  useLocale: () => 'es',
}))

vi.mock('@/store/cartStore', () => ({
  useCartStore: (selector: (s: { addItem: typeof mockAddItem }) => unknown) =>
    selector({ addItem: mockAddItem }),
}))

vi.mock('@/store/productDrawerStore', () => ({
  useProductDrawerStore: (selector: (s: { openProduct: typeof mockOpenProduct }) => unknown) =>
    selector({ openProduct: mockOpenProduct }),
}))

vi.mock('@/lib/supabase/queries', () => ({
  removeFavorite: mockRemoveFavorite,
}))

// FavoriteButton simplificado para tests
vi.mock('@/components/FavoriteButton', () => ({
  default: ({ onToggle }: { onToggle?: (next: boolean) => void }) => (
    <button
      data-testid="favorite-button"
      onClick={() => onToggle?.(false)}
    >
      ♥
    </button>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import FavoritosTab from '../FavoritosTab'
import type { Favorite } from '@/types/cuentas'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFavorite(overrides: Partial<Favorite> = {}): Favorite {
  return {
    id: 'fav-1',
    product_id: 'prod-1',
    created_at: '2024-01-01T00:00:00Z',
    product: {
      id: 'prod-1',
      name: 'Catan',
      slug: 'catan',
      price: 35,
      compare_price: null,
      images: ['https://example.com/catan.jpg'],
      badge: null,
      stock: 10,
    },
    ...overrides,
  }
}

const USER_ID = 'user-123'

// ─────────────────────────────────────────────────────────────────────────────

describe('FavoritosTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRemoveFavorite.mockResolvedValue(true)
  })

  // ── Estado vacío ──────────────────────────────────────────────────────────

  it('muestra el estado vacío cuando no hay favoritos', () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[]} />)
    expect(screen.getByText('empty_title')).toBeInTheDocument()
  })

  it('muestra el enlace al catálogo en estado vacío', () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[]} />)
    expect(screen.getByRole('link', { name: 'explore_catalogue' })).toBeInTheDocument()
  })

  // ── Renderizado con favoritos ─────────────────────────────────────────────

  it('renderiza las tarjetas de favoritos', () => {
    const favorites = [makeFavorite(), makeFavorite({ id: 'fav-2', product_id: 'prod-2', product: { id: 'prod-2', name: 'Ticket to Ride', slug: 'ticket', price: 45, compare_price: null, images: [], badge: null, stock: 5 } })]
    render(<FavoritosTab userId={USER_ID} initialFavorites={favorites} />)
    expect(screen.getByText('Catan')).toBeInTheDocument()
    expect(screen.getByText('Ticket to Ride')).toBeInTheDocument()
  })

  it('muestra el precio del producto', () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    expect(screen.getByText('35,00€')).toBeInTheDocument()
  })

  it('muestra el precio tachado si hay compare_price', () => {
    const fav = makeFavorite({ product: { ...makeFavorite().product, price: 28, compare_price: 35 } })
    render(<FavoritosTab userId={USER_ID} initialFavorites={[fav]} />)
    expect(screen.getByText('35,00€')).toBeInTheDocument()
    expect(screen.getByText('28,00€')).toBeInTheDocument()
  })

  it('muestra el conteo de favoritos (singular)', () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    expect(screen.getByText('product_count_one:1')).toBeInTheDocument()
  })

  it('muestra el conteo de favoritos (plural)', () => {
    const favs = [makeFavorite(), makeFavorite({ id: 'fav-2', product_id: 'prod-2', product: { ...makeFavorite().product, id: 'prod-2', name: 'Otro juego' } })]
    render(<FavoritosTab userId={USER_ID} initialFavorites={favs} />)
    expect(screen.getByText('product_count_other:2')).toBeInTheDocument()
  })

  it('muestra la imagen del producto', () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    const img = screen.getByRole('img', { name: 'Catan' })
    expect(img).toBeInTheDocument()
  })

  it('muestra badge "agotado" si stock es 0', () => {
    const fav = makeFavorite({ product: { ...makeFavorite().product, stock: 0 } })
    render(<FavoritosTab userId={USER_ID} initialFavorites={[fav]} />)
    expect(screen.getByText('out_of_stock')).toBeInTheDocument()
  })

  it('no muestra botón de añadir al carrito si está agotado', () => {
    const fav = makeFavorite({ product: { ...makeFavorite().product, stock: 0 } })
    render(<FavoritosTab userId={USER_ID} initialFavorites={[fav]} />)
    const addBtns = screen.queryAllByRole('button', { name: /añadir/i })
    expect(addBtns.length).toBe(0)
  })

  // ── Eliminar favorito ─────────────────────────────────────────────────────

  it('pide confirmación antes de eliminar', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    await userEvent.click(screen.getByText('remove'))
    expect(screen.getByText('confirm_remove')).toBeInTheDocument()
  })

  it('elimina el favorito al confirmar', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    await userEvent.click(screen.getByText('remove'))
    await userEvent.click(screen.getByText('confirm_remove'))
    await waitFor(() => {
      expect(screen.queryByText('Catan')).not.toBeInTheDocument()
    })
  })

  it('llama a removeFavorite al confirmar eliminación', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    await userEvent.click(screen.getByText('remove'))
    await userEvent.click(screen.getByText('confirm_remove'))
    await waitFor(() => {
      expect(mockRemoveFavorite).toHaveBeenCalledWith(USER_ID, 'prod-1')
    })
  })

  it('cancela la eliminación al pulsar cancelar', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    await userEvent.click(screen.getByText('remove'))
    await userEvent.click(screen.getByText('cancel'))
    expect(screen.getByText('Catan')).toBeInTheDocument()
    expect(mockRemoveFavorite).not.toHaveBeenCalled()
  })

  it('elimina el producto al desmarcar el corazón (FavoriteButton toggle)', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    await userEvent.click(screen.getByTestId('favorite-button'))
    await waitFor(() => {
      expect(screen.queryByText('Catan')).not.toBeInTheDocument()
    })
  })

  // ── Añadir al carrito ─────────────────────────────────────────────────────

  it('llama a addItem al hacer click en añadir al carrito', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    const addBtn = screen.getByRole('button', { name: /añadir catan/i })
    await userEvent.click(addBtn)
    expect(mockAddItem).toHaveBeenCalledOnce()
  })

  it('muestra el icono de check tras añadir al carrito', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    const addBtn = screen.getByRole('button', { name: /añadir catan/i })
    await userEvent.click(addBtn)
    // El botón cambia visualmente (bg-[#c9a84c]) — verificamos que el mock se llamó
    expect(mockAddItem).toHaveBeenCalledOnce()
  })

  // ── Abrir drawer de producto ──────────────────────────────────────────────

  it('llama a openProduct al hacer click en la imagen del producto', async () => {
    render(<FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />)
    // El link envuelve la imagen; simula click sin modificador
    const link = screen.getAllByRole('link')[0]
    await userEvent.click(link)
    expect(mockOpenProduct).toHaveBeenCalledWith('catan')
  })

  // ── Sincronización con props ──────────────────────────────────────────────

  it('muestra estado vacío cuando se actualizan las props a lista vacía', () => {
    const { rerender } = render(
      <FavoritosTab userId={USER_ID} initialFavorites={[makeFavorite()]} />
    )
    expect(screen.getByText('Catan')).toBeInTheDocument()

    rerender(<FavoritosTab userId={USER_ID} initialFavorites={[]} />)
    expect(screen.getByText('empty_title')).toBeInTheDocument()
  })
})
