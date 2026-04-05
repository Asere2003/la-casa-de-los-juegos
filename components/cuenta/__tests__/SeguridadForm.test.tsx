import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SeguridadForm from '../SeguridadForm'

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockCambiarEmail    = vi.hoisted(() => vi.fn())
const mockCambiarPassword = vi.hoisted(() => vi.fn())

vi.mock('@/actions/cuenta', () => ({
  cambiarEmail: mockCambiarEmail,
  cambiarPassword: mockCambiarPassword,
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

describe('SeguridadForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCambiarEmail.mockResolvedValue(undefined)
    mockCambiarPassword.mockResolvedValue(undefined)
  })

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('renderiza el email actual del usuario como campo deshabilitado', () => {
    render(<SeguridadForm user={mockUser} />)
    const emailDisplay = screen.getByDisplayValue('user@example.com')
    expect(emailDisplay).toBeDisabled()
  })

  it('renderiza el campo de nuevo email', () => {
    render(<SeguridadForm user={mockUser} />)
    const newEmailInput = screen.getByPlaceholderText('new_email_placeholder')
    expect(newEmailInput).toBeInTheDocument()
  })

  it('renderiza el campo de nueva contraseña', () => {
    render(<SeguridadForm user={mockUser} />)
    const passwordInputs = screen.getAllByPlaceholderText('password_placeholder')
    expect(passwordInputs.length).toBeGreaterThan(0)
  })

  it('renderiza el campo de confirmar contraseña', () => {
    render(<SeguridadForm user={mockUser} />)
    expect(screen.getByPlaceholderText('confirm_password_placeholder')).toBeInTheDocument()
  })

  it('renderiza los botones de cambiar email y contraseña', () => {
    render(<SeguridadForm user={mockUser} />)
    expect(screen.getByRole('button', { name: /change_email_button/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /change_password_button/i })).toBeInTheDocument()
  })

  // ── Cambiar email ─────────────────────────────────────────────────────────
  it('llama a cambiarEmail al enviar el formulario de email', async () => {
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('new_email_placeholder'), 'nuevo@example.com')
    await user.click(screen.getByRole('button', { name: /change_email_button/i }))

    await waitFor(() => {
      expect(mockCambiarEmail).toHaveBeenCalledOnce()
    })
  })

  it('muestra email_success tras cambio exitoso', async () => {
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('new_email_placeholder'), 'nuevo@example.com')
    await user.click(screen.getByRole('button', { name: /change_email_button/i }))

    await waitFor(() => {
      expect(screen.getByText('email_success')).toBeInTheDocument()
    })
  })

  it('muestra error si cambiarEmail falla', async () => {
    mockCambiarEmail.mockResolvedValue({ error: 'Error al cambiar el email.' })
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('new_email_placeholder'), 'taken@example.com')
    await user.click(screen.getByRole('button', { name: /change_email_button/i }))

    await waitFor(() => {
      expect(screen.getByText('Error al cambiar el email.')).toBeInTheDocument()
    })
  })

  // ── Cambiar contraseña ────────────────────────────────────────────────────
  it('muestra error si las contraseñas no coinciden', async () => {
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('password_placeholder'), 'Password123!')
    await user.type(screen.getByPlaceholderText('confirm_password_placeholder'), 'DifferentPass!')
    await user.click(screen.getByRole('button', { name: /change_password_button/i }))

    await waitFor(() => {
      expect(screen.getByText('error_passwords_mismatch')).toBeInTheDocument()
    })
    expect(mockCambiarPassword).not.toHaveBeenCalled()
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('password_placeholder'), 'Short1')
    await user.type(screen.getByPlaceholderText('confirm_password_placeholder'), 'Short1')
    await user.click(screen.getByRole('button', { name: /change_password_button/i }))

    await waitFor(() => {
      expect(screen.getByText('error_password_too_short')).toBeInTheDocument()
    })
    expect(mockCambiarPassword).not.toHaveBeenCalled()
  })

  it('llama a cambiarPassword con datos válidos', async () => {
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('password_placeholder'), 'SecurePass123!')
    await user.type(screen.getByPlaceholderText('confirm_password_placeholder'), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: /change_password_button/i }))

    await waitFor(() => {
      expect(mockCambiarPassword).toHaveBeenCalledOnce()
    })
  })

  it('muestra password_success tras cambio exitoso', async () => {
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('password_placeholder'), 'SecurePass123!')
    await user.type(screen.getByPlaceholderText('confirm_password_placeholder'), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: /change_password_button/i }))

    await waitFor(() => {
      expect(screen.getByText('password_success')).toBeInTheDocument()
    })
  })

  it('muestra error si cambiarPassword falla', async () => {
    mockCambiarPassword.mockResolvedValue({ error: 'Error al cambiar la contraseña.' })
    render(<SeguridadForm user={mockUser} />)
    await user.type(screen.getByPlaceholderText('password_placeholder'), 'SecurePass123!')
    await user.type(screen.getByPlaceholderText('confirm_password_placeholder'), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: /change_password_button/i }))

    await waitFor(() => {
      expect(screen.getByText('Error al cambiar la contraseña.')).toBeInTheDocument()
    })
  })
})
