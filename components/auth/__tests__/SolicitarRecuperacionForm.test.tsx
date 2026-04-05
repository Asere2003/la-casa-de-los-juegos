import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SolicitarRecuperacionForm from '../SolicitarRecuperacionForm'

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('SolicitarRecuperacionForm', () => {
  const mockAction = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockAction.mockResolvedValue({ success: true })
  })

  // ── Renderizado ──────────────────────────────────────────────────────────
  it('renderiza el campo de email', () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    expect(screen.getByRole('textbox', { name: /email_label/i })).toBeInTheDocument()
  })

  it('renderiza el botón de envío', () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    expect(screen.getByRole('button', { name: /submit_recover/i })).toBeInTheDocument()
  })

  it('renderiza el enlace de vuelta al login', () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    expect(screen.getByRole('link', { name: /back_to_login/i })).toBeInTheDocument()
  })

  // ── Submit ────────────────────────────────────────────────────────────────
  it('llama a la action con el email introducido', async () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledOnce()
    })

    const formData = mockAction.mock.calls[0][0] as FormData
    expect(formData.get('email')).toBe('test@example.com')
  })

  it('añade el locale al FormData antes de llamar a la action', async () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="en" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledOnce()
    })

    const formData = mockAction.mock.calls[0][0] as FormData
    expect(formData.get('locale')).toBe('en')
  })

  // ── Estado "sent" ─────────────────────────────────────────────────────────
  it('muestra mensaje de confirmación tras enviar', async () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    await waitFor(() => {
      expect(screen.getByText('recover_password_sent')).toBeInTheDocument()
    })
  })

  it('oculta el formulario tras enviar', async () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /submit_recover/i })).not.toBeInTheDocument()
    })
  })

  it('muestra mensaje de spam tras enviar', async () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    await waitFor(() => {
      expect(screen.getByText('recover_password_spam')).toBeInTheDocument()
    })
  })

  it('muestra enlace a login en el estado de confirmación', async () => {
    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back_to_login/i })).toBeInTheDocument()
    })
  })

  // ── Deshabilita botón durante envío ───────────────────────────────────────
  it('deshabilita el botón mientras isPending', async () => {
    // Hacemos que action no resuelva inmediatamente
    let resolveAction: (val: { success: boolean }) => void
    mockAction.mockReturnValue(new Promise(r => { resolveAction = r }))

    render(<SolicitarRecuperacionForm action={mockAction} locale="es" />)
    await user.type(screen.getByRole('textbox', { name: /email_label/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit_recover/i }))

    // El botón queda disabled mientras pending
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })

    resolveAction!({ success: true })
  })
})
