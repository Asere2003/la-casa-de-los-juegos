import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  const next  = searchParams.get('next') ?? `/${params.locale}/cuenta`

  // Si hay error de Supabase redirige al login con mensaje
  if (error) {
    return NextResponse.redirect(
      new URL(`/${params.locale}/login?error=${error}`, request.url)
    )
  }

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url))
}