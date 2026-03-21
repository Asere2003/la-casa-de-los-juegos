'use client'

import { useCartStore } from '@/store/cartStore'
import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function CartSummary() {
  const totalPrice = useCartStore(s => s.totalPrice)
  const items      = useCartStore(s => s.items)
  const t = useTranslations('cart')

  const [coupon, setCoupon]       = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError]     = useState('')
  const [loading, setLoading]     = useState(false)
  const router = useRouter()

  const subtotal     = totalPrice()
  const shippingFree = subtotal >= 50
  const shippingCost = shippingFree ? 0 : 4.95
  const discount     = couponApplied ? subtotal * 0.1 : 0
  const total        = subtotal + shippingCost - discount

  const handleCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (coupon.toUpperCase() === 'JUEGOS10') {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError(t('invalid_code'))
      setCouponApplied(false)
    }
  }

  const handleCheckout = async () => {
    setLoading(true)
    // TODO: conectar con /api/checkout (Stripe)
    // Por ahora redirigimos a login si no hay sesión
    router.push('/login?redirect=/carrito')
    setLoading(false)
  }

  return (
    <div
      className="bg-[#fff1ec] p-7 shadow-warm sticky top-24 border-t-4 border-[#004317]"
      style={{ borderRadius: '2px' }}
    >
      <h2 className="font-headline italic text-xl text-[#004317] mb-6">
        {t('order_summary')}
      </h2>

      {/* Líneas */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-[#2a170f]">
          <span className="font-body italic text-base">
            {t('subtotal')}
            <span className="font-mono text-[9px] text-[#717a6f] ml-1.5">
              ({t('items', { count: items.length })})
            </span>
          </span>
          <span className="font-mono font-bold">{subtotal.toFixed(2).replace('.', ',')}€</span>
        </div>

        <div className="flex justify-between items-center text-[#2a170f]">
          <span className="font-body italic text-base">{t('shipping')}</span>
          {shippingFree ? (
            <span className="font-mono text-xs bg-[#aef3b1] text-[#004317] px-2 py-0.5 font-bold" style={{ borderRadius: '2px' }}>
              {t('free')}
            </span>
          ) : (
            <span className="font-mono font-bold">{shippingCost.toFixed(2).replace('.', ',')}€</span>
          )}
        </div>

        {!shippingFree && (
          <p className="font-mono text-[9px] text-[#717a6f] text-right">
            {t('free_shipping_note', { remaining: (50 - subtotal).toFixed(2).replace('.', ',') })}
          </p>
        )}

        {couponApplied && (
          <div className="flex justify-between items-center text-[#004317]">
            <span className="font-body italic text-base flex items-center gap-1.5">
              <span className="font-mono text-[9px] bg-[#004317] text-white px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
                JUEGOS10
              </span>
              {t('discount')}
            </span>
            <span className="font-mono font-bold text-[#004317]">−{discount.toFixed(2).replace('.', ',')}€</span>
          </div>
        )}
      </div>

      {/* Cupón */}
      <form onSubmit={handleCoupon} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <label htmlFor="coupon-input" className="sr-only">{t('coupon')}</label>
            <input
              id="coupon-input"
              type="text"
              value={coupon}
              onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError('') }}
              placeholder={t('coupon')}
              disabled={couponApplied}
              className="w-full bg-white border border-[#c0c9bc]/50 text-[#2a170f] font-body italic text-sm px-3 py-2.5 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '2px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!coupon || couponApplied}
            className="bg-[#2a170f] text-[#c9a84c] font-mono text-xs uppercase tracking-wide px-4 py-2.5 hover:bg-[#1a0f0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            style={{ borderRadius: '2px' }}
          >
            {couponApplied ? '✓' : 'OK'}
          </button>
        </div>
        {couponError && (
          <p className="font-mono text-[9px] text-[#ba1a1a] mt-1.5" role="alert">{couponError}</p>
        )}
        {couponApplied && (
          <p className="font-mono text-[9px] text-[#004317] mt-1.5" role="status">✓ {t('discount_applied')}</p>
        )}
      </form>

      {/* Total */}
      <div className="flex justify-between items-center pt-5 border-t-2 border-[#2a170f] mb-5">
        <span className="font-headline text-xl font-bold text-[#2a170f]">{t('total')}</span>
        <span className="font-mono text-2xl font-bold text-[#004317]">
          {total.toFixed(2).replace('.', ',')}€
        </span>
      </div>

      {/* Checkout */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-[#004317] text-white font-headline font-bold py-5 flex items-center justify-center gap-3 hover:bg-[#1a5c2a] hover:rotate-[-0.5deg] active:scale-[0.98] transition-all text-base focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:rotate-0"
        style={{ borderRadius: '2px' }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {t('processing')}
          </>
        ) : (
          <>
            {t('checkout')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="13 17 18 12 13 7"/>
              <polyline points="6 17 11 12 6 7"/>
            </svg>
          </>
        )}
      </button>

      {/* Métodos de pago */}
      <div className="mt-6">
        <p className="text-center font-mono text-[9px] uppercase tracking-widest text-[#717a6f] mb-3">
          {t('payment_methods')}
        </p>
        <div className="flex justify-center items-center gap-6">
          {[
            { icon: '💳', label: t('method_card') },
            { icon: '📱', label: t('method_bizum') },
            { icon: '🏦', label: t('method_transfer') },
          ].map(method => (
            <div key={method.label} className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
              <span className="text-xl" aria-hidden="true">{method.icon}</span>
              <span className="font-mono text-[8px] uppercase tracking-wide text-[#717a6f]">{method.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badge */}
      <div className="mt-5 p-3.5 bg-white border-l-2 border-[#c9a84c] flex gap-3 items-start" style={{ borderRadius: '2px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004317" strokeWidth="2" className="shrink-0 mt-0.5" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
        <p className="font-body italic text-xs text-[#40493f] leading-relaxed">
          {t('trust_note')}
        </p>
      </div>
    </div>
  )
}
