// app/[locale]/galeria/page.tsx
// Página pública de la galería — Server Component

import { GalleryGrid } from '@/components/galeria/GalleryGrid'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Galería | La Casa de los Juegos',
    description: 'Descubre nuestra tienda de juegos de mesa en Granada. Fotos de la tienda, productos y eventos.',
    openGraph: {
      title: 'Galería — La Casa de los Juegos',
      description: 'Imágenes de nuestra tienda física en Granada y nuestros productos.',
      type: 'website',
    },
  }
}

export default async function GaleriaPage() {
  return (
    <main className="min-h-screen bg-[#fff8f6]">

      {/* ── Cabecera ─────────────────────────────────────── */}
      <div className="border-b border-[#c0c9bc]/20">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">

          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs font-body italic text-[#717a6f] mb-5">
            <Link href="/" className="hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
              Inicio
            </Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span className="text-[#2a170f] font-semibold">Galería</span>
          </nav>

          <div>
            <p className="font-mono text-[9px] section-label uppercase tracking-[0.22em] text-[#805533] mb-2 mt-2">
              La Casa de los Juegos · Granada
            </p>
            <h1 className="text-2xl text-primary font-bold font-headline md:text-4xl">
              Nuestra galería
            </h1>
            <p className="font-body italic text-sm text-[#717a6f] mt-2 max-w-lg leading-relaxed">
              Un vistazo a la tienda, los juegos y los momentos que hacen especial este rincón lúdico de Granada.
            </p>
          </div>
        </div>
      </div>

      {/* ── Galería ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 pb-24">
        <GalleryGrid />
      </div>

    </main>
  )
}
