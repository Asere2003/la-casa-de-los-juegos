// app/api/gallery/sign/route.ts
// Genera firma para subida directa desde el cliente a Cloudinary
// El archivo NUNCA pasa por Vercel — solo la firma

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // Verificar admin
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

  // Generar firma
  const timestamp = String(Math.round(Date.now() / 1000))
  const folder = 'galeria'
  const apiSecret = process.env.CLOUDINARY_API_SECRET!

  const paramsToSign = { folder, timestamp }
  const str = Object.keys(paramsToSign)
    .sort()
    .map(k => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`)
    .join('&') + apiSecret

  const signature = crypto.createHash('sha256').update(str).digest('hex')

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  })
}