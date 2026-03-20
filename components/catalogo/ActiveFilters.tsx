import type { CatalogSearchParams } from '@/types/catalog'
import Link from 'next/link'
import { buildQueryString } from '@/lib/queryParams'

type ActiveFiltersProps = {
  searchParams: CatalogSearchParams
}

export default function ActiveFilters({ searchParams }: ActiveFiltersProps) {
  const hasFilters = Boolean(searchParams.category || searchParams.age)

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {searchParams.category ? (
        <Link
          href={buildQueryString(searchParams, { category: null })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-mono uppercase tracking-wide"
          style={{ borderRadius: '999px' }}
        >
          {searchParams.category}
          <span aria-hidden="true">×</span>
        </Link>
      ) : null}

      {searchParams.age ? (
        <Link
          href={buildQueryString(searchParams, { age: null })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white text-xs font-mono uppercase tracking-wide"
          style={{ borderRadius: '999px' }}
        >
          {searchParams.age}
          <span aria-hidden="true">×</span>
        </Link>
      ) : null}

      <Link
        href="/catalogo"
        className="inline-flex items-center px-4 py-2 border border-[var(--color-outline-var)]/60 text-[var(--color-on-surface)] text-xs font-mono uppercase tracking-wide hover:border-[var(--color-primary)]"
        style={{ borderRadius: '999px' }}
      >
        Limpiar todo
      </Link>
    </div>
  )
}