// app/api/gallery/upload/route.ts
// POST — recibe metadatos + URL ya subida a Cloudinary, guarda en Supabase
// La imagen se sube directamente desde el cliente a Cloudinary (ver /api/gallery/sign)

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // 1. Verificar admin
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  // 2. Recibir metadatos y URL de Cloudinary (ya subida)
  const body = await request.json()
  const { url, width, height, caption, alt_text, category, tags, featured, visible } = body

  if (!url) return NextResponse.json({ error: 'Falta la URL de la imagen' }, { status: 400 })

  const thumbnail_url = url.replace('/upload/', '/upload/w_400,c_fill,q_auto,f_auto/')

  // 3. Guardar en Supabase
  const { data: photo, error: insertError } = await adminSupabase
    .from('gallery_photos')
    .insert({
      url,
      thumbnail_url,
      width: width ?? null,
      height: height ?? null,
      caption: caption || null,
      alt_text: alt_text || null,
      category: category || 'general',
      tags: tags || [],
      featured: featured ?? false,
      visible: visible ?? true,
      uploaded_by: user.id,
      source_role: 'admin',
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ photo })
}