import Link from 'next/link'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#fff8f6] pt-20 pb-32">
      <div className="max-w-6xl mx-auto px-4">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
            La Casa de los Juegos
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Link
            href={`/${locale}/admin/productos`}
            className="group border border-[#004317]/20 rounded p-6 bg-white hover:border-[#004317] hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">🎲</div>
            <h2 className="font-['Noto_Serif'] text-lg text-[#004317] mb-1">Productos</h2>
            <p className="text-sm text-[#2c1810]/50">Crear, editar y gestionar el catálogo</p>
          </Link>

          <div className="border border-[#2c1810]/10 rounded p-6 bg-white opacity-40 cursor-not-allowed">
            <div className="text-3xl mb-3">📦</div>
            <h2 className="font-['Noto_Serif'] text-lg text-[#2c1810] mb-1">Pedidos</h2>
            <p className="text-sm text-[#2c1810]/50">Próximamente</p>
          </div>

          <div className="border border-[#2c1810]/10 rounded p-6 bg-white opacity-40 cursor-not-allowed">
            <div className="text-3xl mb-3">📊</div>
            <h2 className="font-['Noto_Serif'] text-lg text-[#2c1810] mb-1">Analytics</h2>
            <p className="text-sm text-[#2c1810]/50">Próximamente</p>
          </div>

        </div>
      </div>
    </main>
  )
}