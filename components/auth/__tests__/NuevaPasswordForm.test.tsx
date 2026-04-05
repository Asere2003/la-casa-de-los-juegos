import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NuevaPasswordForm from '../NuevaPasswordForm'

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockPush = vi.fn()

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('NuevaPasswordForm', () => {
  const mockAction = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockAction.mockResolvedValue({ success: true })
  })

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('renderiza el campo de nueva contraseña', () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    expect(screen.getByLabelText(/new_password_title/i)).toBeInTheDocument()
  })

  it('renderiza el campo de confirmación', () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    expect(screen.getByLabelText(/confirm_password/i)).toBeInTheDocument()
  })

  it('renderiza el botón de envío', () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    expect(screen.getByRole('button', { name: /submit_new_password/i })).toBeInTheDocument()
  })

  // ── Validación client-side ────────────────────────────────────────────────
  it('muestra error si las contraseñas no coinciden', async () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'password123')
    await user.type(screen.getByLabelText(/confirm_password/i), 'different123')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_passwords_mismatch')).toBeInTheDocument()
    })
  })

  it('no llama a la action si las contraseñas no coinciden', async () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'password123')
    await user.type(screen.getByLabelText(/confirm_password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    expect(mockAction).not.toHaveBeenCalled()
  })

  it('muestra error si la contraseña tiene menos de 6 caracteres', async () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'abc')
    await user.type(screen.getByLabelText(/confirm_password/i), 'abc')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_password_min_6')).toBeInTheDocument()
    })
  })

  it('no llama a la action si la contraseña es demasiado corta', async () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'abc')
    await user.type(screen.getByLabelText(/confirm_password/i), 'abc')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    expect(mockAction).not.toHaveBeenCalled()
  })

  // ── Happy path ────────────────────────────────────────────────────────────
  it('llama a la action con los datos del formulario en el happy path', async () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'securePassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'securePassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledOnce()
    })

    const formData = mockAction.mock.calls[0][0] as FormData
    expect(formData.get('password')).toBe('securePassword1')
  })

  it('redirige a /cuenta tras actualizar correctamente', async () => {
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'securePassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'securePassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/cuenta')
    })
  })

  // ── Errores del servidor ──────────────────────────────────────────────────
  it('muestra error_same_password cuando el servidor devuelve ese error', async () => {
    mockAction.mockResolvedValue({
      error: 'New password should be different from the old password.',
    })
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'sameOldPassword')
    await user.type(screen.getByLabelText(/confirm_password/i), 'sameOldPassword')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_same_password')).toBeInTheDocument()
    })
  })

  it('muestra error_session_missing cuando la sesión ha expirado', async () => {
    mockAction.mockResolvedValue({ error: 'Auth session missing!' })
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'validPassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'validPassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_session_missing')).toBeInTheDocument()
    })
  })

  it('muestra error_too_many_requests para rate limit', async () => {
    mockAction.mockResolvedValue({ error: 'Too many requests' })
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'validPassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'validPassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_too_many_requests')).toBeInTheDocument()
    })
  })

  it('muestra error_generic para errores desconocidos', async () => {
    mockAction.mockResolvedValue({ error: 'Unexpected error xyz' })
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'validPassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'validPassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_generic')).toBeInTheDocument()
    })
  })

  it('no redirige si la action devuelve un error', async () => {
    mockAction.mockResolvedValue({ error: 'Auth session missing!' })
    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'validPassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'validPassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByText('error_session_missing')).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  // ── Deshabilita botón durante envío ───────────────────────────────────────
  it('deshabilita el botón mientras isPending', async () => {
    let resolveAction: (val: { success: boolean }) => void
    mockAction.mockReturnValue(new Promise(r => { resolveAction = r }))

    render(<NuevaPasswordForm action={mockAction} locale="es" />)
    await user.type(screen.getByLabelText(/new_password_title/i), 'validPassword1')
    await user.type(screen.getByLabelText(/confirm_password/i), 'validPassword1')
    await user.click(screen.getByRole('button', { name: /submit_new_password/i }))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })

    resolveAction!({ success: true })
  })
})
