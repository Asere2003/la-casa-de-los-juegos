'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Crear producto ──────────────────────────────────────────
export async function crearProducto(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const data = {
    name: formData.get('name') as string,
    name_en: formData.get('name_en') as string || null,
    name_cat: formData.get('name_cat') as string || null,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    description_en: formData.get('description_en') as string || null,
    description_cat: formData.get('description_cat') as string || null,
    price: Number.parseFloat(formData.get('price') as string),
    compare_price: formData.get('compare_price') ? Number.parseFloat(formData.get('compare_price') as string) : null,
    stock: Number.parseInt(formData.get('stock') as string),
    sku: formData.get('sku') as string || null,
    category_id: formData.get('category_id') as string || null,
    images: JSON.parse(formData.get('images') as string || '[]'),
    difficulty: formData.get('difficulty') as string || null,
    min_players: formData.get('min_players') ? Number.parseInt(formData.get('min_players') as string) : null,
    max_players: formData.get('max_players') ? Number.parseInt(formData.get('max_players') as string) : null,
    min_age: formData.get('min_age') ? Number.parseInt(formData.get('min_age') as string) : null,
    duration_min: formData.get('duration_min') ? Number.parseInt(formData.get('duration_min') as string) : null,
    material: formData.get('material') as string || null,
    origin: formData.get('origin') as string || null,
    badge: formData.get('badge') as string || null,
    featured: formData.get('featured') === 'true',
    active: formData.get('active') === 'true',
  }

  const { error } = await supabase.from('products').insert(data)
  if (error) return { error: error.message }

  revalidatePath('/[locale]/admin/productos', 'page')
  return { success: true }
}

// ── Editar producto ─────────────────────────────────────────
export async function editarProducto(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const data = {
    name: formData.get('name') as string,
    name_en: formData.get('name_en') as string || null,
    name_cat: formData.get('name_cat') as string || null,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    description_en: formData.get('description_en') as string || null,
    description_cat: formData.get('description_cat') as string || null,
    price: Number.parseFloat(formData.get('price') as string),
    compare_price: formData.get('compare_price') ? Number.parseFloat(formData.get('compare_price') as string) : null,
    stock: Number.parseInt(formData.get('stock') as string),
    sku: formData.get('sku') as string || null,
    category_id: formData.get('category_id') as string || null,
    images: JSON.parse(formData.get('images') as string || '[]'),
    difficulty: formData.get('difficulty') as string || null,
    min_players: formData.get('min_players') ? Number.parseInt(formData.get('min_players') as string) : null,
    max_players: formData.get('max_players') ? Number.parseInt(formData.get('max_players') as string) : null,
    min_age: formData.get('min_age') ? Number.parseInt(formData.get('min_age') as string) : null,
    duration_min: formData.get('duration_min') ? Number.parseInt(formData.get('duration_min') as string) : null,
    material: formData.get('material') as string || null,
    origin: formData.get('origin') as string || null,
    badge: formData.get('badge') as string || null,
    featured: formData.get('featured') === 'true',
    active: formData.get('active') === 'true',
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('products').update(data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/[locale]/admin/productos', 'page')
  return { success: true }
}

// ── Toggle activo/inactivo ──────────────────────────────────
export async function toggleActivo(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/productos', 'page')
  return { success: true }
}

// ── Toggle destacado ────────────────────────────────────────
export async function toggleDestacado(id: string, featured: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/productos', 'page')
  return { success: true }
}

// ── Borrar producto (solo si no tiene pedidos) ──────────────
export async function borrarProducto(id: string) {
  const supabase = await createClient()

  // Cuando implementes pedidos, aquí irá la comprobación
  // const { count } = await supabase.from('order_items').select('*', { count: 'exact' }).eq('product_id', id)
  // if (count && count > 0) return { error: 'El producto tiene pedidos asociados' }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/[locale]/admin/productos', 'page')
  return { success: true }
}

// ── Actualizar estado de pedido ─────────────────────────────
export async function actualizarEstadoPedido(id: string, status: string) {
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('shipping_email, id')
    .eq('id', id)
    .single()

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString()
  }

  if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }

  if (order?.shipping_email) {
    const { sendEstadoPedido } = await import('@/lib/email/estado-pedido')
    await sendEstadoPedido({
      to: order.shipping_email,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      status,
    })
  }

  revalidatePath('/[locale]/admin/pedidos', 'page')
  return { success: true }
}