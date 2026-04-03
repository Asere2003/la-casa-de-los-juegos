import type { AudienceGroupItem } from '@/types/home'
import { Link } from '@/i18n/navigation'
import SectionHeading from '@/components/home/SectionHeading'
import { useTranslations } from 'next-intl'

type AudienceGridProps = {
  items: AudienceGroupItem[]
}

export default function AudienceGrid({ items }: AudienceGridProps) {
  const t = useTranslations('home')
  return (
    <section className="py-12 md:py-16 bg-[var(--color-surface-low)]" aria-labelledby="ages-title">
      {/* Logo SVG */}
      <img
        src="/images/icons/logo_new.svg"
        alt="Logo La Casa de los Juegos"
        className="h-12 md:h-14 w-auto object-contain flex-shrink-0 flex items-center justify-center mx-auto"
      />
      <div className="px-6 max-w-7xl mx-auto">
        <SectionHeading eyebrow={t('ages_label')} title={t('ages_title')} centered className="mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((group) => (
            <Link
              key={group.label}
              href={`/catalogo?age=${group.label.toLowerCase()}`}
              className="group bg-white p-6 md:p-8 flex flex-col items-center text-center shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
              style={{ borderRadius: '2px', borderTop: `4px solid ${group.borderColor}` }}
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                {group.emoji}
              </span>
              <h3 className="font-headline italic text-lg text-[var(--color-on-surface)]">{group.label}</h3>
              <p className="font-mono text-[9px] text-[var(--color-outline)] mt-1.5 uppercase tracking-wider">{group.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}