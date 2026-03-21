'use client'

import CartItem from './CartItem'
import { Link } from '@/i18n/navigation'
import { useCartStore } from '@/store/cartStore'
import { useTranslations } from 'next-intl'

export default function CartItemList() {
  const items      = useCartStore(s => s.items)
  const clearCart  = useCartStore(s => s.clearCart)
  const t = useTranslations('cart')

  return (
    <section aria-label={t('cart_products')}>

      {/* Cabecera lista */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline italic text-xl text-[#2a170f]">
          {t('articles')}
        </h2>
        <button
          onClick={clearCart}
          className="font-mono text-[9px] uppercase tracking-wide text-[#717a6f] hover:text-[#ba1a1a] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
        >
          {t('empty_cart')}
        </button>
      </div>

      {/* Lista */}
      <ul className="space-y-4" role="list" aria-label={t('product_list')}>
        {items.map(item => (
          <li key={item.product.id}>
            <CartItem item={item} />
          </li>
        ))}
      </ul>

      {/* Continuar comprando — móvil */}
      <div className="mt-6 md:hidden">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 font-body italic text-sm text-[#717a6f] hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {t('keep_shopping')}
        </Link>
      </div>
    </section>
  )
}
