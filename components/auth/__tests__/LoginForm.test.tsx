import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginForm from '../LoginForm'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush    = vi.fn()
const mockRefresh = vi.fn()

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// ─────────────────────────────────────────────────────────────────────────────

describe('components/auth/LoginForm.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Renderizado ────────────────────────────────────────────────────────────

  it('renderiza los campos de email y contraseña', () => {
    render(<LoginForm action={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renderiza el botón de submit', () => {
    render(<LoginForm action={vi.fn()} />)

    expect(screen.getByRole('button', { name: /submit_login/i })).toBeInTheDocument()
  })

  it('renderiza el enlace a recuperar contraseña', () => {
    render(<LoginForm action={vi.fn()} />)

    expect(screen.getByRole('link', { name: /forgot_password/i })).toBeInTheDocument()
  })

  it('renderiza el enlace al registro', () => {
    render(<LoginForm action={vi.fn()} />)

    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()
  })

  // ── Happy path ─────────────────────────────────────────────────────────────

  it('redirige a /cuenta tras login exitoso', async () => {
    const mockAction = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm action={mockAction} />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'user@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/cuenta')
    })
  })

  it('redirige a redirectTo personalizado si se proporciona', async () => {
    const mockAction = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm action={mockAction} redirectTo="/admin" />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'pass123')
    await userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin')
    })
  })

  it('llama a la action con los datos del formulario', async () => {
    const mockAction = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm action={mockAction} />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'user@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'mypassword')
    await userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => expect(mockAction).toHaveBeenCalledTimes(1))

    const calledWith = mockAction.mock.calls[0][0] as FormData
    expect(calledWith.get('email')).toBe('user@test.com')
    expect(calledWith.get('password')).toBe('mypassword')
  })

  // ── Casos de error ─────────────────────────────────────────────────────────

  it('muestra mensaje de error cuando la action devuelve error de credenciales', async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: 'Invalid login credentials' })
    render(<LoginForm action={mockAction} />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'wrong@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => {
      expect(screen.getByText('error_invalid_credentials')).toBeInTheDocument()
    })
  })

  it('muestra error genérico para errores desconocidos', async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: 'Unknown server error' })
    render(<LoginForm action={mockAction} />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'user@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'pass')
    await userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => {
      expect(screen.getByText('error_generic')).toBeInTheDocument()
    })
  })

  it('no redirige si la action devuelve error', async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: 'Invalid login credentials' })
    render(<LoginForm action={mockAction} />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'user@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => expect(mockAction).toHaveBeenCalled())
    expect(mockPush).not.toHaveBeenCalled()
  })

  // ── Estado de carga ────────────────────────────────────────────────────────

  it('deshabilita el botón de submit durante la carga', async () => {
    let resolve: (v: unknown) => void
    const mockAction = vi.fn().mockReturnValue(new Promise(r => { resolve = r }))
    render(<LoginForm action={mockAction} />)

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'user@test.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'pass')

    userEvent.click(screen.getByRole('button', { name: /submit_login/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logging_in/i })).toBeDisabled()
    })

    resolve!(undefined)
  })
})
