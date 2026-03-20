import Link from 'next/link'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductMeta({ product }: Props) {
  return (
    <div className="bg-[#fff1ec] border-b border-[#c0c9bc]/20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-4">
        <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs font-body italic text-[#717a6f] flex-wrap">
          <Link href="/" className="hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
            Inicio
          </Link>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <Link href="/catalogo" className="hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
            Catálogo
          </Link>
          {product.category && (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <Link
                href={`/catalogo?category=${product.category.slug}`}
                className="hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
              >
                {product.category.emoji} {product.category.name}
              </Link>
            </>
          )}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span className="text-[#2a170f] font-semibold line-clamp-1">{product.name}</span>
        </nav>
      </div>
    </div>
  )
}
