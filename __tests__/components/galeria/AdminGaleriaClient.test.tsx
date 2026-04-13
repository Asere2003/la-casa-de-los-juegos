// __tests__/components/galeria/AdminGaleriaClient.test.tsx

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

vi.mock('@/components/galeria/GalleryUploadModal', () => ({
  GalleryUploadModal: ({ onClose, onSuccess }: any) => (
    <div data-testid="upload-modal">
      <button onClick={onClose}>Cerrar modal</button>
      <button
        onClick={() => onSuccess({
          id: 'new', url: '/new.jpg', thumbnail_url: '/new-thumb.jpg',
          alt_text: 'Nueva foto', caption: 'Nueva', width: 800, height: 600,
          category: 'general', tags: [], featured: false, display_order: 99,
          created_at: '2024-06-01T00:00:00Z', visible: true,
          uploaded_by: 'user1', source_role: 'admin', updated_at: '2024-06-01T00:00:00Z'
        })}
      >
        Confirmar subida
      </button>
    </div>
  ),
}))

import { AdminGaleriaClient } from '@/app/[locale]/admin/galeria/AdminGaleriaClient'
import type { GalleryPhotoAdmin } from '@/types/gallery'

const mockPhotos: GalleryPhotoAdmin[] = [
  {
    id: '1', url: '/photo1.jpg', thumbnail_url: '/thumb1.jpg',
    alt_text: 'Foto uno', caption: 'Caption uno',
    width: 800, height: 600, category: 'general',
    tags: ['tag1'], featured: false, display_order: 0,
    created_at: '2024-01-15T10:00:00Z',
    visible: true, uploaded_by: 'user1', source_role: 'admin',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2', url: '/photo2.jpg', thumbnail_url: '/thumb2.jpg',
    alt_text: 'Foto dos', caption: null,
    width: 600, height: 800, category: 'tienda',
    tags: [], featured: true, display_order: 1,
    created_at: '2024-02-20T12:00:00Z',
    visible: false, uploaded_by: 'user1', source_role: 'admin',
    updated_at: '2024-02-20T12:00:00Z',
  },
]

afterEach(cleanup)

describe('AdminGaleriaClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.confirm = vi.fn(() => true)
  })

  // ── Header ─────────────────────────────────────────────

  it('renders the admin panel eyebrow text', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('Panel de administración')).toBeTruthy()
  })

  it('renders the Galería heading', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('Galería')).toBeTruthy()
  })

  it('shows total photo count in plural', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('2 fotos en total')).toBeTruthy()
  })

  it('shows total photo count in singular', () => {
    render(<AdminGaleriaClient initialPhotos={[mockPhotos[0]]} />)
    expect(screen.getByText('1 foto en total')).toBeTruthy()
  })

  it('shows 0 photos message when empty', () => {
    render(<AdminGaleriaClient initialPhotos={[]} />)
    expect(screen.getByText('0 fotos en total')).toBeTruthy()
  })

  // ── Upload modal ────────────────────────────────────────

  it('renders the "Subir foto" button', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('+ Subir foto')).toBeTruthy()
  })

  it('opens upload modal when "Subir foto" is clicked', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    fireEvent.click(screen.getByText('+ Subir foto'))
    expect(screen.getByTestId('upload-modal')).toBeTruthy()
  })

  it('closes upload modal when onClose is called', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    fireEvent.click(screen.getByText('+ Subir foto'))
    fireEvent.click(screen.getByText('Cerrar modal'))
    expect(screen.queryByTestId('upload-modal')).toBeNull()
  })

  it('adds new photo to list after successful upload', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    fireEvent.click(screen.getByText('+ Subir foto'))
    fireEvent.click(screen.getByText('Confirmar subida'))
    // Modal closes and total updates to 3
    expect(screen.queryByTestId('upload-modal')).toBeNull()
    expect(screen.getByText('3 fotos en total')).toBeTruthy()
  })

  // ── Filters ─────────────────────────────────────────────

  it('renders all filter buttons with counts', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    // All: 2, General: 1, Tienda: 1, Productos: 0, Eventos: 0
    expect(screen.getByText(/Todas/)).toBeTruthy()
    expect(screen.getByText(/General/)).toBeTruthy()
    expect(screen.getByText(/La tienda/)).toBeTruthy()
    expect(screen.getByText(/Productos/)).toBeTruthy()
    expect(screen.getByText(/Eventos/)).toBeTruthy()
  })

  it('filters photos by General category', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    const generalBtn = screen.getAllByText(/General/).find(el => el.tagName === 'BUTTON')!
    fireEvent.click(generalBtn)
    expect(screen.getByAltText('Foto uno')).toBeTruthy()
    expect(screen.queryByAltText('Foto dos')).toBeNull()
  })

  it('shows empty state when filter has no results', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    const eventosBtn = screen.getAllByText(/Eventos/).find(el => el.tagName === 'BUTTON')!
    fireEvent.click(eventosBtn)
    expect(screen.getByText('No hay fotos en esta categoría. Sube la primera.')).toBeTruthy()
  })

  it('shows all photos when "Todas" filter is active', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByAltText('Foto uno')).toBeTruthy()
    expect(screen.getByAltText('Foto dos')).toBeTruthy()
  })

  // ── Photo cards ─────────────────────────────────────────

  it('renders photo captions when available', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('Caption uno')).toBeTruthy()
  })

  it('shows "Oculta" badge for non-visible photos', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('Oculta')).toBeTruthy()
  })

  it('shows "★ Dest." badge for featured photos', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('★ Dest.')).toBeTruthy()
  })

  it('shows "Ocultar" for visible photos and "Publicar" for hidden ones', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    expect(screen.getByText('Ocultar')).toBeTruthy()   // photo 1 is visible
    expect(screen.getByText('Publicar')).toBeTruthy()  // photo 2 is hidden
  })

  // ── Toggle visible ──────────────────────────────────────

  it('calls PATCH API to toggle visibility', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    fireEvent.click(screen.getByText('Ocultar'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/gallery/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ visible: false }),
        })
      )
    })
  })

  it('shows error toast on toggle visible failure', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: false } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    fireEvent.click(screen.getByText('Ocultar'))

    await waitFor(() => {
      expect(screen.getByText('Error al actualizar')).toBeTruthy()
    })
  })

  // ── Toggle featured ─────────────────────────────────────

  it('calls PATCH API to toggle featured', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    // Photo 1 is not featured (shows ☆), click to feature it
    const starButtons = screen.getAllByTitle(/Destacar|Quitar destacada/)
    fireEvent.click(starButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/gallery/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ featured: true }),
        })
      )
    })
  })

  // ── Delete ──────────────────────────────────────────────

  it('calls DELETE API after confirm', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    const deleteButtons = screen.getAllByText('Eliminar')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/gallery/1',
        { method: 'DELETE' }
      )
    })
  })

  it('removes photo from list after successful delete', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    const deleteButtons = screen.getAllByText('Eliminar')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.queryByAltText('Foto uno')).toBeNull()
    })
  })

  it('does not call DELETE when confirm returns false', () => {
    global.confirm = vi.fn(() => false)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    const deleteButtons = screen.getAllByText('Eliminar')
    fireEvent.click(deleteButtons[0])

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows error toast on delete failure', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: false } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    const deleteButtons = screen.getAllByText('Eliminar')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar')).toBeTruthy()
    })
  })

  // ── Success toast ───────────────────────────────────────

  it('shows success toast after delete', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as any)
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)

    const deleteButtons = screen.getAllByText('Eliminar')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Foto eliminada')).toBeTruthy()
    })
  })

  it('shows success toast after upload', () => {
    render(<AdminGaleriaClient initialPhotos={mockPhotos} />)
    fireEvent.click(screen.getByText('+ Subir foto'))
    fireEvent.click(screen.getByText('Confirmar subida'))
    expect(screen.getByText('Foto subida correctamente')).toBeTruthy()
  })
})
