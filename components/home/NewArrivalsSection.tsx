import { Link } from '@/i18n/navigation'
import ProductCard from '@/components/shared/ProductCard'
import type { ProductCardItem } from '@/types/home'
import SectionHeading from '@/components/home/SectionHeading'
import { useTranslations } from 'next-intl'

type NewArrivalsSectionProps = {
  items: ProductCardItem[]
  userId?: string | null
  favoriteIds?: string[]
}

export default function NewArrivalsSection({ items, userId, favoriteIds }: NewArrivalsSectionProps) {
  const t = useTranslations('home')
  return (
    <section id="curiosidades" className="py-10 bg-[var(--color-surface-low)]" aria-labelledby="novedades-title">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <SectionHeading 
          eyebrow={t('new_arrivals_label')}
          title={t('new_arrivals_title')}
          action={
            <Link href="/catalogo" className="hidden md:flex items-center gap-1 font-body italic text-sm text-[var(--color-primary)] hover:gap-3 transition-all border-b border-[var(--color-primary)]/30 pb-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded">
              {t('new_arrivals_link')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              userId={userId}
              isFavorite={favoriteIds?.includes(product.id) ?? false}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/catalogo" className="inline-flex items-center gap-2 font-body italic text-sm text-[var(--color-primary)] border-b border-[var(--color-primary)]/30 pb-0.5">
            {t('new_arrivals_link')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}