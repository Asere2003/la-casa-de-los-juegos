'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearResena(data: {
  product_id: string
  rating: number
  titulo: string
  contenido: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // Verificar que ha comprado el producto
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('id, order:orders!inner(user_id, status)')
    .eq('product_id', data.product_id)
    .eq('order.user_id', user.id)
    .in('order.status', ['enviado', 'entregado'])

  const verified = (orderItems ?? []).length > 0

  const { error } = await supabase.from('reviews').insert({
    user_id: user.id,
    product_id: data.product_id,
    rating: data.rating,
    titulo: data.titulo,
    contenido: data.contenido,
    verified_purchase: verified,
  })

  if (error) return { error: error.message }
  revalidatePath('/cuenta')
  revalidatePath(`/producto`)
  return { ok: true }
}

export async function eliminarResena(reviewId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/cuenta')
  return { ok: true }
}

export async function editarResena(reviewId: string, data: {
  rating: number
  titulo: string
  contenido: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('reviews')
    .update({
      rating: data.rating,
      titulo: data.titulo,
      contenido: data.contenido,
    })
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/cuenta')
  return { ok: true }
}