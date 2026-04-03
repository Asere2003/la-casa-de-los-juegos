import UsuariosAdminTable from '@/components/admin/UsuariosAdminTable'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminUsuariosPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect(`/${locale}`)

  // ← Cliente de servicio que salta RLS
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: usuarios } = await supabaseAdmin
    .from('profiles')
    .select(`
      id,
      nombre,
      telefono,
      ciudad,
      pais,
      role,
      created_at
    `)
    .order('created_at', { ascending: false })

  const { data: pedidosStats } = await supabaseAdmin
    .from('orders')
    .select('user_id, status, total')

  const statsByUser = (pedidosStats ?? []).reduce((acc, o) => {
    if (!acc[o.user_id]) acc[o.user_id] = { total_orders: 0, total_spent: 0 }
    acc[o.user_id].total_orders++
    acc[o.user_id].total_spent += o.total
    return acc
  }, {} as Record<string, { total_orders: number; total_spent: number }>)

  // ← Emails desde auth.users
  const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers()
  const emailsByUser = (authUsers ?? []).reduce((acc, u) => {
    acc[u.id] = u.email ?? ''
    return acc
  }, {} as Record<string, string>)

  const usuariosConStats = (usuarios ?? []).map(u => ({
    ...u,
    email: emailsByUser[u.id] ?? '',
    total_orders: statsByUser[u.id]?.total_orders ?? 0,
    total_spent: statsByUser[u.id]?.total_spent ?? 0,
  }))

  return (
    <main className="min-h-screen bg-[#fff8f6] pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-headline text-3xl text-[#004317]">Usuarios</h1>
          <p className="text-sm text-[#2c1810]/60 mt-2">
            {usuariosConStats.length} usuarios registrados
          </p>
        </div>
        <UsuariosAdminTable usuarios={usuariosConStats} />
      </div>
    </main>
  )
}