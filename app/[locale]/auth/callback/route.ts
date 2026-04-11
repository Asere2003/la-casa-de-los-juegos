import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/es/login?error=${error}`)
  }

  if (code) {
    const supabase = await createClient()

    // Si hay una sesión activa, cerrarla antes de procesar el nuevo token
    // Evita que un usuario logado confirme la cuenta de otro usuario
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      await supabase.auth.signOut()
    }

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/es/login?error=confirmation_failed`)
    }
  }

  return NextResponse.redirect(`${origin}${next ?? '/es/cuenta'}`)
}