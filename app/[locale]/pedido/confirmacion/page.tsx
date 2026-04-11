import ClearCart from '@/components/pedido/ClearCart'
import Link from 'next/link'
import type { Metadata } from 'next'
import Stripe from 'stripe'

export const metadata: Metadata = {
  title: 'Pedido confirmado — La Casa de los Juegos',
  description: 'Tu pedido ha sido confirmado. Gracias por tu compra.',
  robots: { index: false, follow: false },
}
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTranslations } from 'next-intl/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const dynamic = 'force-dynamic'

export default async function ConfirmacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string; order_id?: string }>
}) {
  const { locale } = await params
  const { session_id, order_id } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations('confirmacion')
  const adminDb = createAdminClient()

  // ── Flujo nuevo: order_id desde /api/pago/confirmar ──────────────────────
  if (order_id) {
    const { data: order } = await adminDb
      .from('orders')
      .select('id, total, status, shipping_email')
      .eq('id', order_id)
      .single()

    if (!order || order.status !== 'paid') {
      return <Redirect locale={locale} t={t} />
    }

    return (
      <ConfirmacionUI
        locale={locale}
        user={user}
        t={t}
        email={order.shipping_email ?? null}
        total={order.total}
        orderId={order.id}
      />
    )
  }

  // ── Flujo legacy: session_id desde checkout.stripe.com ───────────────────
  if (!session_id) {
    return <Redirect locale={locale} t={t} />
  }

  const session = await stripe.checkout.sessions.retrieve(session_id)

  if (session.payment_status !== 'paid') {
    return <Redirect locale={locale} t={t} />
  }

  let order = null
  for (let i = 0; i < 5; i++) {
    const { data } = await adminDb
      .from('orders')
      .select('id, total, status')
      .eq('stripe_session_id', session_id)
      .single()

    if (data) { order = data; break }
    await new Promise(r => setTimeout(r, 1000))
  }

  return (
    <ConfirmacionUI
      locale={locale}
      user={user}
      t={t}
      email={session.customer_details?.email ?? null}
      total={(session.amount_total ?? 0) / 100}
      orderId={order?.id ?? null}
    />
  )
}

// ─── UI compartida ────────────────────────────────────────────────────────────
function ConfirmacionUI({
  locale,
  user,
  t,
  email,
  total,
  orderId,
}: {
  locale: string
  user: { id: string } | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
  email: string | null
  total: number
  orderId: string | null
}) {
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">

        <ClearCart />

        <div className="text-6xl mb-6">🎲</div>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">
            {t('label')}
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317] mb-3">
            {t('title')}
          </h1>
          <p className="text-[#2c1810]/60 font-body italic">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white border border-[#004317]/10 rounded p-4 mb-8 text-left">
          <p className="text-xs uppercase tracking-wider text-[#2c1810]/40 font-medium mb-3">
            {t('summary_title')}
          </p>
          <div className="space-y-2 text-sm">
            {email && (
              <div className="flex justify-between">
                <span className="text-[#2c1810]/60">{t('email')}</span>
                <span className="text-[#2c1810] font-medium">{email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#2c1810]/60">{t('total_paid')}</span>
              <span className="text-[#004317] font-bold">
                {total.toFixed(2)} €
              </span>
            </div>
            {orderId && (
              <div className="flex justify-between">
                <span className="text-[#2c1810]/60">{t('order_number')}</span>
                <span className="text-[#2c1810] font-mono text-xs">
                  {orderId.slice(0, 8).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {user ? (
            <Link
              href={`/${locale}/cuenta?tab=pedidos`}
              className="w-full btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:rotate-0"
            >
              {t('view_orders')} →
            </Link>
          ) : (
            <Link
              href={`/${locale}/registro`}
              className="btn-primary px-8 py-3 text-center"
            >
              {t('create_account')}
            </Link>
          )}
          <Link
            href={`/${locale}/catalogo`}
            className="w-full btn-outline justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:rotate-0"
          >
            {t('continue_shopping')}
          </Link>
        </div>

      </div>
    </main>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function Redirect({ locale, t }: { locale: string; t: any }) {
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#2c1810]/60 mb-4">{t('not_found')}</p>
        <Link href={`/${locale}/catalogo`} className="btn-primary px-6 py-2">
          {t('go_catalogue')}
        </Link>
      </div>
    </main>
  )
}
