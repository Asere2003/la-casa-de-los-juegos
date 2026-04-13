// __tests__/components/galeria/GalleryLightbox.test.tsx

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GalleryLightbox } from '@/components/galeria/GalleryLightbox'
import type { GalleryPhoto } from '@/types/gallery'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} />,
}))

const mockPhotos: GalleryPhoto[] = [
  {
    id: '1', url: '/photo1.jpg', thumbnail_url: '/thumb1.jpg',
    alt_text: 'Photo 1', caption: 'Caption 1',
    width: 800, height: 600, category: 'general',
    tags: [], featured: false, display_order: 0, created_at: '2024-01-01',
  },
  {
    id: '2', url: '/photo2.jpg', thumbnail_url: '/thumb2.jpg',
    alt_text: 'Photo 2', caption: null,
    width: 800, height: 600, category: 'tienda',
    tags: [], featured: true, display_order: 1, created_at: '2024-01-02',
  },
  {
    id: '3', url: '/photo3.jpg', thumbnail_url: '/thumb3.jpg',
    alt_text: 'Photo 3', caption: 'Caption 3',
    width: 800, height: 600, category: 'eventos',
    tags: [], featured: false, display_order: 2, created_at: '2024-01-03',
  },
]

afterEach(() => {
  cleanup()
  // Restore body overflow after each test
  document.body.style.overflow = ''
})

describe('GalleryLightbox', () => {
  it('renders the current photo by alt text', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByAltText('Photo 1')).toBeTruthy()
  })

  it('shows the counter with correct position', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('2 / 3')).toBeTruthy()
  })

  it('shows counter "1 / 3" for first photo', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('1 / 3')).toBeTruthy()
  })

  it('shows caption when photo has one', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('Caption 1')).toBeTruthy()
  })

  it('does not show caption when photo has none', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    // Photo 2 has no caption
    expect(screen.queryByText('Caption 1')).toBeNull()
  })

  it('does not show Anterior button on first photo', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.queryByLabelText('Anterior')).toBeNull()
  })

  it('does not show Siguiente button on last photo', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={2}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.queryByLabelText('Siguiente')).toBeNull()
  })

  it('shows Anterior button when not on first photo', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByLabelText('Anterior')).toBeTruthy()
  })

  it('shows Siguiente button when not on last photo', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByLabelText('Siguiente')).toBeTruthy()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev when ArrowLeft key is pressed and not on first photo', () => {
    const onPrev = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={vi.fn()}
      />
    )
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('does not call onPrev on ArrowLeft when on first photo', () => {
    const onPrev = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={vi.fn()}
      />
    )
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(onPrev).not.toHaveBeenCalled()
  })

  it('calls onNext when ArrowRight key is pressed and not on last photo', () => {
    const onNext = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={onNext}
      />
    )
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('does not call onNext on ArrowRight when on last photo', () => {
    const onNext = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={2}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={onNext}
      />
    )
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(onNext).not.toHaveBeenCalled()
  })

  it('calls onClose when Cerrar button is clicked', () => {
    const onClose = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev when Anterior button is clicked', () => {
    const onPrev = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Anterior'))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when Siguiente button is clicked', () => {
    const onNext = vi.fn()
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={onNext}
      />
    )
    fireEvent.click(screen.getByLabelText('Siguiente'))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('returns null when photo index is out of bounds', () => {
    const { container } = render(
      <GalleryLightbox
        photos={[]}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('sets body overflow to hidden while open', () => {
    render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <GalleryLightbox
        photos={mockPhotos}
        currentIndex={0}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    )
    // Click the outer backdrop div (first child)
    fireEvent.click(container.firstChild as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
