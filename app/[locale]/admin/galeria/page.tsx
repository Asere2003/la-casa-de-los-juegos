// app/[locale]/admin/galeria/page.tsx
// Panel admin: gestión completa de la galería

import { AdminGaleriaClient } from './AdminGaleriaClient'
import type { GalleryPhotoAdmin } from '@/types/gallery'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminGaleriaPage() {
  // Auth: solo admin
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  // Cargar todas las fotos (admin ve también las invisibles)
  const { data: photos } = await adminSupabase
    .from('gallery_photos')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return <AdminGaleriaClient initialPhotos={(photos ?? []) as GalleryPhotoAdmin[]} />
}