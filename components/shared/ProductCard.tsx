import Image from 'next/image'
import Link from 'next/link'
import type { ProductCardItem } from '@/types/home'
import { formatEuro } from '@/lib/format'

type ProductCardProps = {
  product: ProductCardItem
  showDescription?: boolean
  compact?: boolean
}

export default function ProductCard({
  product,
  showDescription = true,
  compact = false,
}: ProductCardProps) {
  return (
    <article className="product-card group flex flex-col">
      <Link
        href={`/producto/${product.slug}`}
        className={`relative block overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] ${compact ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={compact ? '(max-width: 768px) 50vw, 20vw' : '(max-width: 768px) 50vw, 25vw'}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,23,15,0.20)] to-transparent pointer-events-none" aria-hidden="true" />

        {product.category ? (
          <span
            className="absolute top-3 left-3 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight"
            style={{ background: product.badgeBg || 'var(--color-primary)', borderRadius: '2px' }}
          >
            {product.category}
          </span>
        ) : null}

        {product.tag ? (
          <span
            className={`absolute top-3 right-3 text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight font-bold ${
              product.tag === 'Nuevo' ? 'bg-[var(--color-gold)] text-[var(--color-wood-dark)]' : 'bg-[var(--color-error)] text-white'
            }`}
            style={{ borderRadius: '2px' }}
          >
            {product.tag}
          </span>
        ) : null}
      </Link>

      <div className="p-4 border-t border-[var(--color-outline-var)]/20 flex-1 flex flex-col">
        <Link
          href={`/producto/${product.slug}`}
          className="font-headline italic text-base md:text-[1.05rem] leading-snug mb-1 group-hover:text-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded"
        >
          {product.name}
        </Link>

        {showDescription ? (
          <p className="text-xs text-[var(--color-on-surface-var)] italic mb-3 line-clamp-2 flex-1 hidden md:block">
            {product.description}
          </p>
        ) : <div className="flex-1" />}

        <div className="flex justify-between items-center gap-3 mt-auto">
          <span className="font-mono text-sm md:text-base font-bold text-[var(--color-primary)]">
            {formatEuro(product.price)}
          </span>
          <Link
            href={`/producto/${product.slug}`}
            aria-label={`Ver ${product.name}`}
            className="bg-[var(--color-primary)] text-white p-2 hover:rotate-[-2deg] transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            style={{ borderRadius: '2px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}