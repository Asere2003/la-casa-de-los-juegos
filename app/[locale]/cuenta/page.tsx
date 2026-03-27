import CuentaDashboard from '@/components/cuenta/CuentaDashboard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CuentaPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  // Carga el perfil de la BD
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Carga los pedidos de la BD
  const { data: orders } = await supabase
    .from('orders')
    .select(`
    id,
    status,
    total,
    created_at,
    delivered_at,
    order_items (
      id,
      product_name,
      product_image,
      quantity,
      price,
      subtotal
    )
  `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <CuentaDashboard user={user} profile={profile} orders={orders ?? []} />
    </main>
  )
}