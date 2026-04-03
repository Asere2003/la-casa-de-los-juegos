'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { useTranslations } from 'next-intl'

export default function BottomNav() {
  const [cuentaHref, setCuentaHref] = useState<'/cuenta' | '/login'>('/login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const links = [
    {
      href: '/' as const,
      key: 'home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: '/catalogo' as const,
      key: 'catalogue',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      href: '/carrito' as const,
      key: 'cart',
      isCart: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      href: '/historia' as const,
      key: 'history',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      href: cuentaHref,
      key: 'account',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  const pathname = usePathname()
  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const t = useTranslations('nav')

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href === '/login' || href === '/cuenta') {
      return pathname.startsWith('/cuenta') || pathname.startsWith('/login')
    }
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCuentaHref(session?.user ? '/cuenta' : '/login')
      setIsLoggedIn(!!session?.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCuentaHref(session?.user ? '/cuenta' : '/login')
        setIsLoggedIn(!!session?.user)
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname])

  return (
    <nav
      role="navigation"
      aria-label="Navegación móvil"
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 pb-2 pt-1.5 bg-[#FFFBF6] border-t border-[#e8e0d8] shadow-[0_-4px_16px_rgba(42,23,15,0.08)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
    >
      {links.map(link => {
        const active = isActive(link.href)
        const count = link.isCart ? totalItems : 0
        const label = t(link.key)
        return (
          <Link
            key={link.key}
            href={link.href}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={`
              relative flex flex-col items-center justify-center
              py-1.5 px-2.5 min-w-[52px] transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded-lg
              ${active ? 'text-[#C9A84C]' : 'text-[#2A170F]/35 hover:text-[#2A170F]/60'}
            `}
          >
            <span className="relative">
              {link.icon}
{count > 0 && (
  <span
    aria-hidden="true"
    className={`absolute -top-1.5 -right-1.5 w-4 h-4 
      ${active ? 'bg-[#C9A84C]' : 'bg-[#004D26]'}
      text-[#FFFBF6] text-[8px] font-bold rounded-full flex items-center justify-center font-mono leading-none`}
  >
    {count > 9 ? '9+' : count}
  </span>
)}
              {link.key === 'account' && isLoggedIn && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#004D26] border-2 border-[#FFFBF6] rounded-full" />
              )}
            </span>
            <span className={`font-mono text-[9px] uppercase tracking-wider mt-0.5 transition-colors ${active ? 'text-[#C9A84C]' : ''}`}>
              {label}
            </span>
            {/* Subrayado dorado en activo */}
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C9A84C] rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}