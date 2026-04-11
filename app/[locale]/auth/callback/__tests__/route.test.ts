import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET } from '../route'
import { NextRequest } from 'next/server'

// ─── Supabase mock ────────────────────────────────────────────────────────────
const mockExchangeCode = vi.hoisted(() => vi.fn())
const mockSignOut      = vi.hoisted(() => vi.fn())
const mockGetUser      = vi.hoisted(() => vi.fn())

const mockSupabaseClient = {
  auth: {
    exchangeCodeForSession: mockExchangeCode,
    signOut:                mockSignOut,
    getUser:                mockGetUser,
  },
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}))



function makeRequest(params: Record<string, string>) {
  const url = new URL('http://localhost/es/auth/callback')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url.toString())
}

describe('GET /[locale]/auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExchangeCode.mockResolvedValue({ data: {}, error: null })
    mockSignOut.mockResolvedValue({})
    // Por defecto sin sesión activa
    mockGetUser.mockResolvedValue({ data: { user: null } })
  })

  // ── 1. Error → redirige a login con error ─────────────────────────────────
  it('redirige a /es/login con el error si viene en la URL', async () => {
    const res = await GET(makeRequest({ error: 'access_denied' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/es/login?error=access_denied')
  })

  // ── 2. Code → llama a exchangeCodeForSession ──────────────────────────────
  it('llama a exchangeCodeForSession cuando hay code', async () => {
    await GET(makeRequest({ code: 'auth_code_456' }))
    expect(mockExchangeCode).toHaveBeenCalledOnce()
    expect(mockExchangeCode).toHaveBeenCalledWith('auth_code_456')
  })

  // ── 3. Sin next → /es/cuenta ──────────────────────────────────────────────
  it('redirige a /es/cuenta por defecto sin parámetro next', async () => {
    const res = await GET(makeRequest({ code: 'auth_code_456' }))
    expect(res.headers.get('location')).toContain('/es/cuenta')
  })

  // ── 4. Con next → destino especificado ────────────────────────────────────
  it('redirige a next cuando se especifica', async () => {
    const res = await GET(makeRequest({ code: 'abc', next: '/es/recuperar-password/nueva' }))
    expect(res.headers.get('location')).toContain('/es/recuperar-password/nueva')
  })

  // ── 5. Sin code ni error ───────────────────────────────────────────────────
  it('redirige a /es/cuenta si no hay code ni error', async () => {
    const res = await GET(makeRequest({}))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/es/cuenta')
    expect(mockExchangeCode).not.toHaveBeenCalled()
  })

  // ── 6. Error tiene prioridad ───────────────────────────────────────────────
  it('si hay error y code, error tiene prioridad', async () => {
    const res = await GET(makeRequest({ error: 'some_error', code: 'some_code' }))
    expect(res.headers.get('location')).toContain('/es/login?error=some_error')
    expect(mockExchangeCode).not.toHaveBeenCalled()
  })

  // ── 7. Sesión activa → cierra sesión antes de confirmar ───────────────────
  it('cierra la sesión activa antes de procesar el código si hay usuario logado', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123', email: 'otro@test.com' } } })

    await GET(makeRequest({ code: 'auth_code_456' }))

    expect(mockSignOut).toHaveBeenCalledOnce()
    expect(mockExchangeCode).toHaveBeenCalledOnce()
    // signOut debe llamarse ANTES que exchangeCode
    const signOutOrder   = mockSignOut.mock.invocationCallOrder[0]
    const exchangeOrder  = mockExchangeCode.mock.invocationCallOrder[0]
    expect(signOutOrder).toBeLessThan(exchangeOrder)
  })

  // ── 8. Sin sesión activa → no cierra sesión ───────────────────────────────
  it('no llama a signOut si no hay usuario logado', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    await GET(makeRequest({ code: 'auth_code_456' }))

    expect(mockSignOut).not.toHaveBeenCalled()
    expect(mockExchangeCode).toHaveBeenCalledOnce()
  })

  // ── 9. Error en exchangeCode → redirige a login ───────────────────────────
  it('redirige a /es/login con confirmation_failed si exchangeCode falla', async () => {
    mockExchangeCode.mockResolvedValue({ error: { message: 'invalid token' } })

    const res = await GET(makeRequest({ code: 'bad_code' }))

    expect(res.headers.get('location')).toContain('/es/login?error=confirmation_failed')
  })

  // ── 10. Error en exchangeCode con sesión activa → cierra sesión igualmente ─
  it('cierra la sesión activa aunque exchangeCode falle', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    mockExchangeCode.mockResolvedValue({ error: { message: 'invalid token' } })

    await GET(makeRequest({ code: 'bad_code' }))

    expect(mockSignOut).toHaveBeenCalledOnce()
  })
})