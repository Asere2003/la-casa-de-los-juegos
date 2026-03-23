import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Extrae el locale de la URL (/es/cuenta → 'es')
  const segments = request.nextUrl.pathname.split('/')
  const locale = segments[1] || 'es' // es, en, cat

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión — NO borres esto
  const { data: { user } } = await supabase.auth.getUser()

  // Rutas protegidas
  const protectedRoutes = ['/cuenta', '/admin']
  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return supabaseResponse 
}