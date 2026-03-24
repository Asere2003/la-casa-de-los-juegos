'use client'

import type { Product } from '@/types'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  product: Product
}

export default function ProductInfo({ product }: Props) {
  const [wishlisted, setWishlisted] = useState(false)
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

      {/* Fila superior: estado stock + wishlist */}
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

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(v => !v)}
          aria-label={wishlisted ? t('remove_from_wishlist') : t('add_to_wishlist')}
          aria-pressed={wishlisted}
          className="text-[#717a6f] hover:text-[#ba1a1a] transition-colors p-2 focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
        >
          <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill={wishlisted ? '#ba1a1a' : 'none'}
            stroke={wishlisted ? '#ba1a1a' : 'currentColor'}
            strokeWidth="2" aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Nombre */}
      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-[#2a170f] leading-tight italic tracking-tight">
        {product.name}
      </h1>

      {/* Categoría badge */}
      {product.category && (
        <span
          className="inline-flex items-center gap-1.5 text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 w-fit"
          style={{ background:  '#1a5c2a', borderRadius: '2px' }}
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
