import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DatosPersonalesForm from '../DatosPersonalesForm'

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockActualizarPerfil = vi.hoisted(() => vi.fn())

vi.mock('@/actions/cuenta', () => ({
  actualizarPerfil: mockActualizarPerfil,
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
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

describe('DatosPersonalesForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockActualizarPerfil.mockResolvedValue(undefined)
  })

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('renderiza el campo de nombre con el valor actual', () => {
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    const nombreInput = screen.getByDisplayValue('Juan García')
    expect(nombreInput).toBeInTheDocument()
  })

  it('renderiza el campo de teléfono con el valor actual', () => {
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    expect(screen.getByDisplayValue('600123456')).toBeInTheDocument()
  })

  it('renderiza el email del usuario como campo deshabilitado', () => {
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    const emailInput = screen.getByDisplayValue('user@example.com')
    expect(emailInput).toBeDisabled()
  })

  it('renderiza campos vacíos si no hay perfil', () => {
    render(<DatosPersonalesForm user={mockUser} profile={null} />)
    // El nombre debe estar vacío
    const inputs = screen.getAllByRole('textbox')
    const nombreInput = inputs.find(i => (i as HTMLInputElement).name === 'nombre')
    expect((nombreInput as HTMLInputElement).value).toBe('')
  })

  it('renderiza el botón de guardar', () => {
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    expect(screen.getByRole('button', { name: /save_btn/i })).toBeInTheDocument()
  })

  // ── Submit ────────────────────────────────────────────────────────────────
  it('llama a actualizarPerfil al enviar el formulario', async () => {
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(mockActualizarPerfil).toHaveBeenCalledOnce()
    })
  })

  it('muestra mensaje de éxito tras guardar correctamente', async () => {
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.getByText('success')).toBeInTheDocument()
    })
  })

  it('muestra error si la action devuelve un error', async () => {
    mockActualizarPerfil.mockResolvedValue({ error: 'Error al guardar los datos.' })
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.getByText('Error al guardar los datos.')).toBeInTheDocument()
    })
  })

  it('no muestra mensaje de éxito si hay error', async () => {
    mockActualizarPerfil.mockResolvedValue({ error: 'Error al guardar los datos.' })
    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.queryByText('success')).not.toBeInTheDocument()
    })
  })

  // ── Deshabilita durante pending ───────────────────────────────────────────
  it('deshabilita el botón mientras isPending', async () => {
    let resolve: (val: undefined) => void
    mockActualizarPerfil.mockReturnValue(new Promise(r => { resolve = r }))

    render(<DatosPersonalesForm user={mockUser} profile={mockProfile} />)
    await user.click(screen.getByRole('button', { name: /save_btn/i }))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })

    resolve!(undefined)
  })
})
