'use client'

import type { Product } from '@/types'
import { useTranslations } from 'next-intl'
import FavoriteButton from '@/components/FavoriteButton'

interface Props {
  product: Product
  userId: string | null
  isFavorite: boolean
}

export default function ProductInfo({ product, userId, isFavorite }: Props) {
  const t = useTranslations('product')
  const tCommon = useTranslations('common')

  const isLowStock   = product.stock > 0 && product.stock <= 3
  const isOutOfStock = product.stock === 0
  const hasDiscount  = product.compare_price && product.compare_price > product.price
  const discountPct  = hasDiscount
    ? Math.round((1 - product.price / product.compare_price!) * 100)
    : 0

  return (
    <div className="flex flex-col gap-4">

      {/* Fila superior: estado stock + favorito */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOutOfStock && (
            <span className="bg-[#717a6f] text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1.5" style={{ borderRadius: '99px' }}>
              {tCommon('sold_out')}
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-[#ba1a1a] text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 flex items-center gap-1" style={{ borderRadius: '99px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {t('only_left', { count: product.stock })}
            </span>
          )}
          {!isOutOfStock && !isLowStock && (
            <span className="text-[#004317] font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              {t('in_stock')}
            </span>
          )}
        </div>

        {/* Corazón conectado a Supabase */}
        <FavoriteButton
          productId={product.id}
          userId={userId}
          initialIsFavorite={isFavorite}
          size="md"
        />
      </div>

      {/* Nombre */}
      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-[#2a170f] leading-tight italic tracking-tight">
        {product.name}
      </h1>

      {/* Categoría badge */}
      {product.category && (
        <span
          className="inline-flex items-center gap-1.5 text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 w-fit"
          style={{ background: '#1a5c2a', borderRadius: '2px' }}
        >
          {product.category.emoji} {product.category.name}
        </span>
      )}

      {/* Precio */}
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-3xl text-[#c9a84c] font-medium">
          {product.price.toFixed(2).replace('.', ',')}€
        </span>
        {hasDiscount && (
          <>
            <span className="font-mono text-base text-[#717a6f] line-through">
              {product.compare_price!.toFixed(2).replace('.', ',')}€
            </span>
            <span
              className="bg-[#c9a84c] text-[#2c1810] font-mono text-[10px] font-bold px-2 py-0.5"
              style={{ borderRadius: '2px' }}
            >
              -{discountPct}%
            </span>
          </>
        )}
      </div>
    </div>
  )
}