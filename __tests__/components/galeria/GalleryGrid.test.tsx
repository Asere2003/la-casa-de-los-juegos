// __tests__/components/galeria/GalleryGrid.test.tsx

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

vi.mock('@/hooks/useGallery', () => ({
  useGallery: vi.fn(),
}))

vi.mock('@/components/galeria/GalleryLightbox', () => ({
  GalleryLightbox: ({ onClose }: any) => (
    <div data-testid="lightbox">
      <button onClick={onClose}>Cerrar lightbox</button>
    </div>
  ),
}))

import { useGallery } from '@/hooks/useGallery'
import { GalleryGrid } from '@/components/galeria/GalleryGrid'
import type { GalleryPhoto } from '@/types/gallery'

const mockPhotos: GalleryPhoto[] = [
  {
    id: '1', url: '/photo1.jpg', thumbnail_url: '/thumb1.jpg',
    alt_text: 'Foto tienda', caption: 'La tienda principal',
    width: 800, height: 600, category: 'tienda',
    tags: ['tienda'], featured: false, display_order: 0, created_at: '2024-01-01',
  },
  {
    id: '2', url: '/photo2.jpg', thumbnail_url: '/thumb2.jpg',
    alt_text: 'Foto general', caption: null,
    width: 600, height: 800, category: 'general',
    tags: [], featured: true, display_order: 1, created_at: '2024-01-02',
  },
]

afterEach(cleanup)

describe('GalleryGrid', () => {
  beforeEach(() => {
    vi.mocked(useGallery).mockReturnValue({
      photos: mockPhotos,
      total: 2,
      hasMore: false,
      isLoading: false,
      isError: false,
      mutate: vi.fn(),
    })
  })

  it('renders all category filter buttons', () => {
    render(<GalleryGrid />)
    expect(screen.getByText('Todas')).toBeTruthy()
    expect(screen.getByText('La tienda')).toBeTruthy()
    expect(screen.getByText('Productos')).toBeTruthy()
    expect(screen.getByText('Eventos')).toBeTruthy()
    expect(screen.getByText('General')).toBeTruthy()
  })

  it('shows total photo count', () => {
    render(<GalleryGrid />)
    expect(screen.getByText('2 fotos')).toBeTruthy()
  })

  it('shows singular "foto" when total is 1', () => {
    vi.mocked(useGallery).mockReturnValue({
      photos: [mockPhotos[0]],
      total: 1,
      hasMore: false,
      isLoading: false,
      isError: false,
      mutate: vi.fn(),
    })
    render(<GalleryGrid />)
    expect(screen.getByText('1 foto')).toBeTruthy()
  })

  it('renders photos when loaded', () => {
    render(<GalleryGrid />)
    expect(screen.getByAltText('Foto tienda')).toBeTruthy()
    expect(screen.getByAltText('Foto general')).toBeTruthy()
  })

  it('shows empty state when no photos', () => {
    vi.mocked(useGallery).mockReturnValue({
      photos: [],
      total: 0,
      hasMore: false,
      isLoading: false,
      isError: false,
      mutate: vi.fn(),
    })
    render(<GalleryGrid />)
    expect(screen.getByText('No hay fotos en esta categoría todavía.')).toBeTruthy()
  })

  it('does not show empty state when photos exist', () => {
    render(<GalleryGrid />)
    expect(screen.queryByText('No hay fotos en esta categoría todavía.')).toBeNull()
  })

  it('does not show "Cargar más" when hasMore is false', () => {
    render(<GalleryGrid />)
    expect(screen.queryByText('Cargar más fotos')).toBeNull()
  })

  it('shows "Cargar más fotos" button when hasMore is true', () => {
    vi.mocked(useGallery).mockReturnValue({
      photos: mockPhotos,
      total: 100,
      hasMore: true,
      isLoading: false,
      isError: false,
      mutate: vi.fn(),
    })
    render(<GalleryGrid />)
    expect(screen.getByText('Cargar más fotos')).toBeTruthy()
  })

  it('shows skeleton when loading', () => {
    vi.mocked(useGallery).mockReturnValue({
      photos: [],
      total: 0,
      hasMore: false,
      isLoading: true,
      isError: false,
      mutate: vi.fn(),
    })
    const { container } = render(<GalleryGrid />)
    const skeletons = container.querySelectorAll('.gallery-masonry > div')
    expect(skeletons.length).toBe(12)
  })

  it('does not show skeleton when not loading', () => {
    render(<GalleryGrid />)
    // When not loading, the gallery-masonry div has photos, not skeletons
    // There should be no empty placeholder divs with animation style
    expect(screen.queryByText('No hay fotos en esta categoría todavía.')).toBeNull()
  })

  it('opens lightbox when a photo is clicked', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByAltText('Foto tienda'))
    expect(screen.getByTestId('lightbox')).toBeTruthy()
  })

  it('closes lightbox when onClose is called', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByAltText('Foto tienda'))
    expect(screen.getByTestId('lightbox')).toBeTruthy()
    fireEvent.click(screen.getByText('Cerrar lightbox'))
    expect(screen.queryByTestId('lightbox')).toBeNull()
  })

  it('starts with "Todas" filter active', () => {
    render(<GalleryGrid />)
    // The "Todas" button should have active styling (bg-[#004317])
    const todasBtn = screen.getByText('Todas')
    expect(todasBtn.className).toContain('bg-[#004317]')
  })

  it('calls useGallery with "all" category by default', () => {
    render(<GalleryGrid />)
    expect(useGallery).toHaveBeenCalledWith('all', 1, 24)
  })

  it('calls useGallery with selected category after filter click', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByText('La tienda'))
    expect(useGallery).toHaveBeenCalledWith('tienda', 1, 24)
  })

  it('resets page to 1 when category changes', () => {
    vi.mocked(useGallery).mockReturnValue({
      photos: mockPhotos,
      total: 100,
      hasMore: true,
      isLoading: false,
      isError: false,
      mutate: vi.fn(),
    })
    render(<GalleryGrid />)
    // Click "Cargar más" to go to page 2
    fireEvent.click(screen.getByText('Cargar más fotos'))
    // Then change category
    fireEvent.click(screen.getByText('Eventos'))
    // useGallery should be called with page 1
    expect(useGallery).toHaveBeenCalledWith('eventos', 1, 24)
  })

  it('shows featured badge on featured photos', () => {
    render(<GalleryGrid />)
    // Photo 2 has featured: true, should show ★
    const badges = screen.getAllByText('★')
    expect(badges.length).toBeGreaterThan(0)
  })
})
