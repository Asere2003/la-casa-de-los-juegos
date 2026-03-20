import type { CatalogSearchParams } from '@/types/catalog'
import SortSelect from '@/components/catalogo/SortSelect'

type CatalogHeaderProps = {
  searchParams: CatalogSearchParams
}

export default function CatalogHeader({ searchParams }: CatalogHeaderProps) {
  return (
    <section className="border-b border-[var(--color-outline-var)]/20 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <nav
          className="flex items-center gap-2 text-sm italic text-[var(--color-on-surface-var)] mb-5"
          aria-label="Breadcrumb"
        >
          <span>Inicio</span>
          <span>›</span>
          <span className="text-[var(--color-on-surface)] font-semibold">Catálogo</span>
        </nav>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label mb-2">Todo el archivo</p>
            <h1 className="font-headline text-4xl md:text-6xl text-[var(--color-on-surface)]">
              Catálogo de Juegos
            </h1>
          </div>

          <SortSelect currentSort={searchParams.sort} />
        </div>
      </div>
    </section>
  )
}