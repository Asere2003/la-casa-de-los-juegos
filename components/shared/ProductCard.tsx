import FavoriteButton from '@/components/FavoriteButton'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { ProductCardItem } from '@/types/home'
import { formatEuro } from '@/lib/format'

type ProductCardProps = {
  product: ProductCardItem
  showDescription?: boolean
  compact?: boolean
  userId?: string | null
  isFavorite?: boolean
}

function IconCart() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export default function ProductCard({
  product,
  showDescription = true,
  compact = false,
  userId = null,
  isFavorite = false,
}: ProductCardProps) {
  return (
    <article className="product-card group flex flex-col bg-white">

      {/* ── Imagen ── */}
      <Link
        href={`/producto/${product.slug}`}
        className={`relative block overflow-hidden focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${compact ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={compact ? '(max-width: 768px) 50vw, 20vw' : '(max-width: 768px) 50vw, 25vw'}
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          style={{ background: 'white' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/20 to-transparent pointer-events-none" aria-hidden="true"/>
        {/* Badge categoría */}
        {product.category && (
          <span
            className="absolute top-3 left-3 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight"
            style={{ background: product.badgeBg || '#004D26', borderRadius: '2px' }}
          >
            {product.category}
          </span>
        )}

        {/* Tag + Favorito */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
          {product.tag && (
            <span
              className={`text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight font-bold ${
                product.tag === 'Nuevo'
                  ? 'bg-[#C9A84C] text-[#2A170F]'
                  : 'bg-[#ba1a1a] text-white'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {product.tag}
            </span>
          )}
          <FavoriteButton
            productId={product.id}
            userId={userId}
            initialIsFavorite={isFavorite}
            size="sm"
          />
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="p-4 flex-1 flex flex-col">

        {/* Nombre + precio en la misma línea */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/producto/${product.slug}`}
            className="font-headline text-sm md:text-base leading-snug text-[#2A170F] group-hover:text-[#004D26] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded flex-1"
          >
            {product.name}
          </Link>
          <span className="font-mono text-sm font-bold text-[#C9A84C] whitespace-nowrap shrink-0">
            {formatEuro(product.price)}
          </span>
        </div>

        {/* Descripción */}
        {showDescription && (
          <p className="text-[11px] text-[#2A170F]/50 italic mb-4 line-clamp-2 hidden md:block leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex-1" />

        {/* Botón COMPRAR */}
        <div className="border-t border-[#e8e0d8] mt-3 pt-3">
          <Link
            href={`/producto/${product.slug}`}
            aria-label={`Comprar ${product.name}`}
            className="flex items-center justify-center gap-2 w-full font-mono text-[10px] uppercase tracking-widest text-[#2A170F]/60 hover:text-[#004D26] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded py-0.5"
          >
            Comprar
            <IconCart />
          </Link>
        </div>
      </div>
    </article>
  )
}