import ProductoForm from '@/components/admin/ProductoForm'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function NuevoProductoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
            Nuevo producto
          </h1>
        </div>
        <ProductoForm categories={categories ?? []} locale={locale} />
      </div>
    </main>
  )
}