'use client'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/supabase/queries'
import { useCartStore } from '@/store/cartStore'

const localeLabels: Record<string, string> = { es: 'ES', en: 'EN', cat: 'CAT' }

// ── Iconos ────────────────────────────────────────────────────
function IconCart({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconHeart({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
// ─────────────────────────────────────────────────────────────

const navLinks = [
  { href: '/' as const,         key: 'home'      },
  { href: '/catalogo' as const, key: 'catalogue' },
  { href: '/historia' as const, key: 'history'   },
]

const drawerLinkBase = `
  relative flex items-center px-6 py-3.5
  font-headline italic text-base transition-colors
  focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold)]
`
const drawerLinkActive   = 'text-[var(--color-primary)]'
const drawerLinkInactive = 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-primary)]'

export default function Header() {
  const [isAdmin,     setIsAdmin]     = useState(false)
  const [user,        setUser]        = useState<User | null>(null)
  const [categories,  setCategories]  = useState<Awaited<ReturnType<typeof getCategories>>>([])
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen,    setLangOpen]    = useState(false)

  const pathname = usePathname()
  const router   = useRouter()
  const locale   = useLocale()
  const t        = useTranslations('nav')
  const tCat     = useTranslations('categories')
  const tA11y    = useTranslations('accessibility')

  const items      = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const toggleCart = useCartStore(s => s.toggleCart)

  const searchRef = useRef<HTMLInputElement>(null)
  const langRef   = useRef<HTMLDivElement>(null)

  // ── Activos ───────────────────────────────────────────────
  const isUserActive =
    pathname.startsWith('/cuenta')    ||
    pathname.startsWith('/login')     ||
    pathname.startsWith('/registro')  ||
    pathname.startsWith('/recuperar') ||
    pathname.startsWith('/auth')

  const isCartActive = pathname.startsWith('/carrito')

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => { getCategories().then(setCategories) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        setSearchOpen(false)
        setLangOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!langOpen) return
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [langOpen])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'))
      } else {
        setIsAdmin(false)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'))
      } else {
        setIsAdmin(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [pathname])

  // ── Handlers ──────────────────────────────────────────────
  async function handleLogout() {
    const supabase = createClient()
    setUser(null)
    setDrawerOpen(false)
    router.push('/')
    await supabase.auth.signOut()
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchOpen(false)
      setSearchQuery('')
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header
        role="banner"
        className={`
          fixed top-0 left-0 w-full z-50
          flex items-center justify-between
          px-6 md:px-10 h-16
          bg-[var(--color-surface)] border-b border-[var(--color-outline-var)]
          transition-shadow duration-300
          ${scrolled ? 'shadow-[var(--shadow-warm)]' : ''}
        `}
      >
        {/* Izquierda: hamburguesa + logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={tA11y('open_menu')}
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            className="md:hidden text-[var(--color-primary)] hover:opacity-70 transition-opacity p-1 -ml-1 rounded focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            <IconMenu />
          </button>

          <Link
            href="/"
            aria-label="La Casa de los Juegos — Inicio"
            className="font-headline text-[var(--color-primary)] text-lg md:text-xl tracking-tight hover:opacity-75 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded"
          >
            La Casa de los Juegos
          </Link>
        </div>

        {/* Centro: nav desktop */}
        <nav
          role="navigation"
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
        >
          {navLinks.map(link => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative font-body text-sm pb-0.5 transition-colors
                  focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded
                  ${isActive
                    ? 'text-[var(--color-gold)] font-semibold'
                    : 'text-[var(--color-on-surface)]/55 hover:text-[var(--color-gold)]'
                  }
                `}
              >
                {t(link.key)}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[var(--color-gold)]" />
                )}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={`
                relative font-body text-sm pb-0.5 transition-colors
                focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded
                ${pathname.startsWith('/admin')
                  ? 'text-[var(--color-primary)] font-semibold'
                  : 'text-[var(--color-on-surface)]/55 hover:text-[var(--color-primary)]'
                }
              `}
            >
              Admin
              {pathname.startsWith('/admin') && (
                <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[var(--color-gold)]" />
              )}
            </Link>
          )}
        </nav>

        {/* Derecha: iconos */}
        <div className="flex items-center gap-1">

          {/* Buscador — solo desktop */}
          <button
            onClick={() => setSearchOpen(v => !v)}
            aria-label={tA11y('search')}
            aria-expanded={searchOpen}
            className="hidden md:flex text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            <IconSearch />
          </button>

          {/* Favoritos — solo desktop */}
          <Link
            href="/cuenta?tab=favoritos"
            aria-label="Mis favoritos"
            className="hidden md:flex text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            <IconHeart />
          </Link>

          {/* Usuario — desktop */}
          {user ? (
            <Link
              href="/cuenta"
              aria-label="Mi cuenta"
              className={`
                relative hidden md:flex p-2 rounded transition-colors
                focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]
                ${isUserActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)]'
                }
              `}
            >
              <IconUser />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary)] border-2 border-[var(--color-surface)] rounded-full" />
            </Link>
          ) : (
            <Link
              href="/login"
              aria-label="Iniciar sesión"
              className={`
                hidden md:flex p-2 rounded transition-colors
                focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]
                ${isUserActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)]'
                }
              `}
            >
              <IconUser />
            </Link>
          )}

          {/* Usuario — móvil */}
          {user ? (
            <Link
              href="/cuenta"
              aria-label="Mi cuenta"
              className={`
                relative md:hidden p-2 rounded transition-colors
                focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]
                ${isUserActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface)]/50'
                }
              `}
            >
              <IconUser />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary)] border-2 border-[var(--color-surface)] rounded-full" />
            </Link>
          ) : (
            <Link
              href="/login"
              aria-label="Iniciar sesión"
              className={`
                md:hidden p-2 rounded transition-colors
                focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]
                ${isUserActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface)]/50'
                }
              `}
            >
              <IconUser />
            </Link>
          )}

          {/* Selector de idioma — solo desktop */}
          <div ref={langRef} className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(v => !v)}
              aria-label={tA11y('change_language')}
              aria-expanded={langOpen}
              className="font-mono text-[11px] text-[var(--color-on-surface)]/40 hover:text-[var(--color-primary)] transition-colors px-2 py-2 rounded focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] tracking-wider"
            >
              {localeLabels[locale] || locale.toUpperCase()}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[var(--color-surface)] border border-[var(--color-outline-var)] shadow-[var(--shadow-warm)] rounded-sm overflow-hidden z-50 min-w-[60px]">
                {(['es', 'en', 'cat'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => { router.replace(pathname, { locale: l }); setLangOpen(false) }}
                    className={`
                      block w-full text-left px-4 py-2 font-mono text-[11px] tracking-wider transition-colors
                      ${locale === l
                        ? 'bg-[var(--color-primary)] text-[var(--color-surface)] font-bold'
                        : 'text-[var(--color-on-surface)]/60 hover:bg-[var(--color-surface-low)] hover:text-[var(--color-primary)]'
                      }
                    `}
                  >
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Carrito */}
          <button
            onClick={toggleCart}
            aria-label={tA11y('cart_count', { count: totalItems })}
            className={`
              relative p-2 rounded transition-colors
              focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]
              ${isCartActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)]'
              }
            `}
          >
            <IconCart />
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[var(--color-primary)] text-[var(--color-surface)] text-[9px] font-bold font-mono rounded-full flex items-center justify-center leading-none"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ══ BÚSQUEDA ════════════════════════════════════════ */}
      <div
        role="search"
        aria-label={tA11y('search')}
        className={`
          fixed top-16 left-0 w-full z-40
          bg-[var(--color-surface)] border-b border-[var(--color-outline-var)]
          px-6 md:px-10 py-3
          shadow-[var(--shadow-warm)]
          transition-all duration-200
          ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        `}
      >
        <div className="max-w-2xl mx-auto relative">
          <label htmlFor="search-input" className="sr-only">{tA11y('search')}</label>
          <input
            ref={searchRef}
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder={t('search') + '...'}
            className="input-base pr-10"
            style={{ borderRadius: '2px' }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface)]/30 pointer-events-none">
            <IconSearch />
          </span>
        </div>
      </div>

      {/* ══ OVERLAY ═════════════════════════════════════════ */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-[59] bg-[var(--color-wood-dark)]/40 backdrop-blur-sm"
        />
      )}

      {/* ══ DRAWER ══════════════════════════════════════════ */}
      <nav
        id="nav-drawer"
        role="navigation"
        aria-label="Menú principal"
        aria-hidden={!drawerOpen}
        className={`
          fixed inset-y-0 left-0 z-[60] flex flex-col h-full w-72
          bg-[var(--color-surface)] shadow-[var(--shadow-warm-lg)]
          transition-transform duration-300
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Cabecera drawer */}
        <div className="px-6 py-4 border-b border-[var(--color-outline-var)] flex items-center justify-between">
          <span className="font-headline text-[var(--color-primary)] text-lg">
            La Casa de los Juegos
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label={tA11y('close_menu')}
            className="text-[var(--color-on-surface)]/40 hover:text-[var(--color-primary)] p-1 rounded focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] transition-colors"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Links principales */}
          <div className="divide-y divide-[var(--color-outline-var)]">

            {navLinks.map(link => {
              const active = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`${drawerLinkBase} ${active ? drawerLinkActive : drawerLinkInactive}`}
                >
                  {t(link.key)}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-gold)] rounded-r-full" />
                  )}
                </Link>
              )
            })}

            {/* Mi cuenta */}
            {user && (
              <Link
                href="/cuenta"
                onClick={() => setDrawerOpen(false)}
                className={`${drawerLinkBase} ${pathname.startsWith('/cuenta') ? drawerLinkActive : drawerLinkInactive}`}
              >
                Mi cuenta
                {pathname.startsWith('/cuenta') && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-gold)] rounded-r-full" />
                )}
              </Link>
            )}

            {/* Admin */}
            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setDrawerOpen(false)}
                className={`${drawerLinkBase} ${pathname.startsWith('/admin') ? drawerLinkActive : drawerLinkInactive}`}
              >
                Panel de administración
                {pathname.startsWith('/admin') && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-gold)] rounded-r-full" />
                )}
              </Link>
            )}

            {/* Cerrar sesión */}
            {user && (
              <button
                onClick={handleLogout}
                className={`${drawerLinkBase} w-full ${drawerLinkInactive}`}
              >
                Cerrar sesión
              </button>
            )}
          </div>

          {/* Categorías */}
          <div className="px-6 py-4 border-t border-[var(--color-outline-var)]">
            <p className="section-label mb-3">Categorías</p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/catalogo?category=${cat.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="py-1.5 px-1 text-sm font-body text-[var(--color-on-surface)]/60 hover:text-[var(--color-primary)] transition-colors rounded focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                >
                  {cat.emoji} {tCat(cat.key as any)}
                </Link>
              ))}
            </div>
          </div>

          {/* Idioma */}
          <div className="px-6 py-4 border-t border-[var(--color-outline-var)]">
            <p className="section-label mb-3">Idioma</p>
            <div className="flex gap-2">
              {(['es', 'en', 'cat'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => { router.replace(pathname, { locale: l }); setDrawerOpen(false) }}
                  className={`
                    px-3 py-1.5 font-mono text-[11px] tracking-wider transition-colors rounded-sm
                    ${locale === l
                      ? 'bg-[var(--color-primary)] text-[var(--color-surface)] font-bold'
                      : 'border border-[var(--color-outline-var)] text-[var(--color-on-surface)]/50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }
                  `}
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer drawer */}
        <div className="p-5 border-t border-[var(--color-outline-var)]">
          <p className="font-body italic text-sm text-[var(--color-on-surface)]/50 leading-relaxed">
            "Un juego no termina cuando se cierra la caja, solo se guarda para la próxima sesión."
          </p>
          <p className="font-mono text-[9px] text-[var(--color-on-surface)]/30 mt-2 uppercase tracking-wider">
            — La Casa de los Juegos
          </p>
        </div>
      </nav>
    </>
  )
}