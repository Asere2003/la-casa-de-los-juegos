'use server'

import { sendNewsletterAdmin } from '@/lib/email/sendNewsletterAdmin'

interface NewsletterState {
  success: boolean
  error: string | null
}

export async function suscribirNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = (formData.get('email') as string)?.trim()

  if (!email) {
    return { success: false, error: 'Introduce tu email.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'El email no es válido.' }
  }

  try {
    await sendNewsletterAdmin(email)
    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Error al suscribirse. Inténtalo de nuevo.' }
  }
}