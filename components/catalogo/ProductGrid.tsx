'use client'

import FavoriteButton from '@/components/FavoriteButton'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useTranslations } from 'next-intl'

// ── ProductCard ──────────────────────────────────────────
interface CardProps {
  product: Product
  index: number
  userId?: string | null
  isFavorite?: boolean
}

function ProductCard({ product, index, userId, isFavorite }: CardProps) {
  const addItem = useCartStore(s => s.addItem)
  const t = useTranslations('catalogue')
  const tCommon = useTranslations('common')
  const tProduct = useTranslations('product')
  const tA11y = useTranslations('accessibility')

  const isLowStock   = product.stock > 0 && product.stock <= 3
  const isOutOfStock = product.stock === 0
  const hasDiscount  = product.compare_price && product.compare_price > product.price
  const discountPct  = hasDiscount
    ? Math.round((1 - product.price / product.compare_price!) * 100)
    : 0

  return (
    <article
      className="group flex flex-col bg-white overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-1.5"
      style={{
        borderRadius: '2px',
        animationDelay: `${index * 0.05}s`,
        animation: 'fadeInUp 0.5s ease forwards',
        opacity: 0,
      }}
    >
      {/* Imagen */}
      <Link
        href={`/producto/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden block focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        aria-label={`Ver ${product.name}`}
        tabIndex={0}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#fff1ec] flex items-center justify-center text-4xl">🎲</div>
        )}

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/20 to-transparent pointer-events-none" aria-hidden="true" />

        {/* Badge categoría */}
        {product.category && (
          <span
            className="absolute top-3 left-3 text-white text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter"
            style={{ background: '#1a5c2a', borderRadius: '2px' }}
          >
            {product.category.emoji} {product.category.name}
          </span>
        )}

        {/* Badges estado + corazón */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {/* Corazón — siempre visible */}
          <FavoriteButton
            productId={product.id}
            userId={userId ?? null}
            initialIsFavorite={isFavorite ?? false}
            size="sm"
            variant="ghost"
          />
          {isOutOfStock && (
            <span className="bg-[#717a6f] text-white text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter" style={{ borderRadius: '2px' }}>
              {tCommon('sold_out')}
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-[#ba1a1a] text-white text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter" style={{ borderRadius: '2px' }}>
              {t('last_units')}
            </span>
          )}
          {hasDiscount && !isOutOfStock && (
            <span className="bg-[#c9a84c] text-[#2c1810] text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter font-bold" style={{ borderRadius: '2px' }}>
              -{discountPct}%
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 border-t border-[#c0c9bc]/15">

        {/* SKU */}
        {product.sku && (
          <span className="font-mono text-[8px] text-[#717a6f] mb-1.5">{product.sku}</span>
        )}

        {/* Nombre */}
        <Link
          href={`/producto/${product.slug}`}
          className="font-headline italic text-sm md:text-base leading-snug mb-1 group-hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded flex-1"
        >
          {product.name}
        </Link>

        {/* Estrellas — solo si hay reseñas */}
        {(product.review_count ?? 0) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  width="10" height="10" viewBox="0 0 24 24"
                  fill={star <= Math.round(product.avg_rating ?? 0) ? '#c9a84c' : 'none'}
                  stroke="#c9a84c" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="font-mono text-[9px] text-[#717a6f]">({product.review_count})</span>
          </div>
        )}

        {/* Descripción — solo desktop */}
        {product.description && (
          <p className="text-xs text-[#40493f] italic mb-3 line-clamp-2 hidden md:block">
            {product.description}
          </p>
        )}

        {/* Badges info — jugadores, dificultad */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.min_players && product.max_players && (
            <span className="font-mono text-[8px] text-[#717a6f] bg-[#fff1ec] px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
              {product.min_players === product.max_players
                ? `${product.min_players}👤`
                : `${product.min_players}–${product.max_players}👤`
              }
            </span>
          )}
          {product.difficulty && (
            <span className="font-mono text-[8px] text-[#717a6f] bg-[#fff1ec] px-1.5 py-0.5 capitalize" style={{ borderRadius: '2px' }}>
              {product.difficulty}
            </span>
          )}
        </div>

        {/* Precio + botón */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-bold text-[#004317]">
              {product.price.toFixed(2).replace('.', ',')}€
            </span>
            {hasDiscount && (
              <span className="font-mono text-[10px] text-[#717a6f] line-through">
                {product.compare_price!.toFixed(2).replace('.', ',')}€
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <span className="font-mono text-[9px] text-[#717a6f] uppercase tracking-wide">{tProduct('out_of_stock')}</span>
          ) : (
            <button
              onClick={() => addItem(product, 1)}
              aria-label={tA11y('add_to_cart', { name: product.name })}
              className="bg-[#004317] text-white p-1.5 hover:rotate-[-2deg] hover:bg-[#1a5c2a] transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

// ── ProductGrid ──────────────────────────────────────────
interface GridProps {
  products: Product[]
  loading: boolean
  userId?: string | null
  favoriteIds?: string[]
}

export default function ProductGrid({ products, loading, userId, favoriteIds }: GridProps) {
  const t = useTranslations('catalogue')

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow-warm animate-pulse" style={{ borderRadius: '2px' }}>
            <div className="aspect-[3/4] bg-[#fff1ec]"/>
            <div className="p-4 space-y-2">
              <div className="h-3 bg-[#fff1ec] rounded w-1/2"/>
              <div className="h-4 bg-[#fff1ec] rounded w-3/4"/>
              <div className="h-3 bg-[#fff1ec] rounded w-full"/>
              <div className="h-3 bg-[#fff1ec] rounded w-2/3"/>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl mb-6" aria-hidden="true">🔍</span>
        <h3 className="font-headline italic text-2xl text-[#2a170f] mb-2">
          {t('no_results')}
        </h3>
        <p className="font-body italic text-[#717a6f] text-lg">
          {t('no_results_hint')}
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
        role="list"
        aria-label={t('product_list')}
      >
        {products.map((product, i) => (
          <div key={product.id} role="listitem">
            <ProductCard
              product={product}
              index={i}
              userId={userId}
              isFavorite={favoriteIds?.includes(product.id) ?? false}
            />
          </div>
        ))}
      </div>
    </>
  )
}