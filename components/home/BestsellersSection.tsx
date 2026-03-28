import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { ProductCardItem } from '@/types/home'
import SectionHeading from '@/components/home/SectionHeading'
import { formatEuro } from '@/lib/format'
import { useTranslations } from 'next-intl'

type BestsellersSectionProps = {
  items: ProductCardItem[]
}

export default function BestsellersSection({ items }: BestsellersSectionProps) {
  const t = useTranslations('home')
  return (
    <section id="favoritos" className="py-20 bg-[var(--color-surface)]" aria-labelledby="bestsellers-title">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <SectionHeading eyebrow={t('bestsellers_label')} title={t('bestsellers_title')} centered />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end">
          {items.map((product) => (
            <article
              key={product.id}
              className={`group overflow-hidden transition-all duration-500 ${
                product.featured
                  ? 'bg-[var(--color-primary-container)] shadow-[0_20px_50px_rgba(0,67,23,0.4)] md:-translate-y-3 md:scale-105 z-10 relative hover:md:-translate-y-5'
                  : 'bg-[var(--color-surface-low)] shadow-warm hover:shadow-warm-lg hover:-translate-y-1'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <Link href={`/producto/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover group-hover:scale-105 transition-transform duration-700 ${product.featured ? 'opacity-90' : ''}`}
                />
                {product.tag ? (
                  <span className="absolute top-3 left-3 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight" style={{ background: product.tagBg, borderRadius: '2px' }}>
                    {product.tag}
                  </span>
                ) : null}
              </Link>

              <div className="p-4 md:p-5">
                <Link
                  href={`/producto/${product.slug}`}
                  className={`font-headline italic text-lg mb-1 block hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded ${
                    product.featured ? 'text-[var(--color-gold)]' : 'text-[var(--color-on-surface)]'
                  }`}
                >
                  {product.name}
                </Link>
                <p className={`font-body italic text-sm mb-4 ${product.featured ? 'text-white/60' : 'text-[var(--color-on-surface-var)]'}`}>
                  {product.description}
                </p>
                <div className={`flex justify-between items-center border-t pt-4 ${product.featured ? 'border-[var(--color-gold)]/20' : 'border-[var(--color-outline-var)]/20'}`}>
                  <span className={`font-mono font-bold ${product.featured ? 'text-white' : 'text-[var(--color-on-surface)]'}`}>
                    {formatEuro(product.price)}
                  </span>
                  {product.featured ? (
                    <Link href={`/producto/${product.slug}`} className="bg-[var(--color-gold)] text-[var(--color-wood-dark)] px-4 py-2 font-headline text-xs font-bold hover:rotate-[-1deg] transition-transform focus-visible:ring-2 focus-visible:ring-white" style={{ borderRadius: '2px' }}>
                      Lo quiero
                    </Link>
                  ) : (
                    <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`} className="text-[var(--color-primary)] hover:scale-110 transition-transform focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8M8 12h8" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}