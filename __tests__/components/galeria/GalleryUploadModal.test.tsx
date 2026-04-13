// __tests__/components/galeria/GalleryUploadModal.test.tsx

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

import { GalleryUploadModal } from '@/components/galeria/GalleryUploadModal'

afterEach(cleanup)

describe('GalleryUploadModal', () => {
  const onClose = vi.fn()
  const onSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the modal header', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    expect(screen.getByText('Subir nueva foto')).toBeTruthy()
  })

  it('renders the drop zone area', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    expect(screen.getByText('Arrastra una imagen aquí')).toBeTruthy()
  })

  it('renders the max size hint', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    expect(screen.getByText(/máx\. 10 MB/)).toBeTruthy()
  })

  it('calls onClose when Cancelar button is clicked', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when × close button is clicked', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when no file is selected', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const submitBtn = screen.getByText('Subir foto')
    expect(submitBtn).toBeDisabled()
  })

  it('renders all form fields', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    expect(screen.getByPlaceholderText('Una descripción de la foto...')).toBeTruthy()
    expect(screen.getByPlaceholderText('Describe lo que se ve en la imagen...')).toBeTruthy()
    expect(screen.getByPlaceholderText('ajedrez, tablero, colección...')).toBeTruthy()
  })

  it('renders category select with all options', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    expect(screen.getByText('General')).toBeTruthy()
    expect(screen.getByText('La tienda')).toBeTruthy()
    expect(screen.getByText('Productos')).toBeTruthy()
    expect(screen.getByText('Eventos')).toBeTruthy()
  })

  it('has "Visible al público" checkbox checked by default', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const checkboxes = screen.getAllByRole('checkbox')
    const visibleCheckbox = checkboxes[1] // second checkbox is "Visible al público"
    expect(visibleCheckbox).toBeChecked()
  })

  it('has "Destacada" checkbox unchecked by default', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const checkboxes = screen.getAllByRole('checkbox')
    const featuredCheckbox = checkboxes[0] // first checkbox is "Destacada"
    expect(featuredCheckbox).not.toBeChecked()
  })

  it('shows error when a non-image file is selected', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['text content'], 'document.pdf', { type: 'application/pdf' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('Solo se aceptan imágenes (JPG, PNG, WebP, etc.)')).toBeTruthy()
  })

  it('shows error when file exceeds 10 MB', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([''], 'large.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 })
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('El archivo supera el límite de 10 MB')).toBeTruthy()
  })

  it('clears error when a valid file is selected after invalid one', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    // First select invalid file
    const invalidFile = new File(['text'], 'doc.txt', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [invalidFile] } })
    expect(screen.getByText('Solo se aceptan imágenes (JPG, PNG, WebP, etc.)')).toBeTruthy()

    // Then select valid file
    const validFile = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
    fireEvent.change(input, { target: { files: [validFile] } })
    expect(screen.queryByText('Solo se aceptan imágenes (JPG, PNG, WebP, etc.)')).toBeNull()
  })

  it('allows typing in caption field', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const captionInput = screen.getByPlaceholderText('Una descripción de la foto...')
    fireEvent.change(captionInput, { target: { value: 'Mi foto de prueba' } })
    expect((captionInput as HTMLInputElement).value).toBe('Mi foto de prueba')
  })

  it('allows typing in alt text field', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const altInput = screen.getByPlaceholderText('Describe lo que se ve en la imagen...')
    fireEvent.change(altInput, { target: { value: 'Una foto de la tienda' } })
    expect((altInput as HTMLInputElement).value).toBe('Una foto de la tienda')
  })

  it('allows toggling featured checkbox', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const checkboxes = screen.getAllByRole('checkbox')
    const featuredCheckbox = checkboxes[0]
    expect(featuredCheckbox).not.toBeChecked()
    fireEvent.click(featuredCheckbox)
    expect(featuredCheckbox).toBeChecked()
  })

  it('allows toggling visible checkbox', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const checkboxes = screen.getAllByRole('checkbox')
    const visibleCheckbox = checkboxes[1]
    expect(visibleCheckbox).toBeChecked()
    fireEvent.click(visibleCheckbox)
    expect(visibleCheckbox).not.toBeChecked()
  })

  it('allows changing category', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'eventos' } })
    expect(select.value).toBe('eventos')
  })

  it('shows "general" as default category', () => {
    render(<GalleryUploadModal onClose={onClose} onSuccess={onSuccess} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('general')
  })
})
