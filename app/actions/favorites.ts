'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(
  productId: string,
  add: boolean
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  if (add) {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, product_id: productId })
    // Ignorar duplicado (código 23505) — ya estaba marcado
    if (error && error.code !== '23505') {
      console.error('toggleFavorite add:', error)
      return { ok: false, error: error.message }
    }
  } else {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    if (error) { console.error('toggleFavorite remove:', error); return { ok: false, error: error.message } }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}
