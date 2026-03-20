import Link from 'next/link'

interface Props {
  totalItems: number
}

export default function CartHeader({ totalItems }: Props) {
  return (
    <div className="bg-[#fff1ec] border-b border-[#c0c9bc]/20">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-8">

        {/* Breadcrumbs */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs font-body italic text-[#717a6f] mb-5">
          <Link href="/" className="hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
            Inicio
          </Link>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span className="text-[#2a170f] font-semibold">Tu Carrito</span>
        </nav>

        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mb-2">
              {totalItems} {totalItems === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
            </p>
            <h1 className="font-headline text-3xl md:text-4xl text-[#2a170f] italic">
              Tu Colección
            </h1>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:inline-flex items-center gap-1.5 font-body italic text-sm text-[#004317] hover:gap-3 transition-all border-b border-[#004317]/30 pb-0.5 focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
