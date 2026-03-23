import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

type Context = { params: Promise<{ locale: string }> }

export async function GET(request: NextRequest, context: Context) {
  const { locale } = await context.params
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  const next  = searchParams.get('next') ?? `/${locale}/cuenta`

  if (error) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=${error}`, request.url)
    )
  }

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url))
}