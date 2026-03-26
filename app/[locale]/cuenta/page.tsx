import CuentaDashboard from '@/components/cuenta/CuentaDashboard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CuentaPage({
  params
}: {
  params: { locale: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${params.locale}/login`)

  // Carga el perfil de la BD
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Carga los pedidos de la BD
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <CuentaDashboard user={user} profile={profile} orders={orders ?? []} />
    </main>
  )
}