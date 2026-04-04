'use server'

import { sendContacto } from '@/lib/email/sendContacto'

interface ContactoState {
  success: boolean
  error: string | null
}

export async function enviarContacto(
  _prevState: ContactoState,
  formData: FormData
): Promise<ContactoState> {
  const nombre  = (formData.get('nombre')  as string)?.trim()
  const email   = (formData.get('email')   as string)?.trim()
  const mensaje = (formData.get('mensaje') as string)?.trim()

  if (!nombre || !email || !mensaje) {
    return { success: false, error: 'Todos los campos son obligatorios.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'El email no es válido.' }
  }

  if (mensaje.length < 10) {
    return { success: false, error: 'El mensaje es demasiado corto.' }
  }

  try {
    await sendContacto({ nombre, email, mensaje, asunto: 'Mensaje desde el formulario de contacto' })
    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Error al enviar el mensaje. Inténtalo de nuevo.' }
  }
}