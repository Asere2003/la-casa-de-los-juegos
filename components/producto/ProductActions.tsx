'use client'

import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  product: Product
  onAddToCart?: () => void
}

export default function ProductActions({ product, onAddToCart }: Props) {
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const t = useTranslations('product')
  const tA11y = useTranslations('accessibility')

  const isOutOfStock = product.stock === 0
  const maxQty       = Math.min(product.stock, 10)

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    onAddToCart?.()
  }

  const decrease = () => setQty(q => Math.max(1, q - 1))
  const increase = () => setQty(q => Math.min(maxQty, q + 1))

  return (
    <div className="flex flex-col gap-4 border-t border-[#c0c9bc]/20 pt-5">

      {/* Cantidad */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="font-body italic text-sm text-[#717a6f]">{t('quantity')}:</span>
          <div
            role="group"
            aria-label={t('select_quantity')}
            className="flex items-center border border-[#c0c9bc]/40 bg-[#fff1ec]"
            style={{ borderRadius: '2px' }}
          >
            <button
              onClick={decrease}
              disabled={qty <= 1}
              aria-label={tA11y('decrease_qty')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#ffe9e2] transition-colors font-mono text-[#004317] text-lg disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            >
              −
            </button>
            <span
              aria-live="polite"
              aria-label={`${t('quantity')}: ${qty}`}
              className="w-12 text-center font-mono text-sm font-bold border-x border-[#c0c9bc]/40 py-2.5"
            >
              {qty}
            </span>
            <button
              onClick={increase}
              disabled={qty >= maxQty}
              aria-label={tA11y('increase_qty')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#ffe9e2] transition-colors font-mono text-[#004317] text-lg disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            >
              +
            </button>
          </div>
          <span className="font-mono text-[9px] text-[#717a6f]">
            {t('available', { count: product.stock })}
          </span>
        </div>
      )}

      {/* Botón añadir */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        aria-label={isOutOfStock ? t('product_exhausted') : t('add_units', { qty })}
        className={`
          w-full font-headline font-bold py-5 flex items-center justify-center gap-3
          text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2
          ${isOutOfStock
            ? 'bg-[#c0c9bc] text-[#717a6f] cursor-not-allowed'
            : added
              ? 'bg-[#004317] text-[#c9a84c] rotate-[-0.3deg]'
              : 'bg-[#004317] text-white hover:bg-[#1a5c2a] hover:rotate-[-0.5deg] hover:shadow-warm-lg active:scale-[0.98]'
          }
        `}
        style={{ borderRadius: '2px' }}
      >
        {isOutOfStock ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            {t('out_of_stock')}
          </>
        ) : added ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {t('added')}
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {t('add_to_cart')}
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="grid grid-cols-1 gap-2">
        {[
          // { icon: '🚚', text: t('trust_free_shipping') },
          // { icon: '📦', text: t('trust_packaging') },
          { icon: '↩️', text: t('trust_returns') },
        ].map(badge => (
          <div key={badge.icon} className="flex items-center gap-2.5">
            <span className="text-sm" aria-hidden="true">{badge.icon}</span>
            <span className="font-mono text-[9px] uppercase tracking-wide text-[#717a6f]">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
