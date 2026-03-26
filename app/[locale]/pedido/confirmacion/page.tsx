import ClearCart from '@/components/pedido/ClearCart'
import Link from 'next/link'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const dynamic = 'force-dynamic'

export default async function ConfirmacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  const { session_id } = await searchParams

  if (!session_id) {
    return <Redirect locale={locale} />
  }

  const session = await stripe.checkout.sessions.retrieve(session_id)

  if (session.payment_status !== 'paid') {
    return <Redirect locale={locale} />
  }

  // Crear cliente Supabase y obtener usuario
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let order = null
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase
      .from('orders')
      .select('id, total, status')
      .eq('stripe_session_id', session_id)
      .single()

    if (data) { order = data; break }
    await new Promise(r => setTimeout(r, 1000))
  }

  const t = await getTranslations('confirmacion')

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
            <div className="flex justify-between">
              <span className="text-[#2c1810]/60">{t('email')}</span>
              <span className="text-[#2c1810] font-medium">
                {session.customer_details?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2c1810]/60">{t('total_paid')}</span>
              <span className="text-[#004317] font-bold">
                {((session.amount_total ?? 0) / 100).toFixed(2)} €
              </span>
            </div>
            {order && (
              <div className="flex justify-between">
                <span className="text-[#2c1810]/60">{t('order_number')}</span>
                <span className="text-[#2c1810] font-mono text-xs">
                  {order.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {user ? (
            <Link
              href={`/${locale}/cuenta?tab=pedidos`}
              className="btn-primary px-8 py-3 text-center"
            >
              {t('view_orders')}
            </Link>
          ) : (
            <Link
              href={`/${locale}/registro`}
              className="btn-primary px-8 py-3 text-center"
            >
              Crear cuenta para ver tus pedidos
            </Link>
          )}
          <Link
            href={`/${locale}/catalogo`}
            className="btn-outline px-8 py-3 text-center"
          >
            {t('continue_shopping')}
          </Link>
        </div>

      </div>
    </main>
  )
}

async function Redirect({ locale }: { locale: string }) {
  const t = await getTranslations('confirmacion')
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