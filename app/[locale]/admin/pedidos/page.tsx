import PedidosAdminTable from '@/components/admin/PedidosAdminTable'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPedidosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total,
      shipping_name,
      shipping_email,
      shipping_city,
      created_at,
      order_items (
        id,
        product_name,
        quantity,
        price
      )
    `)
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  return (

      <div>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
            Pedidos
          </h1>
        </div>
        <PedidosAdminTable orders={orders ?? []} locale={locale} />
      </div>

  )
}