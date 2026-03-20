import type { CategoryItem } from '@/types/home'
import CategoryPill from '@/components/home/CategoryPill'

type CategoryScrollerProps = {
  items: CategoryItem[]
}

export default function CategoryScroller({ items }: CategoryScrollerProps) {
  return (
    <section className="py-14 bg-[var(--color-surface)] border-b border-[var(--color-outline-var)]/20" aria-label="Categorías">
      <div className="px-6 max-w-7xl mx-auto">
        <p className="section-label mb-6 text-center">Categorías</p>
        <div className="flex overflow-x-auto no-scrollbar gap-5 pb-3 items-start justify-start md:justify-center">
          {items.map((item) => (
            <CategoryPill key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}