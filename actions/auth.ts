'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ── LOGIN ──────────────────────────────────────────
export async function login(formData: FormData) {
  const supabase = await createClient()

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

}

// ── REGISTRO ───────────────────────────────────────
export async function registro(formData: FormData) {
  const supabase = await createClient()
  const locale = formData.get('locale') as string || 'es'

  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre_completo: nombre },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Asociar pedidos de invitado usando service role
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()

    const { data: users } = await admin.auth.admin.listUsers()
    const matchUser = users?.users.find(u => u.email === email)

    if (matchUser) {
      await admin
        .from('orders')
        .update({ user_id: matchUser.id })
        .eq('shipping_email', email)
        .is('user_id', null)
    }
  } catch (e) {
    console.error('Error asociando pedidos:', e)
  }

  revalidatePath('/', 'layout')
  redirect(`/${locale}/cuenta/verificar-email`)
}

// ── LOGOUT ─────────────────────────────────────────
export async function logout(formData: FormData) {
  const supabase = await createClient()
  const locale = formData.get('locale') as string || 'es'
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(`/${locale}/`)
}