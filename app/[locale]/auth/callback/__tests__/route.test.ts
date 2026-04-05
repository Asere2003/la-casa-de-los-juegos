import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Supabase mock ────────────────────────────────────────────────────────────
const mockExchangeCode = vi.hoisted(() => vi.fn())
const mockSupabaseClient = {
  auth: {
    exchangeCodeForSession: mockExchangeCode,
  },
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}))

import { GET } from '../route'

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
})
