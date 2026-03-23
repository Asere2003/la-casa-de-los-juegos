'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── ACTUALIZAR DATOS PERSONALES ────────────────────
export async function actualizarPerfil(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No hay sesión activa.' }

  const nombre   = formData.get('nombre') as string
  const telefono = formData.get('telefono') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      nombre,
      telefono,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: 'Error al guardar los datos.' }

  revalidatePath('/cuenta')
}

// ── ACTUALIZAR DIRECCIÓN ───────────────────────────
export async function actualizarDireccion(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No hay sesión activa.' }

  const direccion      = formData.get('direccion') as string
  const ciudad         = formData.get('ciudad') as string
  const codigo_postal  = formData.get('codigo_postal') as string
  const pais           = formData.get('pais') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      direccion,
      ciudad,
      codigo_postal,
      pais,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: 'Error al guardar la dirección.' }

  revalidatePath('/cuenta')
}

// ── CAMBIAR EMAIL ──────────────────────────────────
export async function cambiarEmail(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No hay sesión activa.' }

  const email = formData.get('email') as string

  if (email === user.email) {
    return { error: 'El nuevo email es igual al actual.' }
  }

  const { error } = await supabase.auth.updateUser({ email })

  if (error) return { error: 'Error al cambiar el email.' }

  revalidatePath('/cuenta')
}

// ── CAMBIAR CONTRASEÑA ─────────────────────────────
export async function cambiarPassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No hay sesión activa.' }

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: 'Error al cambiar la contraseña.' }

  revalidatePath('/cuenta')
}