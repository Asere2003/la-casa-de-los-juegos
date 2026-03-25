import Link from 'next/link'
import ProductosTable from '@/components/admin/ProductosTable'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminProductosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: products, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">

        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
              Panel de administración
            </p>
            <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
              Productos
            </h1>
          </div>
          <Link
            href={`/${locale}/admin/productos/nuevo`}
            className="btn-primary px-5 py-2 text-sm"
          >
            + Nuevo producto
          </Link>
        </div>

        {/* Tabla */}
        <ProductosTable
          products={products ?? []}
          locale={locale}
        />

      </div>
    </main>
  )
}