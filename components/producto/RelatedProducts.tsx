import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  currentSlug: string
}

export default function RelatedProducts({ products, currentSlug }: Props) {
  const filtered = products.filter(p => p.slug !== currentSlug).slice(0, 4)
  if (filtered.length === 0) return null

  return (
    <section className="mt-20 md:mt-28 pt-10 border-t border-[#c0c9bc]/20" aria-labelledby="related-title">

      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <h2 id="related-title" className="font-headline text-2xl md:text-3xl italic text-[#2a170f] shrink-0">
          También te puede gustar
        </h2>
        <div className="flex-1 h-px bg-[#c0c9bc]/25" aria-hidden="true"/>
        <Link
          href="/catalogo"
          className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] border-b border-[#c9a84c]/30 pb-0.5 hover:text-[#004317] hover:border-[#004317]/30 transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
        >
          Ver todos
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7" role="list" aria-label="Productos relacionados">
        {filtered.map(product => (
          <article
            key={product.id}
            role="listitem"
            className="group bg-white overflow-hidden shadow-warm hover:shadow-warm-lg hover:-translate-y-2 transition-all duration-500"
            style={{ borderRadius: '2px' }}
          >
            <Link
              href={`/producto/${product.slug}`}
              className="block relative aspect-[3/4] overflow-hidden focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              aria-label={`Ver ${product.name}`}
            >
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-[#fff1ec] flex items-center justify-center text-3xl" aria-hidden="true">🎲</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/20 to-transparent pointer-events-none" aria-hidden="true"/>
              {product.category && (
                <span
                  className="absolute top-3 left-3 text-white text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter"
                  style={{ background: product.category.color || '#1a5c2a', borderRadius: '2px' }}
                >
                  {product.category.emoji} {product.category.name}
                </span>
              )}
            </Link>

            <div className="p-4">
              <Link
                href={`/producto/${product.slug}`}
                className="font-headline italic text-base leading-snug block mb-2 group-hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
              >
                {product.name}
              </Link>
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-bold text-[#c9a84c]">
                  {product.price?.toFixed(2).replace('.', ',')}€
                </span>
                <Link
                  href={`/producto/${product.slug}`}
                  aria-label={`Ver ${product.name}`}
                  className="text-[#004317] hover:scale-110 transition-transform focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
