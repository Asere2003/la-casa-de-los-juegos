import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Casa de los Juegos — Granada',
  description: 'Juegos de mesa, puzzles, ajedrez y curiosidades lúdicas de todo el mundo.',
}

const categories = [
  { emoji: '♟', label: 'Ajedrez',        slug: 'ajedrez',     hoverBg: '#1c1c1c' },
  { emoji: '🧩', label: 'Puzzles',        slug: 'puzzles',     hoverBg: '#1a3a5c' },
  { emoji: '🎲', label: 'Juegos de Mesa', slug: 'juegos-mesa', hoverBg: '#1a5c2a' },
  { emoji: '🐉', label: 'Rol',            slug: 'rol',         hoverBg: '#3d1a5c' },
  { emoji: '🎭', label: 'Clásicos',       slug: 'clasicos',    hoverBg: '#5c3d1a' },
  { emoji: '🌍', label: 'Del Mundo',      slug: 'del-mundo',   hoverBg: '#1a4a5c' },
  { emoji: '🃏', label: 'Cartas',         slug: 'cartas',      hoverBg: '#5c1a1a' },
  { emoji: '🪀', label: 'Habilidad',      slug: 'habilidad',   hoverBg: '#755b00' },
]

const newArrivals = [
  {
    id: '1', name: 'Ajedrez de la Alhambra', slug: 'ajedrez-alhambra',
    price: 145, category: 'Ajedrez', badgeBg: '#1c1c1c', tag: null,
    description: 'Tallado a mano en ébano y arce con incrustaciones de nácar.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATSsMtmjN2tZppklbu1Fw_gowS1Pv-oO1Fkz5ma2-SWrFXKKd2gWBLSNXZk5-_8DVthdVrMbCL3pzIOqKhMV4VuGn0h2KOfN8-eq_tKyYsZp5yuED-9rMvErGfVWqU3RAULTsgeNdYtV4hH4jBSt-IUuJ3xuYb8e9Ld4Nrb4GgBZwZRXqf3qTCnkdswCChW3Z8HS-_kFSUlz5Mvuoa-7IEm2sS6jWgZVImtH4Xfz9e3oHbSPivquJjW461Hx20Qgj9TTNtZ8ATVw',
  },
  {
    id: '2', name: 'Dados de Resina Áurea', slug: 'dados-resina-aurea',
    price: 42.5, category: 'Rol', badgeBg: '#3d1a5c', tag: 'Nuevo',
    description: 'Set completo con pan de oro auténtico en resina cristalina.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk5JbuNDgIYeTKJ03cGaAAN6gkZG3Pr3TbaU1b7vDjINlFTP1E6m5dNFVB20IjG5MXesbnf9y86iJOng2wqtl6ewi8yuCXMbR9UGJ-kkiiCxN00QZh_-QYnJDUahc8XMQE7_vNkCFye0HI0dwYaWt2V9AcTafWqWPQUKR3LwQiWxRODAskvK1w9TlIw_uAhPsrnSffIMfZNj0t9tLHHsBySmotoF5qAcAI6F7CuMW3-ynQeCGucTCXmDullHxDjhE7dbOBiFVpGg',
  },
  {
    id: '3', name: 'Caja Secreta Kyu', slug: 'caja-secreta-kyu',
    price: 64, category: 'Clásicos', badgeBg: '#5c3d1a', tag: null,
    description: 'Puzzle de madera japonés con cámara oculta. Nivel maestro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXqSzQk3j4p1zioJq_0zsjUHzYxcItfxOB6jrNQpbp_qJsK4KDTRMK-78MxfwNF2W4dTBPr_perFLjIKmfhX7aAYnsDVCvzlgc4BxayidsSXLhUv0VblJUBRMED3AYfRA-eXylpynnZZe2RPWospD-I46cmhGlTW5xufD4hJE-Kim4Gu1ILQJRdUraBGjj5dwidRynNPl7OCSxHvkUyo1zisICLgW-XkSld_HGoFVLyOLuheJX3cuIXIhe2YV819--L4YILZGo6Q',
  },
  {
    id: '4', name: 'Puzzle Mecánico: El Orbe', slug: 'puzzle-mecanico-orbe',
    price: 120, category: 'Puzzles', badgeBg: '#1a3a5c', tag: 'Agotándose',
    description: '450 piezas de madera cortada por láser. Nivel Maestro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU2UWgqSoQ1oa77D_cBP77ZdP8LmYJEOkyXwVMTelDMIIHSjD7OUStWWuWzqDXEniktMOuym0FLM2ljxdl4UjFkHFKu0I9UMe6TlJA-lg7YIQ-C8Vo3wWLqbhPzS-iBu-tAsjQV8DUhTNHHnV9Be_cXjM332qEAkYHmGIElu6SHAaSxXu6jeUu7RQZKHbAtuWqoaqUSOXVpqICz4VCCWQuVRZMeJ7qBWu1Cuv8FhvUDwpp5DJ7EakFt5BImav61ArNWvyxDz-Ysg',
  },
]

const bestsellers = [
  {
    id: '5', name: 'Tablero Go Tradicional', slug: 'tablero-go-tradicional',
    price: 89, description: 'Madera de haya con piedras de resina pulida.',
    tag: 'Agotándose', tagBg: '#ba1a1a', featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzY3gZbkXXGoan0CJAueBfpVyrpSxP48W34AM6HmPqZWI3HcFwDe_JEFdw5IMuUfQZDQUUtHkIFLdBVtS4xMZqatGBXpG2It0roWOAaxivhra2qRXGh38Fj0CHJcMyvxr6RzpzfWzlbDkYh_8w89HW8r1mX4C-uYXMgAhi-JTc827JI62PB9A1NTsSIo-ybOHDYhBNAQhlXX3OUt4gCTsRq5JXiEdk934jOGkfERZSqYEoDy7OAQ-TMx8gQ2KHLMoz2bIWVBzdQ',
  },
  {
    id: '4b', name: 'Puzzle Mecánico: El Orbe', slug: 'puzzle-mecanico-orbe',
    price: 120, description: 'Nivel Maestro. 450 piezas de madera cortada por láser.',
    tag: null, tagBg: '', featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU2UWgqSoQ1oa77D_cBP77ZdP8LmYJEOkyXwVMTelDMIIHSjD7OUStWWuWzqDXEniktMOuym0FLM2ljxdl4UjFkHFKu0I9UMe6TlJA-lg7YIQ-C8Vo3wWLqbhPzS-iBu-tAsjQV8DUhTNHHnV9Be_cXjM332qEAkYHmGIElu6SHAaSxXu6jeUu7RQZKHbAtuWqoaqUSOXVpqICz4VCCWQuVRZMeJ7qBWu1Cuv8FhvUDwpp5DJ7EakFt5BImav61ArNWvyxDz-Ysg',
  },
  {
    id: '6', name: 'Baraja Tarot Arcano', slug: 'baraja-tarot-arcano',
    price: 35, description: 'Ilustraciones originales de 1920 recuperadas.',
    tag: null, tagBg: '', featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxfFCxjMDaot8TtBIkyuMqD9ou2yOasTCtMMdygDEOwwDXX3fYTVKxhLjmEFJfR4XxbIqb1BwNJ9OzD5bVcH_I5l39Q8kDU17wd9ry1d9OgnS0b9KSDhjHEjGQk02Egly19ggL4bYHvmOuFdcRcHi9Je2agTENVdv1b51I29TqXSZItEfFH42YFd2bS2W4Inrn4Ee_fewbqJ9s_8ZOf83R0mICxDdnJv1ycn21wddKmDpt_TfCT31O3K93bTdXH039-JD6zTdrw',
  },
]

const ageGroups = [
  { label: 'Niños',    sub: 'Mentes en Crecimiento',  borderColor: '#755b00', emoji: '👶' },
  { label: 'Familia',  sub: 'Momentos Compartidos',   borderColor: '#1a5c2a', emoji: '👨‍👩‍👧' },
  { label: 'Adultos',  sub: 'Estrategia y Reflexión', borderColor: '#805533', emoji: '🧠' },
  { label: 'Expertos', sub: 'Desafíos Legendarios',   borderColor: '#2c1810', emoji: '🏆' },
]

export default function HomePage() {
  return (
    <>
      {/* ══ HERO ══ */}
      <section className="relative min-h-[90dvh] md:min-h-screen flex items-center overflow-hidden bg-[#1a5c2a]" aria-label="Bienvenida">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuABqfDQ7FIq-Rw5EulpIdYRnZPoJSC6oG3LCvFGO140UN8utxkyQG7ZmJe46QzBtErnf-44qDZz1oHapiOrzGOBI5trnDWCkHRoO36uuYsacYynXevH4-MZJFtkO1Gzw8tUhGIxj3D1QJrvC4oBLrNIsMBQPWjPJpocG2gwhJMZJLcsr9li-kPqIPbFsQY-PnKiSTw3LPc-eIa8O4_OL6Q0538LWbuLCQn5YqZt7tjjbpKgjJSweRqI78LJaYT4eEFKBtjs3V4uvw"
            alt="" fill priority className="object-cover opacity-40"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#002108]/95 via-[#004317]/75 to-transparent"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#002108]/70 via-transparent to-transparent"/>
        </div>
        <div className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto w-full pt-24 pb-16">
          <div className="max-w-xl">
            <p className="font-mono text-[#c9a84c]/80 text-xs uppercase tracking-[0.3em] mb-5">Granada · Est. 2024</p>
            <h1 className="font-headline text-5xl md:text-7xl text-white leading-[1.05] tracking-tight mb-6">
              Bienvenido a<br/><em className="text-[#c9a84c]">la casa</em><br/>de los juegos
            </h1>
            <p className="font-body italic text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-md">
              Juegos de mesa, puzzles, ajedrez y mil curiosidades lúdicas de todo el mundo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalogo" style={{ borderRadius: '2px' }}
                className="bg-[#c9a84c] text-[#2c1810] font-headline font-bold px-8 py-4 text-sm hover:rotate-[-1deg] hover:shadow-2xl transition-all active:scale-95 inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white">
                Explorar tienda
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/historia" style={{ borderRadius: '2px' }}
                className="border border-[#c9a84c]/50 text-[#c9a84c] font-headline font-bold px-8 py-4 text-sm hover:bg-[#c9a84c]/10 transition-all inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                Nuestra Historia
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#c9a84c]/50 z-10" aria-hidden="true">
          <div className="w-px h-8 bg-[#c9a84c]/30 animate-pulse"/>
          <span className="font-mono text-[9px] uppercase tracking-widest">Explorar</span>
        </div>
      </section>

      {/* ══ CATEGORÍAS ══ */}
      <section className="py-14 bg-[#fff8f6] border-b border-[#c0c9bc]/20" aria-label="Categorías">
        <div className="px-6 max-w-7xl mx-auto">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mb-6 text-center">Categorías</p>
          <div className="flex overflow-x-auto no-scrollbar gap-5 pb-3 items-start justify-start md:justify-center">
            {categories.map(cat => (
              <Link key={cat.slug} href={`/catalogo?category=${cat.slug}`}
                className="flex flex-col items-center gap-2.5 shrink-0 group min-w-[72px] focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded-lg"
                aria-label={`Categoría ${cat.label}`}>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#fff1ec] flex items-center justify-center transition-all duration-300 shadow-warm border border-[#c0c9bc]/30 group-hover:scale-110 group-hover:rotate-[-3deg]">
                  <span className="text-2xl" aria-hidden="true">{cat.emoji}</span>
                </div>
                <span className="font-headline italic text-xs text-[#2a170f] text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOVEDADES ══ */}
      <section className="py-20 bg-[#fff1ec]" aria-labelledby="novedades-title">
        <div className="px-6 md:px-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mb-2">Recién llegados</p>
              <h2 id="novedades-title" className="font-headline text-4xl md:text-5xl text-[#2a170f]">Nuevas Curiosidades</h2>
              <span className="block w-14 h-0.5 bg-[#c9a84c] mt-3" aria-hidden="true"/>
            </div>
            <Link href="/catalogo" className="hidden md:flex items-center gap-1 font-body italic text-sm text-[#004317] hover:gap-3 transition-all border-b border-[#004317]/30 pb-0.5 focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
              Ver toda la colección
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {newArrivals.map(product => (
              <article key={product.id} className="group flex flex-col bg-white overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-2" style={{ borderRadius: '2px' }}>
                <Link href={`/producto/${product.slug}`} className="relative aspect-[3/4] overflow-hidden block focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/20 to-transparent pointer-events-none" aria-hidden="true"/>
                  <span className="absolute top-3 left-3 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight"
                    style={{ background: product.badgeBg, borderRadius: '2px' }}>{product.category}</span>
                  {product.tag && (
                    <span className={`absolute top-3 right-3 text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight font-bold ${product.tag === 'Nuevo' ? 'bg-[#c9a84c] text-[#2c1810]' : 'bg-[#ba1a1a] text-white'}`}
                      style={{ borderRadius: '2px' }}>{product.tag}</span>
                  )}
                </Link>
                <div className="p-4 border-t border-[#c0c9bc]/20 flex-1 flex flex-col">
                  <Link href={`/producto/${product.slug}`} className="font-headline italic text-base leading-snug mb-1 group-hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
                    {product.name}
                  </Link>
                  <p className="text-xs text-[#40493f] italic mb-3 line-clamp-2 flex-1 hidden md:block">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-[#004317]">{product.price.toFixed(2).replace('.', ',')}€</span>
                    <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}
                      className="bg-[#004317] text-white p-1.5 hover:rotate-[-2deg] transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                      style={{ borderRadius: '2px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/catalogo" className="inline-flex items-center gap-2 font-body italic text-sm text-[#004317] border-b border-[#004317]/30 pb-0.5">
              Ver toda la colección
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ EDITORIAL ══ */}
      <section className="bg-[#002108] overflow-hidden" aria-label="Nuestra historia">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          <div className="md:col-span-6 relative overflow-hidden min-h-[280px]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdwjKdfMVRKzn2XD9SKJZXwfVI_jjaEMkKdQQUVHB4azA0Q-6UuNfkUgwwuz8mIzwWoNz2BtXcqTwy-sus9ILmoV9eClT3RAXYM2xZWYgu8DeRe-GhM8VY1iREOw_CK0cnJ1qx0TGfJAujqyob-kF_UQSLB45X32GhXRlVPo56wH3roPz7g18A8Rln4FwqoTHehQbaevi1zl6smgkfbCaMCaU7bEs0NWZlMvTS9FZEGRuGzpAjrKF62KCWAs-69BkAAVqmsZxE0g"
              alt="Tienda histórica de juegos en Granada" fill
              className="object-cover opacity-60 sepia-[20%]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#002108] hidden md:block" aria-hidden="true"/>
          </div>
          <div className="md:col-span-6 flex flex-col justify-center px-10 md:px-14 py-16 text-[#fff8f6] relative z-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c9a84c]/70 mb-4">Nuestra Historia</p>
            <h2 className="font-headline text-3xl md:text-4xl text-[#fff8f6] leading-tight mb-6 italic">
              Granada siempre tuvo un rincón para jugar
            </h2>
            <p className="font-body text-[#fff8f6]/65 text-lg leading-relaxed mb-8">
              Durante décadas, en las callejuelas cercanas a la Catedral, una tienda custodió los secretos de los juegos más antiguos del mundo. Hoy revivimos ese legado.
            </p>
            <blockquote className="border-l-2 border-[#c9a84c] pl-5 mb-8">
              <p className="font-headline italic text-xl text-[#c9a84c] leading-relaxed">
                "El juego es la forma más elevada de investigación."
              </p>
              <footer className="font-mono text-xs text-[#fff8f6]/40 mt-2">— Albert Einstein</footer>
            </blockquote>
            <Link href="/historia"
              className="inline-flex items-center gap-2 text-[#c9a84c] font-headline font-bold text-sm hover:gap-4 transition-all border-b border-[#c9a84c]/30 pb-1 w-fit focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
              Leer el relato completo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MÁS VENDIDOS ══ */}
      <section className="py-20 bg-[#fff8f6]" aria-labelledby="bestsellers-title">
        <div className="px-6 md:px-10 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mb-2">Los favoritos</p>
            <h2 id="bestsellers-title" className="font-headline text-4xl text-[#2a170f]">Favoritos de la Casa</h2>
            <span className="block w-12 h-0.5 bg-[#c9a84c] mx-auto mt-3" aria-hidden="true"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end">
            {bestsellers.map(product => (
              <article key={product.id}
                className={`group overflow-hidden transition-all duration-500 ${product.featured ? 'bg-[#1a5c2a] shadow-[0_20px_50px_rgba(0,67,23,0.4)] md:-translate-y-3 md:scale-105 z-10 relative hover:md:-translate-y-5' : 'bg-[#fff1ec] shadow-warm hover:shadow-warm-lg hover:-translate-y-1'}`}
                style={{ borderRadius: '2px' }}>
                <Link href={`/producto/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw"
                    className={`object-cover group-hover:scale-105 transition-transform duration-700 ${product.featured ? 'opacity-90' : ''}`}/>
                  {product.tag && (
                    <span className="absolute top-3 left-3 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight"
                      style={{ background: product.tagBg, borderRadius: '2px' }}>{product.tag}</span>
                  )}
                </Link>
                <div className="p-4 md:p-5">
                  <Link href={`/producto/${product.slug}`}
                    className={`font-headline italic text-lg mb-1 block hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded ${product.featured ? 'text-[#c9a84c]' : 'text-[#2a170f]'}`}>
                    {product.name}
                  </Link>
                  <p className={`font-body italic text-sm mb-4 ${product.featured ? 'text-[#fff8f6]/60' : 'text-[#40493f]'}`}>{product.description}</p>
                  <div className={`flex justify-between items-center border-t pt-4 ${product.featured ? 'border-[#c9a84c]/20' : 'border-[#c0c9bc]/20'}`}>
                    <span className={`font-mono font-bold ${product.featured ? 'text-white' : 'text-[#2a170f]'}`}>
                      {product.price.toFixed(2).replace('.', ',')}€
                    </span>
                    {product.featured ? (
                      <Link href={`/producto/${product.slug}`} style={{ borderRadius: '2px' }}
                        className="bg-[#c9a84c] text-[#2c1810] px-4 py-2 font-headline text-xs font-bold hover:rotate-[-1deg] transition-transform focus-visible:ring-2 focus-visible:ring-white">
                        Lo quiero
                      </Link>
                    ) : (
                      <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}
                        className="text-[#004317] hover:scale-110 transition-transform focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded p-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POR EDADES ══ */}
      <section className="py-16 bg-[#fff1ec]" aria-labelledby="ages-title">
        <div className="px-6 max-w-7xl mx-auto">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mb-2 text-center">Para cada momento</p>
          <h2 id="ages-title" className="font-headline text-3xl text-center text-[#2a170f] mb-10">¿Para quién juegas?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {ageGroups.map(group => (
              <Link key={group.label} href={`/catalogo?age=${group.label.toLowerCase()}`}
                className="group bg-white p-6 md:p-8 flex flex-col items-center text-center shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                style={{ borderRadius: '2px', borderTop: `4px solid ${group.borderColor}` }}>
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">{group.emoji}</span>
                <h3 className="font-headline italic text-lg text-[#2a170f]">{group.label}</h3>
                <p className="font-mono text-[9px] text-[#717a6f] mt-1.5 uppercase tracking-wider">{group.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
