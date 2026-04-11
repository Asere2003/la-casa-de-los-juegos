import { createClient } from '@/lib/supabase/server'
import PagoContent from './PagoContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pago — La Casa de los Juegos',
  description: 'Completa tu pedido de forma segura.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function PagoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nombre, direccion, ciudad, codigo_postal, pais')
      .eq('id', user.id)
      .single()
    profile = data ? { ...data, email: user.email ?? '' } : null
  }

  return (
    <PagoContent
      user={user ? { id: user.id, email: user.email ?? '' } : null}
      profile={profile}
    />
  )
}
