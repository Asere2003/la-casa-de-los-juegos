import type { Category } from '@/types/index'
import CategoryPill from '@/components/home/CategoryPill'
import { getTranslations } from 'next-intl/server'

type CategoryScrollerProps = {
  items: Category[]
}

export default async function CategoryScroller({ items }: CategoryScrollerProps) {
  const tCat      = await getTranslations('categories')
  const tCatalogue = await getTranslations('catalogue')

  return (
    <section className="py-14 bg-[var(--color-surface)] border-b border-[var(--color-outline-var)]/20" aria-label={tCatalogue('category')}>
      <div className="px-6 max-w-7xl mx-auto">
        <p className="section-label mb-6 text-center">{tCatalogue('category')}</p>
        <div className="flex overflow-x-auto no-scrollbar gap-5 pb-3 items-start justify-start md:justify-center">
          {items.map(item => (
            <CategoryPill
              key={item.slug}
              item={item}
              label={tCat(item.key as any)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}