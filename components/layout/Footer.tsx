'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // TODO: conectar con API
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer role="contentinfo" className="w-full pt-16 pb-8 px-6 md:px-10 bg-[#2c1810] relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-headline italic text-3xl text-[#c9a84c] mb-4 block hover:opacity-80 transition-opacity">
              La Casa de los Juegos
            </Link>
            <p className="font-body text-sm leading-relaxed text-[#c9a84c]/55 max-w-xs mb-6">
              Curadores de asombro y guardianes del juego. La tienda más especial de Granada, ahora en tu hogar.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="text-[#c9a84c]/35 hover:text-[#c9a84c] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="mailto:hola@lacasadelosjuegos.es" aria-label="Email" className="text-[#c9a84c]/35 hover:text-[#c9a84c] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] mb-5">Tienda</h2>
            <ul className="space-y-2.5">
              {[
                { href: '/catalogo',              label: 'Catálogo' },
                { href: '/catalogo?sort=newest',  label: 'Novedades' },
                { href: '/catalogo?sort=popular', label: 'Más Vendidos' },
                { href: '/historia',              label: 'Nuestra Historia' },
                { href: '/cuenta/pedidos',        label: 'Mis Pedidos' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#c9a84c]/55 hover:text-[#fff1ec] transition-colors font-body text-sm focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] mb-3">El Boletín del Escriba</h2>
            <p className="text-[#c9a84c]/45 font-body italic text-sm mb-4">
              Novedades y curiosidades directamente a tu correo.
            </p>
            {subscribed ? (
              <p className="text-[#c9a84c] font-body italic text-sm" role="status" aria-live="polite">
                ✓ ¡Suscrito! Gracias.
              </p>
            ) : (
              <form onSubmit={handleNewsletter} noValidate>
                <div className="relative">
                  <label htmlFor="newsletter-email" className="sr-only">Suscribirse al newsletter</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.es"
                    required
                    autoComplete="email"
                    className="w-full bg-transparent border-b border-[#c9a84c]/25 py-2 font-body italic text-[#fff1ec] placeholder:text-[#c9a84c]/25 focus:outline-none focus:border-[#c9a84c] text-sm"
                  />
                  <button type="submit" aria-label="Suscribirse" className="absolute right-0 bottom-2 text-[#c9a84c] hover:text-[#fff1ec] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
                <p className="text-[9px] text-[#c9a84c]/25 mt-2 italic font-body">Prometemos no enviar cuervos innecesarios.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#c9a84c]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-mono text-[10px] text-[#c9a84c]/30">© 2024 La Casa de los Juegos · Granada, España</p>
          <nav aria-label="Links legales" className="flex gap-5">
            {[
              { href: '/legal',      label: 'Aviso Legal' },
              { href: '/privacidad', label: 'Privacidad' },
              { href: '/cookies',    label: 'Cookies' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="font-mono text-[10px] text-[#c9a84c]/30 hover:text-[#c9a84c]/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
