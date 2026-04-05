import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DireccionForm from '../DireccionForm'

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockActualizarDireccion = vi.hoisted(() => vi.fn())

vi.mock('@/actions/cuenta', () => ({
  actualizarDireccion: mockActualizarDireccion,
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// ─── Datos de prueba ──────────────────────────────────────────────────────────
const mockProfile = {
  id: 'user_123',
  nombre: 'Juan García',
  telefono: '600123456',
  direccion: 'Calle Mayor 1',
  ciudad: 'Granada',
  codigo_postal: '18001',
  pais: 'ES',
}

describe('DireccionForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockActualizarDireccion.mockResolvedValue(undefined)
  })

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('renderiza el campo de dirección con el valor actual', () => {
    render(<DireccionForm profile={mockProfile} />)
    expect(screen.getByDisplayValue('Calle Mayor 1')).toBeInTheDocument()
  })

  it('renderiza el campo de ciudad con el valor actual', () => {
    render(<DireccionForm profile={mockProfile} />)
    expect(screen.getByDisplayValue('Granada')).toBeInTheDocument()
  })

  it('renderiza el campo de código postal con el valor actual', () => {
    render(<DireccionForm profile={mockProfile} />)
    expect(screen.getByDisplayValue('18001')).toBeInTheDocument()
  })

  it('renderiza el selector de país con España por defecto', () => {
    render(<DireccionForm profile={mockProfile} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    // ES es el valor seleccionado
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('ES')
  })

  it('renderiza el botón de guardar', () => {
    render(<DireccionForm profile={mockProfile} />)
    expect(screen.getByRole('button', { name: /save_btn/i })).toBeInTheDocument()
  })

  it('renderiza campos vacíos si no hay perfil', () => {
    render(<DireccionForm profile={null} />)
    const input = screen.getByLabelText(/address_label/i) as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('el selector muestra "ES" si no hay perfil (por defecto)', () => {
    render(<DireccionForm profile={null} />)
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('ES')
  })

  // ── Submit ────────────────────────────────────────────────────────────────
  it('llama a actualizarDireccion al enviar el formulario', async () => {
    render(<DireccionForm profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(mockActualizarDireccion).toHaveBeenCalledOnce()
    })
  })

  it('muestra mensaje de éxito tras guardar correctamente', async () => {
    render(<DireccionForm profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.getByText('success')).toBeInTheDocument()
    })
  })

  it('muestra error si la action devuelve un error', async () => {
    mockActualizarDireccion.mockResolvedValue({ error: 'Error al guardar la dirección.' })
    render(<DireccionForm profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.getByText('Error al guardar la dirección.')).toBeInTheDocument()
    })
  })

  it('no muestra éxito si hay error', async () => {
    mockActualizarDireccion.mockResolvedValue({ error: 'Error al guardar la dirección.' })
    render(<DireccionForm profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.queryByText('success')).not.toBeInTheDocument()
    })
  })

  // ── Selector de países ────────────────────────────────────────────────────
  it('permite seleccionar otro país', async () => {
    render(<DireccionForm profile={mockProfile} />)
    await user.selectOptions(screen.getByRole('combobox'), 'PT')
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('PT')
  })

  // ── Deshabilita durante pending ───────────────────────────────────────────
  it('deshabilita el botón mientras isPending', async () => {
    let resolve: (val: undefined) => void
    mockActualizarDireccion.mockReturnValue(new Promise(r => { resolve = r }))

    render(<DireccionForm profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })

    resolve!(undefined)
  })
})
