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

// ── SOLICITAR DEVOLUCIÓN ────────────────────────────────────
export async function solicitarDevolucion(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // Verificar que el pedido pertenece al usuario
  const { data: order } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) return { error: 'Pedido no encontrado' }
  if (order.status !== 'delivered') return { error: 'Solo se pueden devolver pedidos entregados' }

  const { error } = await supabase
    .from('orders')
    .update({ status: 'return_requested', updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) return { error: error.message }

  // Enviar email al admin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 
  (process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000')
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: `La Casa de los Juegos <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`,
    to: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
    subject: `🔄 Solicitud de devolución — Pedido #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <p>El cliente ha solicitado la devolución del pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong>.</p>
      <p>Accede al panel de admin para gestionar la devolución.</p>
      <a href="${siteUrl}/es/admin/pedidos/${orderId}">Ver pedido</a>
    `,
  })

  revalidatePath('/[locale]/cuenta', 'page')
  return { success: true }
}