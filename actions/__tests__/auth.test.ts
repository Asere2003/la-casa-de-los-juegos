import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login, logout, registro } from '@/actions/auth'

// ── Helpers de mock para Supabase Admin ───────────────────────────────────────

function makeAdminOrdersChain() {
  const is     = vi.fn().mockResolvedValue({ data: null, error: null })
  const eq     = vi.fn().mockReturnValue({ is })
  const update = vi.fn().mockReturnValue({ eq })
  return { update, eq, is }
}

// ── Mocks de módulos ──────────────────────────────────────────────────────────

const mockSignInWithPassword = vi.fn()
const mockSignUp             = vi.fn()
const mockSignOut            = vi.fn()
const mockProfileFrom        = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp:             mockSignUp,
      signOut:            mockSignOut,
    },
    from: mockProfileFrom,
  })),
}))

const mockAdminFrom      = vi.fn()
const mockAdminListUsers = vi.fn()

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from:  mockAdminFrom,
    auth: { admin: { listUsers: mockAdminListUsers } },
  })),
}))

// redirect de next/navigation lanza para simular el comportamiento real de Next.js
const mockRedirect       = vi.fn((path: string) => { throw new Error(`NEXT_REDIRECT:${path}`) })
const mockRevalidatePath = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (path: string, type?: string) => mockRevalidatePath(path, type),
}))

// ── Helpers de test ───────────────────────────────────────────────────────────

function makeLoginFormData(email = 'user@test.com', password = 'password123') {
  const fd = new FormData()
  fd.append('email', email)
  fd.append('password', password)
  return fd
}

function makeRegistroFormData(
  opts: { nombre?: string; email?: string; password?: string; locale?: string } = {}
) {
  const fd = new FormData()
  fd.append('nombre',   opts.nombre   ?? 'Ana García')
  fd.append('email',    opts.email    ?? 'nueva@test.com')
  fd.append('password', opts.password ?? 'password123')
  if (opts.locale) fd.append('locale', opts.locale)
  return fd
}

// ─────────────────────────────────────────────────────────────────────────────

describe('actions/auth.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Perfil por defecto: no existe dirección
    mockProfileFrom.mockReturnValue({
      select:  vi.fn().mockReturnThis(),
      eq:      vi.fn().mockReturnThis(),
      single:  vi.fn().mockResolvedValue({ data: null }),
    })

    // Admin orders chain por defecto
    const chain = makeAdminOrdersChain()
    mockAdminFrom.mockReturnValue(chain)
    mockAdminListUsers.mockResolvedValue({ data: { users: [] } })
  })

  // ── login() ───────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('devuelve { error } con credenciales inválidas', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data:  { user: null },
        error: { message: 'Invalid login credentials' },
      })

      const result = await login(makeLoginFormData())

      expect(result).toEqual({ error: 'Invalid login credentials' })
    })

    it('devuelve { error } con email no confirmado', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data:  { user: null },
        error: { message: 'Email not confirmed' },
      })

      const result = await login(makeLoginFormData())

      expect(result).toEqual({ error: 'Email not confirmed' })
    })

    it('llama a revalidatePath tras login correcto', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data:  { user: { id: 'uid-1', email: 'user@test.com' } },
        error: null,
      })

      await login(makeLoginFormData())

      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('devuelve undefined (éxito implícito) cuando las credenciales son válidas', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data:  { user: { id: 'uid-1', email: 'user@test.com' } },
        error: null,
      })

      const result = await login(makeLoginFormData())

      expect(result).toBeUndefined()
    })

    it('asocia pedidos de invitado al usuario que acaba de entrar', async () => {
      const chain = makeAdminOrdersChain()
      mockAdminFrom.mockReturnValue(chain)

      mockSignInWithPassword.mockResolvedValue({
        data:  { user: { id: 'uid-123', email: 'user@test.com' } },
        error: null,
      })

      await login(makeLoginFormData('user@test.com'))

      expect(mockAdminFrom).toHaveBeenCalledWith('orders')
      expect(chain.update).toHaveBeenCalledWith({ user_id: 'uid-123' })
    })

    it('no intenta asociar pedidos si el login falla', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data:  { user: null },
        error: { message: 'Invalid login credentials' },
      })

      await login(makeLoginFormData())

      expect(mockAdminFrom).not.toHaveBeenCalled()
    })

    it('no lanza aunque la asociación de pedidos falle', async () => {
      mockAdminFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            is: vi.fn().mockRejectedValue(new Error('DB error')),
          }),
        }),
      })

      mockSignInWithPassword.mockResolvedValue({
        data:  { user: { id: 'uid-1', email: 'user@test.com' } },
        error: null,
      })

      await expect(login(makeLoginFormData())).resolves.not.toThrow()
    })
  })

  // ── registro() ────────────────────────────────────────────────────────────

  describe('registro()', () => {
    it('devuelve { error } si el email ya está registrado', async () => {
      mockSignUp.mockResolvedValue({
        error: { message: 'User already registered' },
      })

      const result = await registro(makeRegistroFormData())

      expect(result).toEqual({ error: 'User already registered' })
    })

    it('devuelve { error } si la contraseña es demasiado corta', async () => {
      mockSignUp.mockResolvedValue({
        error: { message: 'Password should be at least 6 characters' },
      })

      const result = await registro(makeRegistroFormData({ password: '123' }))

      expect(result).toEqual({ error: 'Password should be at least 6 characters' })
    })

    it('redirige a verificar-email con el locale correcto tras registro exitoso', async () => {
      mockSignUp.mockResolvedValue({ error: null })

      await expect(
        registro(makeRegistroFormData({ locale: 'es' }))
      ).rejects.toThrow('NEXT_REDIRECT:/es/cuenta/verificar-email')
    })

    it('usa "es" como locale por defecto si no se proporciona', async () => {
      mockSignUp.mockResolvedValue({ error: null })

      await expect(
        registro(makeRegistroFormData())
      ).rejects.toThrow('NEXT_REDIRECT:/es/cuenta/verificar-email')
    })

    it('redirige con locale "en" si se pasa ese locale', async () => {
      mockSignUp.mockResolvedValue({ error: null })

      await expect(
        registro(makeRegistroFormData({ locale: 'en' }))
      ).rejects.toThrow('NEXT_REDIRECT:/en/cuenta/verificar-email')
    })

    it('llama a revalidatePath antes de redirigir', async () => {
      mockSignUp.mockResolvedValue({ error: null })

      await expect(registro(makeRegistroFormData())).rejects.toThrow('NEXT_REDIRECT')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('asocia pedidos de invitado si encuentra al usuario recién registrado', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      mockAdminListUsers.mockResolvedValue({
        data: { users: [{ id: 'new-uid', email: 'nueva@test.com' }] },
      })
      const chain = makeAdminOrdersChain()
      mockAdminFrom.mockReturnValue(chain)

      await expect(
        registro(makeRegistroFormData({ email: 'nueva@test.com' }))
      ).rejects.toThrow('NEXT_REDIRECT')

      expect(chain.update).toHaveBeenCalledWith({ user_id: 'new-uid' })
    })

    it('no asocia pedidos si listUsers no encuentra el email', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      mockAdminListUsers.mockResolvedValue({ data: { users: [] } })
      const chain = makeAdminOrdersChain()
      mockAdminFrom.mockReturnValue(chain)

      await expect(registro(makeRegistroFormData())).rejects.toThrow('NEXT_REDIRECT')

      expect(chain.update).not.toHaveBeenCalled()
    })

    it('sigue redirigiendo aunque la asociación de pedidos falle', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      mockAdminListUsers.mockRejectedValue(new Error('Admin error'))

      await expect(
        registro(makeRegistroFormData())
      ).rejects.toThrow('NEXT_REDIRECT:/es/cuenta/verificar-email')
    })
  })

  // ── logout() ──────────────────────────────────────────────────────────────

  describe('logout()', () => {
    it('llama a signOut', async () => {
      mockSignOut.mockResolvedValue({})
      const fd = new FormData()
      fd.append('locale', 'es')

      await expect(logout(fd)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('redirige al inicio con el locale correcto', async () => {
      mockSignOut.mockResolvedValue({})
      const fd = new FormData()
      fd.append('locale', 'es')

      await expect(logout(fd)).rejects.toThrow('NEXT_REDIRECT:/es/')
    })

    it('redirige con locale "en" si se pasa ese locale', async () => {
      mockSignOut.mockResolvedValue({})
      const fd = new FormData()
      fd.append('locale', 'en')

      await expect(logout(fd)).rejects.toThrow('NEXT_REDIRECT:/en/')
    })

    it('llama a revalidatePath antes de redirigir', async () => {
      mockSignOut.mockResolvedValue({})
      const fd = new FormData()
      fd.append('locale', 'es')

      await expect(logout(fd)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
    })
  })
})
