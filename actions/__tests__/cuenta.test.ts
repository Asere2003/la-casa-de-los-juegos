import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Supabase mock ────────────────────────────────────────────────────────────
const mockGetUser     = vi.hoisted(() => vi.fn())
const mockFrom        = vi.hoisted(() => vi.fn())
const mockUpdateUser  = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mockGetUser,
        updateUser: mockUpdateUser,
      },
      from: mockFrom,
    })
  ),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('resend', () => {
  class MockResend {
    emails = { send: vi.fn().mockResolvedValue({ data: { id: 'email_id' }, error: null }) }
  }
  return { Resend: MockResend }
})

import {
  actualizarPerfil,
  actualizarDireccion,
  cambiarEmail,
  cambiarPassword,
  solicitarDevolucion,
} from '../cuenta'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    fd.append(key, value)
  }
  return fd
}

function buildChain(resolveWith: unknown) {
  const chain: Record<string, unknown> = {}
  chain.update = vi.fn(() => chain)
  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.single = vi.fn().mockResolvedValue(resolveWith)
  return chain
}

const loggedUser = { id: 'user_123', email: 'user@example.com' }

describe('actualizarPerfil', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })
  })

  it('devuelve error si no hay sesión activa', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const result = await actualizarPerfil(makeFormData({ nombre: 'Juan', telefono: '600123456' }))
    expect(result).toEqual({ error: 'No hay sesión activa.' })
  })

  it('actualiza el perfil con los datos del formulario', async () => {
    const chain = buildChain({ error: null })
    mockFrom.mockReturnValue(chain)

    await actualizarPerfil(makeFormData({ nombre: 'Juan García', telefono: '600123456' }))

    expect(mockFrom).toHaveBeenCalledWith('profiles')
    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Juan García', telefono: '600123456' })
    )
    expect(chain.eq).toHaveBeenCalledWith('id', 'user_123')
  })

  it('devuelve error si falla la actualización', async () => {
    const chain = buildChain({ error: { message: 'DB error' } })
    chain.update = vi.fn(() => chain)
    chain.eq = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
    mockFrom.mockReturnValue(chain)

    const result = await actualizarPerfil(makeFormData({ nombre: 'Juan', telefono: '600' }))
    expect(result).toEqual({ error: 'Error al guardar los datos.' })
  })

  it('llama a revalidatePath en el happy path', async () => {
    const { revalidatePath } = await import('next/cache')
    const chain = buildChain({ error: null })
    chain.eq = vi.fn().mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    await actualizarPerfil(makeFormData({ nombre: 'Juan', telefono: '600' }))
    expect(revalidatePath).toHaveBeenCalledWith('/cuenta')
  })
})

describe('actualizarDireccion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })
  })

  it('devuelve error si no hay sesión', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const result = await actualizarDireccion(
      makeFormData({ direccion: 'Calle 1', ciudad: 'Granada', codigo_postal: '18001', pais: 'ES' })
    )
    expect(result).toEqual({ error: 'No hay sesión activa.' })
  })

  it('actualiza la dirección con todos los campos', async () => {
    const chain = buildChain({ error: null })
    chain.eq = vi.fn().mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    await actualizarDireccion(
      makeFormData({ direccion: 'Calle Mayor 5', ciudad: 'Sevilla', codigo_postal: '41001', pais: 'ES' })
    )

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({
        direccion: 'Calle Mayor 5',
        ciudad: 'Sevilla',
        codigo_postal: '41001',
        pais: 'ES',
      })
    )
  })

  it('devuelve error si falla la actualización', async () => {
    const chain = buildChain({ error: { message: 'DB error' } })
    chain.eq = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
    mockFrom.mockReturnValue(chain)

    const result = await actualizarDireccion(
      makeFormData({ direccion: 'Calle 1', ciudad: 'Granada', codigo_postal: '18001', pais: 'ES' })
    )
    expect(result).toEqual({ error: 'Error al guardar la dirección.' })
  })
})

describe('cambiarEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })
    mockUpdateUser.mockResolvedValue({ error: null })
  })

  it('devuelve error si no hay sesión', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const result = await cambiarEmail(makeFormData({ email: 'new@example.com' }))
    expect(result).toEqual({ error: 'No hay sesión activa.' })
  })

  it('devuelve error si el email es igual al actual', async () => {
    const result = await cambiarEmail(makeFormData({ email: 'user@example.com' }))
    expect(result).toEqual({ error: 'El nuevo email es igual al actual.' })
  })

  it('llama a auth.updateUser con el nuevo email', async () => {
    await cambiarEmail(makeFormData({ email: 'nuevo@example.com' }))
    expect(mockUpdateUser).toHaveBeenCalledWith({ email: 'nuevo@example.com' })
  })

  it('devuelve error si Supabase falla al cambiar el email', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Email already in use' } })
    const result = await cambiarEmail(makeFormData({ email: 'taken@example.com' }))
    expect(result).toEqual({ error: 'Error al cambiar el email.' })
  })

  it('llama a revalidatePath tras cambio exitoso', async () => {
    const { revalidatePath } = await import('next/cache')
    await cambiarEmail(makeFormData({ email: 'nuevo@example.com' }))
    expect(revalidatePath).toHaveBeenCalledWith('/cuenta')
  })
})

describe('cambiarPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })
    mockUpdateUser.mockResolvedValue({ error: null })
  })

  it('devuelve error si no hay sesión', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const result = await cambiarPassword(makeFormData({ password: 'newPass123' }))
    expect(result).toEqual({ error: 'No hay sesión activa.' })
  })

  it('llama a auth.updateUser con la nueva contraseña', async () => {
    await cambiarPassword(makeFormData({ password: 'newSecurePass1!' }))
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newSecurePass1!' })
  })

  it('devuelve error si Supabase falla al cambiar la contraseña', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Password too weak' } })
    const result = await cambiarPassword(makeFormData({ password: 'weak' }))
    expect(result).toEqual({ error: 'Error al cambiar la contraseña.' })
  })

  it('llama a revalidatePath tras cambio exitoso', async () => {
    const { revalidatePath } = await import('next/cache')
    await cambiarPassword(makeFormData({ password: 'newSecurePass1!' }))
    expect(revalidatePath).toHaveBeenCalledWith('/cuenta')
  })
})

describe('solicitarDevolucion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: loggedUser }, error: null })
    process.env.RESEND_API_KEY = 'resend_test'
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'info@test.com'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://lacasadelosjuegos.com'
  })

  it('devuelve error si el usuario no está autenticado', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const result = await solicitarDevolucion('order_123')
    expect(result).toEqual({ error: 'No autenticado' })
  })

  it('devuelve error si el pedido no existe o no pertenece al usuario', async () => {
    const chain = buildChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const result = await solicitarDevolucion('order_not_mine')
    expect(result).toEqual({ error: 'Pedido no encontrado' })
  })

  it('devuelve error si el pedido no está en estado delivered', async () => {
    const chain = buildChain({ data: { id: 'order_123', status: 'paid' }, error: null })
    mockFrom.mockReturnValue(chain)

    const result = await solicitarDevolucion('order_123')
    expect(result).toEqual({ error: 'Solo se pueden devolver pedidos entregados' })
  })

  it('actualiza el estado del pedido a return_requested cuando está delivered', async () => {
    // Primera llamada: buscar pedido → delivered
    const checkChain = buildChain({ data: { id: 'order_123', status: 'delivered' }, error: null })
    // Segunda llamada: update status
    const updateChain = buildChain({ error: null })
    updateChain.eq = vi.fn().mockResolvedValue({ error: null })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(updateChain)

    const result = await solicitarDevolucion('order_123')
    expect(result).toEqual({ success: true })
    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'return_requested' })
    )
  })

  it('devuelve error si falla la actualización del pedido', async () => {
    const checkChain = buildChain({ data: { id: 'order_123', status: 'delivered' }, error: null })
    const updateChain = buildChain({ error: null })
    updateChain.eq = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })

    mockFrom
      .mockReturnValueOnce(checkChain)
      .mockReturnValueOnce(updateChain)

    const result = await solicitarDevolucion('order_123')
    expect(result).toEqual({ error: 'DB error' })
  })
})
