'use client'

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import PaymentLoadingOverlay from '@/components/pago/PaymentLoadingOverlay'
import { loadStripe } from '@stripe/stripe-js'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from '@/i18n/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const appearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#004317',
    colorBackground: '#ffffff',
    colorText: '#2c1810',
    colorDanger: '#ba1a1a',
    fontFamily: 'Newsreader, serif',
    borderRadius: '2px',
  },
}

interface UserProfile {
  nombre?: string | null
  email?: string | null
  direccion?: string | null
  ciudad?: string | null
  codigo_postal?: string | null
  pais?: string | null
}

interface PagoContentProps {
  user: { id: string; email: string } | null
  profile: UserProfile | null
}

// ─── Inner form (needs Stripe context) ───────────────────────────────────────
function CheckoutForm({
  user,
  profile,
  clientSecret,
  shippingData,
  setShippingData,
  paying,
  setPaying,
  onSuccess,
}: {
  user: PagoContentProps['user']
  profile: UserProfile | null
  clientSecret: string
  shippingData: ReturnType<typeof buildInitialShipping>
  setShippingData: React.Dispatch<React.SetStateAction<ReturnType<typeof buildInitialShipping>>>
  paying: boolean
  setPaying: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: (orderId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const t = useTranslations('pago')
  const items = useCartStore(s => s.items)
  const totalPrice = useCartStore(s => s.totalPrice)

  const subtotal = totalPrice()
  const shippingFree = subtotal >= 50
  const shippingCost = shippingFree ? 0 : 4.95
  const discount = shippingData.couponApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  const [payError, setPayError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || paying) return

    // Validar campos
    const required = ['nombre', 'email', 'direccion', 'ciudad', 'codigo_postal', 'pais'] as const
    for (const field of required) {
      if (!shippingData[field]?.trim()) {
        setPayError(t('field_required', { field: t(field) }))
        return
      }
    }

    setPaying(true)
    setPayError('')

    try {
      // Confirmar pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: 'if_required',
      })

      if (stripeError) {
        setPayError(stripeError.message ?? t('payment_error'))
        setPaying(false)
        return
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setPayError(t('payment_error'))
        setPaying(false)
        return
      }

      // Llamar a /api/pago/confirmar
      const res = await fetch('/api/pago/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          items,
          shippingCost,
          discount,
          shippingData: {
            nombre: shippingData.nombre,
            email: shippingData.email,
            direccion: shippingData.direccion,
            ciudad: shippingData.ciudad,
            codigo_postal: shippingData.codigo_postal,
            pais: shippingData.pais,
            guardarDireccion: shippingData.guardarDireccion,
          },
          userId: user?.id,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setPayError(data.error ?? t('payment_error'))
        setPaying(false)
        return
      }

      onSuccess(data.orderId)
    } catch {
      setPayError(t('payment_error'))
      setPaying(false)
    }
  }

  const inputClass =
    'w-full bg-white border border-[#c0c9bc]/60 text-[#2c1810] font-body italic text-sm px-3 py-2.5 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] disabled:opacity-50'

  const hasProfile = !!(profile?.direccion && profile?.ciudad)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Datos de envío */}
      <section>
        <h2 className="font-headline italic text-lg text-[#004317] mb-4 pb-2 border-b border-[#004317]/20">
          {t('shipping_title')}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mb-1">
              {t('nombre')} *
            </label>
            <input
              type="text"
              value={shippingData.nombre}
              onChange={e => setShippingData(p => ({ ...p, nombre: e.target.value }))}
              required
              disabled={paying}
              className={inputClass}
              style={{ borderRadius: '2px' }}
            />
          </div>

          {/* Email — solo visible si guest */}
          {!user && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mb-1">
                {t('email')} *
              </label>
              <input
                type="email"
                value={shippingData.email}
                onChange={e => setShippingData(p => ({ ...p, email: e.target.value }))}
                required
                disabled={paying}
                className={inputClass}
                style={{ borderRadius: '2px' }}
              />
            </div>
          )}

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mb-1">
              {t('direccion')} *
            </label>
            <input
              type="text"
              value={shippingData.direccion}
              onChange={e => setShippingData(p => ({ ...p, direccion: e.target.value }))}
              required
              disabled={paying}
              className={inputClass}
              style={{ borderRadius: '2px' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mb-1">
                {t('ciudad')} *
              </label>
              <input
                type="text"
                value={shippingData.ciudad}
                onChange={e => setShippingData(p => ({ ...p, ciudad: e.target.value }))}
                required
                disabled={paying}
                className={inputClass}
                style={{ borderRadius: '2px' }}
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mb-1">
                {t('codigo_postal')} *
              </label>
              <input
                type="text"
                value={shippingData.codigo_postal}
                onChange={e => setShippingData(p => ({ ...p, codigo_postal: e.target.value }))}
                required
                disabled={paying}
                className={inputClass}
                style={{ borderRadius: '2px' }}
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mb-1">
              {t('pais')} *
            </label>
            <select
              value={shippingData.pais}
              onChange={e => setShippingData(p => ({ ...p, pais: e.target.value }))}
              required
              disabled={paying}
              className={inputClass}
              style={{ borderRadius: '2px' }}
            >
              <option value="ES">España</option>
              <option value="PT">Portugal</option>
              <option value="FR">Francia</option>
              <option value="DE">Alemania</option>
              <option value="IT">Italia</option>
              <option value="GB">Reino Unido</option>
            </select>
          </div>

          {/* Guardar dirección — solo si logado y sin dirección previa */}
          {user && !hasProfile && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shippingData.guardarDireccion}
                onChange={e => setShippingData(p => ({ ...p, guardarDireccion: e.target.checked }))}
                disabled={paying}
                className="accent-[#004317]"
              />
              <span className="font-body italic text-sm text-[#2c1810]">
                {t('save_address')}
              </span>
            </label>
          )}
        </div>
      </section>

      {/* Stripe Elements */}
      <section>
        <h2 className="font-headline italic text-lg text-[#004317] mb-4 pb-2 border-b border-[#004317]/20">
          {t('payment_title')}
        </h2>
        <div className="bg-white border border-[#c0c9bc]/40 p-4" style={{ borderRadius: '2px' }}>
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>
      </section>

      {/* Error */}
      {payError && (
        <p className="font-mono text-xs text-[#ba1a1a] bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 px-4 py-3" style={{ borderRadius: '2px' }} role="alert">
          {payError}
        </p>
      )}

      {/* Total + Botón */}
      <div className="pt-4 border-t-2 border-[#2c1810]">
        <div className="flex justify-between items-center mb-5">
          <span className="font-headline text-xl font-bold text-[#2c1810]">{t('total')}</span>
          <span className="font-mono text-2xl font-bold text-[#004317]">
            {total.toFixed(2).replace('.', ',')}€
          </span>
        </div>
        <button
          type="submit"
          disabled={!stripe || paying}
          className="w-full bg-[#004317] text-white font-headline font-bold py-5 flex items-center justify-center gap-3 hover:bg-[#1a5c2a] hover:rotate-[-0.5deg] active:scale-[0.98] transition-all text-base focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:rotate-0"
          style={{ borderRadius: '2px' }}
        >
          {paying ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              {t('processing')}
            </>
          ) : (
            <>
              {t('pay_now')} — {total.toFixed(2).replace('.', ',')}€
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </>
          )}
        </button>
        <p className="text-center font-mono text-[9px] uppercase tracking-widest text-[#717a6f] mt-3">
          {t('secure_payment')}
        </p>
      </div>
    </form>
  )
}

// ─── Build initial shipping state ─────────────────────────────────────────────
function buildInitialShipping(
  user: PagoContentProps['user'],
  profile: UserProfile | null
) {
  return {
    nombre: profile?.nombre ?? '',
    email: user?.email ?? profile?.email ?? '',
    direccion: profile?.direccion ?? '',
    ciudad: profile?.ciudad ?? '',
    codigo_postal: profile?.codigo_postal ?? '',
    pais: profile?.pais ?? 'ES',
    guardarDireccion: false,
    couponApplied: false,
    coupon: '',
    couponError: '',
  }
}

// ─── Order summary sidebar ────────────────────────────────────────────────────
function OrderSummary({
  shippingData,
  setShippingData,
}: {
  shippingData: ReturnType<typeof buildInitialShipping>
  setShippingData: React.Dispatch<React.SetStateAction<ReturnType<typeof buildInitialShipping>>>
}) {
  const t = useTranslations('pago')
  const items = useCartStore(s => s.items)
  const totalPrice = useCartStore(s => s.totalPrice)

  const subtotal = totalPrice()
  const shippingFree = subtotal >= 50
  const shippingCost = shippingFree ? 0 : 4.95
  const discount = shippingData.couponApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  const handleCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (shippingData.coupon.toUpperCase() === 'JUEGOS10') {
      setShippingData(p => ({ ...p, couponApplied: true, couponError: '' }))
    } else {
      setShippingData(p => ({ ...p, couponError: t('invalid_code'), couponApplied: false }))
    }
  }

  return (
    <div className="bg-[#fff1ec] p-7 shadow-warm sticky top-24 border-t-4 border-[#004317]" style={{ borderRadius: '2px' }}>
      <h2 className="font-headline italic text-xl text-[#004317] mb-5">{t('order_summary')}</h2>

      {/* Productos */}
      <div className="space-y-3 mb-5">
        {items.map(item => (
          <div key={item.product.id} className="flex justify-between items-start text-sm text-[#2c1810]">
            <span className="font-body italic flex-1 pr-2 leading-snug">
              {item.product.name}
              <span className="text-[#717a6f] text-xs ml-1">×{item.quantity}</span>
            </span>
            <span className="font-mono font-bold shrink-0">
              {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}€
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#004317]/20 pt-4 space-y-2 mb-5">
        <div className="flex justify-between text-sm text-[#2c1810]">
          <span className="font-body italic">{t('subtotal')}</span>
          <span className="font-mono font-bold">{subtotal.toFixed(2).replace('.', ',')}€</span>
        </div>
        <div className="flex justify-between text-sm text-[#2c1810]">
          <span className="font-body italic">{t('shipping')}</span>
          {shippingFree ? (
            <span className="font-mono text-xs bg-[#aef3b1] text-[#004317] px-2 py-0.5 font-bold" style={{ borderRadius: '2px' }}>{t('free')}</span>
          ) : (
            <span className="font-mono font-bold">{shippingCost.toFixed(2).replace('.', ',')}€</span>
          )}
        </div>
        {shippingData.couponApplied && (
          <div className="flex justify-between text-sm text-[#004317]">
            <span className="font-body italic">{t('discount')}</span>
            <span className="font-mono font-bold">−{discount.toFixed(2).replace('.', ',')}€</span>
          </div>
        )}
      </div>

      {/* Cupón */}
      <form onSubmit={handleCoupon} className="mb-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={shippingData.coupon}
            onChange={e => setShippingData(p => ({ ...p, coupon: e.target.value.toUpperCase(), couponError: '' }))}
            placeholder={t('coupon')}
            disabled={shippingData.couponApplied}
            className="flex-1 bg-white border border-[#c0c9bc]/50 text-[#2c1810] font-body italic text-sm px-3 py-2 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] disabled:opacity-50"
            style={{ borderRadius: '2px' }}
          />
          <button
            type="submit"
            disabled={!shippingData.coupon || shippingData.couponApplied}
            className="bg-[#2a170f] text-[#c9a84c] font-mono text-xs uppercase tracking-wide px-4 py-2 hover:bg-[#1a0f0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: '2px' }}
          >
            {shippingData.couponApplied ? '✓' : 'OK'}
          </button>
        </div>
        {shippingData.couponError && (
          <p className="font-mono text-[9px] text-[#ba1a1a] mt-1">{shippingData.couponError}</p>
        )}
        {shippingData.couponApplied && (
          <p className="font-mono text-[9px] text-[#004317] mt-1">✓ {t('discount_applied')}</p>
        )}
      </form>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-[#2c1810]">
        <span className="font-headline text-xl font-bold text-[#2c1810]">{t('total')}</span>
        <span className="font-mono text-2xl font-bold text-[#004317]">
          {total.toFixed(2).replace('.', ',')}€
        </span>
      </div>

      {/* Trust badge */}
      <div className="mt-5 p-3.5 bg-white border-l-2 border-[#c9a84c] flex gap-3 items-start" style={{ borderRadius: '2px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004317" strokeWidth="2" className="shrink-0 mt-0.5" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <p className="font-body italic text-xs text-[#40493f] leading-relaxed">
          {t('trust_note')}
        </p>
      </div>
    </div>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function PagoContent({ user, profile }: PagoContentProps) {
  const t = useTranslations('pago')
  const locale = useLocale()
  const router = useRouter()
  const items = useCartStore(s => s.items)
  const _hasHydrated = useCartStore(s => s._hasHydrated)
  const clearCart = useCartStore(s => s.clearCart)

  const [shippingData, setShippingData] = useState(() =>
    buildInitialShipping(user, profile)
  )
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentError, setIntentError] = useState('')
  const [pagado, setPagado] = useState(false)
  const [paying, setPaying] = useState(false)
  const intentCreating = useRef(false)

  const subtotal = useCartStore(s => s.totalPrice)()
  const shippingFree = subtotal >= 50
  const shippingCost = shippingFree ? 0 : 4.95
  const discount = shippingData.couponApplied ? subtotal * 0.1 : 0

  // Redirigir si carrito vacío (tras hidratación), pero no si el pago acaba de completarse
  useEffect(() => {
    if (_hasHydrated && items.length === 0 && !pagado) {
      router.replace('/carrito')
    }
  }, [_hasHydrated, items.length, pagado, locale, router])

  // Crear PaymentIntent una sola vez en cuanto hay carrito
  useEffect(() => {
    if (!_hasHydrated || items.length === 0 || intentCreating.current) return
    intentCreating.current = true

    const createIntent = async () => {
      setIntentError('')
      try {
        const res = await fetch('/api/pago/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            shippingCost,
            discount,
            userId: user?.id,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setClientSecret(data.clientSecret)
      } catch (err) {
        console.error(err)
        setIntentError(t('intent_error'))
        intentCreating.current = false // permitir reintentar si hay error
      }
    }

    createIntent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, items.length])

  const handleSuccess = (orderId: string) => {
    setPagado(true)
    clearCart()
    router.push(`/pedido/confirmacion?order_id=${orderId}`)
  }

  if (!_hasHydrated || (items.length === 0 && !pagado)) {
    return (
      <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center">
        <div className="animate-pulse text-[#717a6f] font-body italic">{t('loading')}</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c] mb-2">
            {t('step_label')}
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">{t('title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Formulario + Stripe */}
          <div className="bg-white border border-[#004317]/10 p-6 lg:p-8" style={{ borderRadius: '2px' }}>
            {intentError && (
              <p className="font-mono text-xs text-[#ba1a1a] mb-6 bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 px-4 py-3" style={{ borderRadius: '2px' }}>
                {intentError}
              </p>
            )}

            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance, locale: locale === 'cat' ? 'es' : (locale as 'es' | 'en') }}
              >
                <CheckoutForm
                  user={user}
                  profile={profile}
                  clientSecret={clientSecret}
                  shippingData={shippingData}
                  setShippingData={setShippingData}
                  paying={paying}
                  setPaying={setPaying}
                  onSuccess={handleSuccess}
                />
              </Elements>
            ) : (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin text-[#004317]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <OrderSummary shippingData={shippingData} setShippingData={setShippingData} />
        </div>
      </div>

      {paying && <PaymentLoadingOverlay />}
    </main>
  )
}
