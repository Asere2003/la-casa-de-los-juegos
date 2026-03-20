import type { CatalogSearchParams } from '@/types/catalog'
import Link from 'next/link'
import { buildQueryString } from '@/lib/queryParams'

type FilterSidebarProps = {
  searchParams: CatalogSearchParams
}

const categories = [
  { label: 'Ajedrez', value: 'ajedrez' },
  { label: 'Puzzles', value: 'puzzles' },
  { label: 'Juegos de Mesa', value: 'juegos-mesa' },
  { label: 'Rol', value: 'rol' },
  { label: 'Clásicos', value: 'clasicos' },
  { label: 'Cartas', value: 'cartas' },
]

const ages = [
  { label: 'Niños', value: 'ninos' },
  { label: 'Familia', value: 'familia' },
  { label: 'Adultos', value: 'adultos' },
  { label: 'Expertos', value: 'expertos' },
]

export default function FilterSidebar({ searchParams }: FilterSidebarProps) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 bg-[var(--color-surface)] p-6 shadow-warm" style={{ borderRadius: '2px' }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-2xl text-[var(--color-on-surface)]">Filtros</h2>
          <Link
            href="/catalogo"
            className="text-xs font-mono uppercase tracking-wide text-[var(--color-primary)]"
          >
            Limpiar
          </Link>
        </div>

        <div className="mb-8">
          <h3 className="font-headline italic text-lg mb-4 text-[var(--color-primary)]">Categoría</h3>
          <div className="space-y-2">
            {categories.map((item) => {
              const active = searchParams.category === item.value

              return (
                <Link
                  key={item.value}
                  href={buildQueryString(searchParams, {
                    category: active ? null : item.value,
                  })}
                  className={[
                    'flex items-center justify-between px-3 py-2 border transition-colors',
                    active
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white text-[var(--color-on-surface)] border-[var(--color-outline-var)]/40 hover:border-[var(--color-primary)]',
                  ].join(' ')}
                  style={{ borderRadius: '2px' }}
                >
                  <span>{item.label}</span>
                  {active ? <span>✓</span> : null}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-headline italic text-lg mb-4 text-[var(--color-primary)]">Edad / momento</h3>
          <div className="space-y-2">
            {ages.map((item) => {
              const active = searchParams.age === item.value

              return (
                <Link
                  key={item.value}
                  href={buildQueryString(searchParams, {
                    age: active ? null : item.value,
                  })}
                  className={[
                    'flex items-center justify-between px-3 py-2 border transition-colors',
                    active
                      ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]'
                      : 'bg-white text-[var(--color-on-surface)] border-[var(--color-outline-var)]/40 hover:border-[var(--color-secondary)]',
                  ].join(' ')}
                  style={{ borderRadius: '2px' }}
                >
                  <span>{item.label}</span>
                  {active ? <span>✓</span> : null}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}