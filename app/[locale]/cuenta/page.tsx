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
        product_id,
        product_name,
        product_image,
        quantity,
        price,
        subtotal
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Carga favoritos
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      id,
      product_id,
      created_at,
      product:products (
        id, name, slug, price, compare_price, images, badge, stock
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Carga reseñas
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      product:products (id, name, slug, images)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // IDs de productos comprados (para verified_purchase y reseñas)
  const purchasedProductIds = (orders ?? [])
    .filter(o => ['shipped', 'delivered'].includes(o.status))
    .flatMap(o => o.order_items.map((i: { product_id: string }) => i.product_id))

  const reviewedProductIds = (reviews ?? []).map(r => r.product_id)

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <CuentaDashboard
        user={user}
        profile={profile}
        orders={orders ?? []}
        favorites={(favorites ?? []) as any}
        reviews={(reviews ?? []) as any}
        purchasedProductIds={purchasedProductIds}
        reviewedProductIds={reviewedProductIds}
      />
    </main>
  )
}