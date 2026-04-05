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
  const url = new URL('http://localhost/auth/callback')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url.toString())
}

describe('GET /auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExchangeCode.mockResolvedValue({ data: {}, error: null })
  })

  // ── 1. Parámetro error → redirige a login con error ─────────────────────
  it('redirige a /es/login con el parámetro error si viene en la URL', async () => {
    const res = await GET(makeRequest({ error: 'access_denied' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/es/login?error=access_denied')
  })

  // ── 2. Código presente → llama a exchangeCodeForSession ─────────────────
  it('llama a exchangeCodeForSession cuando hay code', async () => {
    await GET(makeRequest({ code: 'auth_code_123' }))
    expect(mockExchangeCode).toHaveBeenCalledOnce()
    expect(mockExchangeCode).toHaveBeenCalledWith('auth_code_123')
  })

  // ── 3. Sin next → redirige a /es/cuenta por defecto ─────────────────────
  it('redirige a /es/cuenta cuando no se especifica next', async () => {
    const res = await GET(makeRequest({ code: 'auth_code_123' }))
    expect(res.headers.get('location')).toContain('/es/cuenta')
  })

  // ── 4. Con next → redirige al destino especificado ──────────────────────
  it('redirige a la ruta next cuando se especifica', async () => {
    const res = await GET(makeRequest({ code: 'auth_code_123', next: '/es/cuenta/pedidos' }))
    expect(res.headers.get('location')).toContain('/es/cuenta/pedidos')
  })

  // ── 5. Sin code y sin error → redirige a /es/cuenta ─────────────────────
  it('redirige a /es/cuenta si no hay code ni error', async () => {
    const res = await GET(makeRequest({}))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/es/cuenta')
    expect(mockExchangeCode).not.toHaveBeenCalled()
  })

  // ── 6. No lanza aunque exchangeCodeForSession falle ─────────────────────
  it('sigue redirigiendo aunque exchangeCodeForSession falle', async () => {
    mockExchangeCode.mockResolvedValue({ data: null, error: { message: 'Invalid code' } })
    const res = await GET(makeRequest({ code: 'bad_code' }))
    expect(res.status).toBe(307)
    // Sigue redirigiendo a la ruta por defecto
    expect(res.headers.get('location')).toContain('/es/cuenta')
  })

  // ── 7. Error tiene prioridad sobre code ──────────────────────────────────
  it('si hay tanto error como code, error tiene prioridad', async () => {
    const res = await GET(makeRequest({ error: 'some_error', code: 'some_code' }))
    expect(res.headers.get('location')).toContain('/es/login?error=some_error')
    expect(mockExchangeCode).not.toHaveBeenCalled()
  })
})
