'use server'

import { createClient } from '@/lib/supabase/server'

export async function solicitarRecuperacion(formData: FormData) {
  const email = formData.get('email') as string
  const locale = formData.get('locale') as string

  const supabase = await createClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 
    (process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
      : 'http://localhost:3000')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/${locale}/recuperar-password/nueva`,
  })

  if (error) console.error('resetPasswordForEmail:', error)
  return { success: true }
}

export async function actualizarPassword(formData: FormData) {
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  return { success: true }
}