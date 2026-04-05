import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Supabase mock ────────────────────────────────────────────────────────────
const mockResetPassword = vi.hoisted(() => vi.fn())
const mockUpdateUser = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        resetPasswordForEmail: mockResetPassword,
        updateUser: mockUpdateUser,
      },
    })
  ),
}))

import { solicitarRecuperacion, actualizarPassword } from '../recuperar-password'

function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    fd.append(key, value)
  }
  return fd
}

describe('solicitarRecuperacion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SITE_URL = 'https://lacasadelosjuegos.com'
    mockResetPassword.mockResolvedValue({ error: null })
  })

  it('llama a resetPasswordForEmail con el email correcto', async () => {
    await solicitarRecuperacion(makeFormData({ email: 'user@example.com', locale: 'es' }))
    expect(mockResetPassword).toHaveBeenCalledOnce()
    expect(mockResetPassword).toHaveBeenCalledWith(
      'user@example.com',
      expect.objectContaining({ redirectTo: expect.any(String) })
    )
  })

  it('construye redirectTo con NEXT_PUBLIC_SITE_URL', async () => {
    await solicitarRecuperacion(makeFormData({ email: 'user@example.com', locale: 'es' }))
    const call = mockResetPassword.mock.calls[0]
    expect(call[1].redirectTo).toContain('https://lacasadelosjuegos.com')
  })

  it('incluye el locale en la redirectTo URL', async () => {
    await solicitarRecuperacion(makeFormData({ email: 'user@example.com', locale: 'en' }))
    const call = mockResetPassword.mock.calls[0]
    expect(call[1].redirectTo).toContain('/en/recuperar-password/nueva')
  })

  it('devuelve { success: true } aunque haya error de Supabase', async () => {
    mockResetPassword.mockResolvedValue({ error: { message: 'User not found' } })
    const result = await solicitarRecuperacion(
      makeFormData({ email: 'noexiste@example.com', locale: 'es' })
    )
    expect(result).toEqual({ success: true })
  })

  it('devuelve { success: true } en el happy path', async () => {
    const result = await solicitarRecuperacion(
      makeFormData({ email: 'user@example.com', locale: 'es' })
    )
    expect(result).toEqual({ success: true })
  })

  it('usa NEXT_PUBLIC_VERCEL_URL si NEXT_PUBLIC_SITE_URL no está definido', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_VERCEL_URL = 'my-app.vercel.app'
    await solicitarRecuperacion(makeFormData({ email: 'user@example.com', locale: 'es' }))
    const call = mockResetPassword.mock.calls[0]
    expect(call[1].redirectTo).toContain('https://my-app.vercel.app')
    delete process.env.NEXT_PUBLIC_VERCEL_URL
  })

  it('usa localhost:3000 como fallback si no hay ninguna URL configurada', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXT_PUBLIC_VERCEL_URL
    await solicitarRecuperacion(makeFormData({ email: 'user@example.com', locale: 'es' }))
    const call = mockResetPassword.mock.calls[0]
    expect(call[1].redirectTo).toContain('http://localhost:3000')
  })

  it('incluye /auth/callback en la redirectTo URL', async () => {
    await solicitarRecuperacion(makeFormData({ email: 'user@example.com', locale: 'es' }))
    const call = mockResetPassword.mock.calls[0]
    expect(call[1].redirectTo).toContain('/auth/callback')
  })
})

describe('actualizarPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateUser.mockResolvedValue({ error: null })
  })

  it('llama a supabase.auth.updateUser con la nueva contraseña', async () => {
    await actualizarPassword(makeFormData({ password: 'newPass123!' }))
    expect(mockUpdateUser).toHaveBeenCalledOnce()
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newPass123!' })
  })

  it('devuelve { success: true } cuando la actualización tiene éxito', async () => {
    const result = await actualizarPassword(makeFormData({ password: 'newPass123!' }))
    expect(result).toEqual({ success: true })
  })

  it('devuelve { error } cuando Supabase devuelve un error', async () => {
    mockUpdateUser.mockResolvedValue({
      error: { message: 'New password should be different from the old password.' },
    })
    const result = await actualizarPassword(makeFormData({ password: 'sameOldPass' }))
    expect(result).toEqual({ error: 'New password should be different from the old password.' })
  })

  it('devuelve { error } cuando la sesión ha expirado', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Auth session missing!' } })
    const result = await actualizarPassword(makeFormData({ password: 'anyPass' }))
    expect(result).toEqual({ error: 'Auth session missing!' })
  })

  it('devuelve { error } para contraseña demasiado corta según Supabase', async () => {
    mockUpdateUser.mockResolvedValue({
      error: { message: 'Password should be at least 6 characters.' },
    })
    const result = await actualizarPassword(makeFormData({ password: 'abc' }))
    expect(result).toEqual({ error: 'Password should be at least 6 characters.' })
  })
})
