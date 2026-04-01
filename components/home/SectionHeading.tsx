import { Link } from '@/i18n/navigation'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  centered?: boolean
  action?: ReactNode
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  centered = false,
  action,
  className = '',
}: SectionHeadingProps) {
  const t = useTranslations('home')
  return (
    <div
      className={[
        'flex gap-6 mb-10 md:mb-12',
        centered ? 'flex-col items-center text-center' : 'items-end justify-between',
        className,
      ].join(' ')}
    >
      <div>
        {eyebrow ? <p className="section-label mb-2">{eyebrow}</p> : null}
        <h2 className="font-headline text-2xl text-primary font-bold">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
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

  )
}