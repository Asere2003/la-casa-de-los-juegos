import FavoriteButton from '@/components/FavoriteButton'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { ProductCardItem } from '@/types/home'
import SectionHeading from '@/components/home/SectionHeading'
import { formatEuro } from '@/lib/format'
import { useTranslations } from 'next-intl'

type BestsellersSectionProps = {
  items: ProductCardItem[]
  userId?: string | null
  favoriteIds?: string[]
}

export default function BestsellersSection({ items, userId, favoriteIds }: BestsellersSectionProps) {
  const t = useTranslations('home')

  return (
    <section
      id="favoritos"
      className="bg-[var(--color-surface-low)] pt-12 md:pt-16"
      aria-labelledby="bestsellers-title"
    >
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <SectionHeading eyebrow={t('bestsellers_label')} title={t('bestsellers_title')} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-start">
          {items.map((product) => (
            <article key={product.id} className="group cursor-pointer">

              {/* Imagen con grayscale → color en hover */}
              <Link
                href={`/producto/${product.slug}`}
                className="block relative aspect-[3/4] overflow-hidden mb-5 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-4 bg-[white] grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/20 to-transparent pointer-events-none" aria-hidden="true" />

                {/* Botón favorito — solo silueta, sin fondo */}
                <div className="absolute top-3 right-3">
                  <FavoriteButton
                    productId={product.id}
                    userId={userId ?? null}
                    initialIsFavorite={favoriteIds?.includes(product.id) ?? false}
                    size="sm"
                    variant="ghost"
                  />
                </div>

                {/* Tag badge */}
                {product.tag && (
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tight"
                      style={{ background: product.tagBg ?? '#c9a84c', borderRadius: '2px' }}
                    >
                      {product.tag}
                    </span>
                  </div>
                )}
              </Link>

              {/* Categoría con borde dorado izquierdo */}
              {product.category && (
                <div className="bg-[#c9a84c]/10 w-fit px-3 py-1 mb-3 border-l-2 border-[#c9a84c]">
                  <span className="font-body italic text-sm text-[#2c1810]/70">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Nombre */}
              <Link href={`/producto/${product.slug}`}>
                <h3 className="font-headline italic text-lg text-[#2a170f] group-hover:text-[#004317] transition-colors leading-snug mb-1">
                  <span className="border-l-2 border-[#c9a84c] bg-[#2c1810]/5 pl-3 pr-2 py-0.5 rounded-sm">
                    {product.name}
                  </span>
                </h3>
              </Link>

              {/* Precio */}
              <p className="font-mono text-md text-[#717a6f] mt-1">
                {formatEuro(product.price)}
              </p>

            </article>
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