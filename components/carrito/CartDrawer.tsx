'use client'

import { useEffect, useRef } from 'react'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useCartStore } from '@/store/cartStore'
import { useProductDrawerStore } from '@/store/productDrawerStore'
import { useTranslations } from 'next-intl'

export default function CartDrawer() {
  const isOpen     = useCartStore(s => s.isOpen)
  const closeCart  = useCartStore(s => s.closeCart)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQty  = useCartStore(s => s.updateQuantity)
  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = useCartStore(s => s.totalPrice)
  const t = useTranslations('cart')
  const tA11y = useTranslations('accessibility')

  const openProduct = useProductDrawerStore(s => s.openProduct)

  const closeRef  = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Trap focus
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const trap  = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-[69] bg-[#2a170f]/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className={`fixed inset-y-0 right-0 z-[70] flex flex-col w-full max-w-sm bg-[#fff8f6] shadow-2xl shadow-[#2a170f]/40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 ">
          <div>
            <h2 className="font-headline italic text-xl text-[#004317]">{t('title')}</h2>
            {totalItems > 0 && (
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#004317]/60 mt-0.5">
                {t('items', { count: totalItems })}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={closeCart}
            aria-label={tA11y('close_menu')}
            className="text-[#004317]/70 hover:text-[#004317] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[#004317]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#fff1ec] flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c0c9bc" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <p className="font-headline italic text-xl text-[#2a170f] mb-2">{t('empty')}</p>
                <p className="font-body italic text-sm text-[#717a6f]">{t('empty_hint')}</p>
              </div>
              <Link href="/catalogo" onClick={closeCart}
                className="bg-[#004317] text-white font-headline font-bold px-8 py-3 hover:bg-[#1a5c2a] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                style={{ borderRadius: '2px' }}>
                {t('empty_cta')}
              </Link>
            </div>
          ) : (
            <ul aria-label={t('cart_products')} className="divide-y divide-[#c0c9bc]/20 px-5 py-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  {/* Imagen */}
                  <button
                    onClick={() => { closeCart(); openProduct(product.slug) }}
                    className="shrink-0 focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
                    aria-label={tA11y('view_product', { name: product.name })}>
                    <div className="w-20 h-20 bg-[#fff1ec] overflow-hidden rounded-sm">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={tA11y('product_image', { name: product.name })} width={80} height={80}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🎲</div>
                      )}
                    </div>
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <button
                        onClick={() => { closeCart(); openProduct(product.slug) }}
                        className="font-headline italic text-sm text-[#2a170f] hover:text-[#004317] transition-colors leading-tight focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded line-clamp-2 text-left">
                        {product.name}
                      </button>
                      <button onClick={() => removeItem(product.id)} aria-label={tA11y('remove_from_cart', { name: product.name })}
                        className="shrink-0 text-[#c0c9bc] hover:text-[#ba1a1a] transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div role="group" aria-label={tA11y('product_quantity', { name: product.name })}
                        className="flex items-center border border-[#c0c9bc]/40 bg-[#fff1ec] rounded-sm">
                        <button onClick={() => updateQty(product.id, quantity - 1)} aria-label={tA11y('decrease_qty')}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#ffe9e2] transition-colors font-mono text-[#004317] text-sm focus-visible:ring-2 focus-visible:ring-[#c9a84c]">−</button>
                        <span aria-live="polite" aria-label={tA11y('quantity_value', { count: quantity })}
                          className="w-8 text-center font-mono text-xs font-bold border-x border-[#c0c9bc]/40 py-1">{quantity}</span>
                        <button onClick={() => updateQty(product.id, quantity + 1)} aria-label={tA11y('increase_qty')}
                          disabled={quantity >= product.stock}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#ffe9e2] transition-colors font-mono text-[#004317] text-sm focus-visible:ring-2 focus-visible:ring-[#c9a84c] disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#004317]">
                        {(product.price * quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#c0c9bc]/20 px-6 py-5 bg-[#fff1ec] space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body italic text-base text-[#40493f]">{t('subtotal')}</span>
              <span className="font-mono font-bold text-[#2a170f]">{totalPrice().toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body italic text-base text-[#40493f]">{t('shipping')}</span>
              <span className="font-mono text-xs bg-[#aef3b1] text-[#004317] px-2 py-0.5 font-bold rounded-sm">{t('free')}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-[#2a170f]">
              <span className="font-headline text-lg font-bold text-[#2a170f]">{t('total')}</span>
              <span className="font-mono text-xl font-bold text-[#004317]">{totalPrice().toFixed(2)}€</span>
            </div>
            <div className="space-y-3 pt-1">
              <Link href="/carrito" onClick={closeCart}
                className="w-full bg-[#004317] text-white font-headline font-bold py-4 flex items-center justify-center gap-2 hover:bg-[#1a5c2a] hover:rotate-[-0.5deg] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2"
                style={{ borderRadius: '2px' }}>
                {t('checkout')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="13 17 18 12 13 7"/>
                  <polyline points="6 17 11 12 6 7"/>
                </svg>
              </Link>
              <button onClick={closeCart}
                className="w-full border border-[#c0c9bc]/60 text-[#2a170f] font-headline italic py-3 hover:border-[#004317] hover:text-[#004317] hover:bg-white transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                style={{ borderRadius: '2px' }}>
                {t('continue')}
              </button>
            </div>
            <p className="text-center font-mono text-[9px] uppercase tracking-widest text-[#717a6f]">
              {t('packaging_note')}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
