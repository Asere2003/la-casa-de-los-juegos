import { Link } from '@/i18n/navigation'
import ProductCard from '@/components/shared/ProductCard'
import type { ProductCardItem } from '@/types/home'
import { useTranslations } from 'next-intl'

type NewArrivalsSectionProps = {
  items: ProductCardItem[]
  userId?: string | null
  favoriteIds?: string[]
}

export default function NewArrivalsSection({ items, userId, favoriteIds }: NewArrivalsSectionProps) {
  const t = useTranslations('home')

  return (
    <section id="curiosidades" className="py-12 md:py-16 bg-[var(--color-surface-low)]" aria-labelledby="novedades-title">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">

        {/* Cabecera */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">
              {t('new_arrivals_label')}
            </p>
            <h2
              id="novedades-title"
              className="font-headline text-2xl text-primary font-bold"
            >
              {t('new_arrivals_title')}
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:flex items-center gap-1.5 font-body italic text-sm text-[#2A170F]/60 hover:text-[#004D26] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded pb-0.5"
          >
            {t('new_arrivals_link')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              userId={userId}
              isFavorite={favoriteIds?.includes(product.id) ?? false}
            />
          ))}
        </div>

        {/* Ver más — solo móvil */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 font-body italic text-sm text-[#004D26] border-b border-[#004D26]/30 pb-0.5"
          >
            {t('new_arrivals_link')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}