import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request)
  return await updateSession(request, intlResponse)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}