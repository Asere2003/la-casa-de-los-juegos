import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterForm from '../RegisterForm'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// ─────────────────────────────────────────────────────────────────────────────

async function fillAndSubmit(opts: {
  nombre?: string
  email?: string
  password?: string
  confirmar?: string
}) {
  if (opts.nombre)    await userEvent.type(screen.getByLabelText(/^name$/i), opts.nombre)
  if (opts.email)     await userEvent.type(screen.getByRole('textbox', { name: /email_label/i }), opts.email)
  if (opts.password)  await userEvent.type(screen.getByLabelText(/^password$/i), opts.password)
  if (opts.confirmar) await userEvent.type(screen.getByLabelText(/confirm_password/i), opts.confirmar)
  await userEvent.click(screen.getByRole('button', { name: /submit_register/i }))
}

describe('components/auth/RegisterForm.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Renderizado ────────────────────────────────────────────────────────────

  it('renderiza los cuatro campos del formulario', () => {
    render(<RegisterForm action={vi.fn()} />)

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email_label/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm_password/i)).toBeInTheDocument()
  })

  it('renderiza el botón de submit', () => {
    render(<RegisterForm action={vi.fn()} />)

    expect(screen.getByRole('button', { name: /submit_register/i })).toBeInTheDocument()
  })

  it('renderiza el enlace al login', () => {
    render(<RegisterForm action={vi.fn()} />)

    expect(screen.getByRole('link', { name: /^login$/i })).toBeInTheDocument()
  })

  // ── Validación cliente-side ────────────────────────────────────────────────

  it('muestra error si las contraseñas no coinciden', async () => {
    render(<RegisterForm action={vi.fn()} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'password123',
      confirmar: 'password456',
    })

    expect(screen.getByText('error_passwords_mismatch')).toBeInTheDocument()
  })

  it('no llama a la action si las contraseñas no coinciden', async () => {
    const mockAction = vi.fn()
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'password123',
      confirmar: 'otraPass99',
    })

    expect(mockAction).not.toHaveBeenCalled()
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    render(<RegisterForm action={vi.fn()} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'corta',
      confirmar: 'corta',
    })

    expect(screen.getByText('error_password_too_short')).toBeInTheDocument()
  })

  it('no llama a la action si la contraseña es demasiado corta', async () => {
    const mockAction = vi.fn()
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'abc',
      confirmar: 'abc',
    })

    expect(mockAction).not.toHaveBeenCalled()
  })

  // ── Happy path ─────────────────────────────────────────────────────────────

  it('llama a la action si los datos son válidos', async () => {
    const mockAction = vi.fn().mockResolvedValue(undefined)
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana García',
      email: 'ana@test.com',
      password: 'securepass',
      confirmar: 'securepass',
    })

    await waitFor(() => expect(mockAction).toHaveBeenCalledTimes(1))
  })

  it('no muestra error si el formulario es válido', async () => {
    const mockAction = vi.fn().mockResolvedValue(undefined)
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'mypassword',
      confirmar: 'mypassword',
    })

    await waitFor(() => expect(mockAction).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  // ── Errores del servidor ───────────────────────────────────────────────────

  it('muestra error_user_already_registered cuando el servidor lo indica', async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: 'User already registered' })
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'existing@test.com',
      password: 'mypassword',
      confirmar: 'mypassword',
    })

    await waitFor(() => {
      expect(screen.getByText('error_user_already_registered')).toBeInTheDocument()
    })
  })

  it('muestra error_generic para errores de servidor desconocidos', async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: 'Some unknown server error' })
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'mypassword',
      confirmar: 'mypassword',
    })

    await waitFor(() => {
      expect(screen.getByText('error_generic')).toBeInTheDocument()
    })
  })

  // ── Estado de carga ────────────────────────────────────────────────────────

  it('deshabilita el botón de submit durante la carga', async () => {
    let resolve: (v: unknown) => void
    const mockAction = vi.fn().mockReturnValue(new Promise(r => { resolve = r }))
    render(<RegisterForm action={mockAction} />)

    await fillAndSubmit({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'mypassword',
      confirmar: 'mypassword',
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating_account/i })).toBeDisabled()
    })

    resolve!(undefined)
  })
})
