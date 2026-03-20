'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/historia', label: 'Historia' },
]

const categories = [
  { emoji: '♟', label: 'Ajedrez',        slug: 'ajedrez' },
  { emoji: '🧩', label: 'Puzzles',        slug: 'puzzles' },
  { emoji: '🎲', label: 'Juegos de Mesa', slug: 'juegos-mesa' },
  { emoji: '🐉', label: 'Rol',            slug: 'rol' },
  { emoji: '🎭', label: 'Clásicos',       slug: 'clasicos' },
  { emoji: '🌍', label: 'Del Mundo',      slug: 'del-mundo' },
  { emoji: '🃏', label: 'Cartas',         slug: 'cartas' },
  { emoji: '🪀', label: 'Habilidad',      slug: 'habilidad' },
]

export default function Header() {
  const pathname = usePathname()

  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  const toggleCart = useCartStore(s => s.toggleCart)
  const searchRef  = useRef<HTMLInputElement>(null)

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
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      {/* ══ HEADER ══ */}
      <header
        role="banner"
        className={`
          fixed top-0 left-0 w-full z-50
          flex justify-between items-center px-5 h-16
          bg-gradient-to-b from-[#1a5c2a] to-[#004317]
          transition-shadow duration-300
          ${scrolled ? 'shadow-lg shadow-[#2a170f]/40' : 'shadow-md shadow-[#2a170f]/20'}
        `}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            className="text-[#c9a84c] hover:rotate-[-2deg] transition-transform p-2 -ml-2 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Link
            href="/"
            aria-label="La Casa de los Juegos — Inicio"
            className="font-headline italic text-xl md:text-2xl text-[#c9a84c] tracking-tight hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
          >
            La Casa de los Juegos
          </Link>
        </div>

        <nav role="navigation" aria-label="Navegación principal" className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                font-headline text-xs tracking-widest uppercase pb-0.5 border-b transition-colors
                focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded
                ${pathname.includes(link.href)
                  ? 'text-[#c9a84c] border-[#c9a84c]'
                  : 'text-[#fff8f6]/80 hover:text-[#c9a84c] border-transparent hover:border-[#c9a84c]'
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(v => !v)}
            aria-label="Buscar productos"
            aria-expanded={searchOpen}
            className="text-[#fff8f6]/80 hover:text-[#c9a84c] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <button
            onClick={toggleCart}
            aria-label={`Abrir carrito, ${totalItems} artículos`}
            className="relative text-[#fff8f6]/80 hover:text-[#c9a84c] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a84c] text-[#2c1810] text-[8px] font-bold rounded-full flex items-center justify-center font-mono leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ══ BÚSQUEDA ══ */}
      <div
        role="search"
        aria-label="Búsqueda de productos"
        className={`
          fixed top-16 left-0 w-full z-40 bg-[#004317]
          px-5 py-3 shadow-lg transition-all duration-300
          ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        `}
      >
        <div className="max-w-2xl mx-auto relative">
          <label htmlFor="search-input" className="sr-only">Buscar productos</label>
          <input
            ref={searchRef}
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar juegos, puzzles, ajedrez..."
            className="w-full bg-[#1a5c2a] border border-[#c9a84c]/30 text-[#fff8f6] placeholder:text-[#fff8f6]/40 font-body italic px-4 py-2.5 pr-10 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] text-sm rounded-sm"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      </div>

      {/* ══ OVERLAY ══ */}
      {drawerOpen && (
        <div aria-hidden="true" onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-[59] bg-[#2a170f]/60 backdrop-blur-sm" />
      )}

      {/* ══ DRAWER ══ */}
      <nav
        id="nav-drawer"
        role="navigation"
        aria-label="Menú principal"
        aria-hidden={!drawerOpen}
        className={`
          fixed inset-y-0 left-0 z-[60] flex flex-col h-full w-72
          bg-[#fff8f6] shadow-2xl shadow-[#2a170f]/50
          transition-transform duration-300
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-5 bg-gradient-to-b from-[#1a5c2a] to-[#004317] flex items-center justify-between">
          <span className="font-headline italic text-xl text-[#c9a84c]">La Casa de los Juegos</span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Cerrar menú" className="text-[#c9a84c]/70 hover:text-[#c9a84c] p-1 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-[#2a170f]/5">
            {[
              { href: '/',         label: 'Inicio' },
              { href: '/catalogo', label: 'Catálogo' },
              { href: '/historia', label: 'Historia' },
              { href: '/carrito',  label: 'Carrito' },
            ].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}
                className="flex items-center px-6 py-3.5 text-[#004317] hover:bg-[#fff1ec] font-headline italic text-lg transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9a84c]">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-[#c9a84c]/15">
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#717a6f] mb-3">Categorías</p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map(cat => (
                <Link key={cat.slug} href={`/catalogo?category=${cat.slug}`} onClick={() => setDrawerOpen(false)}
                  className="py-1.5 px-1 text-sm font-body text-[#2a170f]/75 hover:text-[#004317] transition-colors rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                  {cat.emoji} {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-[#c9a84c]/20 bg-[#fff1ec]">
          <p className="font-body italic text-sm text-[#40493f] leading-relaxed">
            "Un juego no termina cuando se cierra la caja, solo se guarda para la próxima sesión."
          </p>
          <p className="font-mono text-[9px] text-[#717a6f] mt-2 uppercase tracking-wider">— La Casa de los Juegos</p>
        </div>
      </nav>
    </>
  )
}
