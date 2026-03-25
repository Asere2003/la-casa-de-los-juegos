import ProductoForm from '@/components/admin/ProductoForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, category:categories(*)').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
            Editar producto
          </h1>
          <p className="text-[#2c1810]/50 mt-1">{product.name}</p>
        </div>
        <ProductoForm product={product} categories={categories ?? []} locale={locale} />
      </div>
    </main>
  )
}