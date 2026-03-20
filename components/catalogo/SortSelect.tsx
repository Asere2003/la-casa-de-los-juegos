import Link from 'next/link'
import { buildQueryString } from '@/lib/queryParams'

type SortSelectProps = Readonly<{
  currentSort?: string
}>

const sortOptions = [
  { label: 'Más relevantes', value: 'relevant' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Nombre A-Z', value: 'name-asc' },
]

export default function SortSelect({ currentSort }: SortSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sortOptions.map((option) => {
        const active = currentSort === option.value

        return (
          <Link
            key={option.value}
            href={buildQueryString(
              { sort: currentSort },
              { sort: option.value }
            )}
            className={[
              'px-4 py-3 text-sm border transition-all',
              active
                ? 'bg-(--color-primary) text-white border-(--color-primary)'
                : 'bg-white text-(--color-on-surface) border-(--color-outline-var)/50 hover:border-(--color-primary)',
            ].join(' ')}
            style={{ borderRadius: '2px' }}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}