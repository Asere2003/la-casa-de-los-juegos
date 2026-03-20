import Link from 'next/link'

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">

      {/* Icono */}
      <div className="w-24 h-24 rounded-full bg-[#fff1ec] flex items-center justify-center mb-8 shadow-warm">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0c9bc" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>

      <h2 className="font-headline italic text-3xl text-[#2a170f] mb-3">
        Tu carrito está vacío
      </h2>
      <p className="font-body italic text-lg text-[#717a6f] mb-10 max-w-sm leading-relaxed">
        Explora nuestra colección y encuentra el juego perfecto para ti.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/catalogo"
          className="bg-[#004317] text-white font-headline font-bold px-10 py-4 hover:bg-[#1a5c2a] hover:rotate-[-1deg] transition-all active:scale-95 inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          style={{ borderRadius: '2px' }}
        >
          Explorar catálogo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link
          href="/"
          className="border border-[#c0c9bc]/60 text-[#2a170f] font-headline italic px-10 py-4 hover:border-[#004317] hover:text-[#004317] hover:bg-[#fff1ec] transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          style={{ borderRadius: '2px' }}
        >
          Volver al inicio
        </Link>
      </div>

      {/* Sugerencias de categorías */}
      <div className="mt-16">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mb-5">
          ¿No sabes por dónde empezar?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { emoji: '♟', label: 'Ajedrez',  slug: 'ajedrez' },
            { emoji: '🧩', label: 'Puzzles',  slug: 'puzzles' },
            { emoji: '🎲', label: 'Mesa',     slug: 'juegos-mesa' },
            { emoji: '🐉', label: 'Rol',      slug: 'rol' },
            { emoji: '🌍', label: 'Mundo',    slug: 'del-mundo' },
          ].map(cat => (
            <Link
              key={cat.slug}
              href={`/catalogo?category=${cat.slug}`}
              className="flex items-center gap-2 border border-[#c0c9bc]/50 text-[#2a170f] font-headline italic text-sm px-4 py-2 hover:border-[#004317] hover:text-[#004317] hover:bg-[#fff1ec] transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '99px' }}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
