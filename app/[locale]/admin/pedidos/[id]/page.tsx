import { notFound, redirect } from 'next/navigation'

import Link from 'next/link'
import PedidoDetalle from '@/components/admin/PedidoDetalle'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminPedidoDetallePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">

        {/* Cabecera */}
        <div className="mb-8">
          <Link
            href={`/${locale}/admin/pedidos`}
            className="text-xs text-[#2c1810]/40 hover:text-[#004317] transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Volver a pedidos
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </h1>
        </div>

        <PedidoDetalle order={order} locale={locale} />

      </div>
    </main>
  )
}