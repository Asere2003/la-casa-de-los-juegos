'use client'

import type { Product } from '@/types'
import { useTranslations } from 'next-intl'

interface Props {
  product: Product
}

const DIFFICULTY_KEY: Record<string, string> = {
  familiar: 'difficulty_family',
  medio:    'difficulty_medium',
  avanzado: 'difficulty_advanced',
  experto:  'difficulty_expert',
}

export default function ProductBadges({ product }: Props) {
  const t = useTranslations('product')
  const tCat = useTranslations('catalogue')

  const badges = [
    product.min_players && product.max_players && {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      label: t('players'),
      value: product.min_players === product.max_players
        ? `${product.min_players}`
        : `${product.min_players}–${product.max_players}`,
    },
    product.duration_min && {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      label: t('duration'),
      value: product.duration_min < 60
        ? `${product.duration_min} min`
        : `${Math.round(product.duration_min / 60)}h`,
    },
    product.difficulty && {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
        </svg>
      ),
      label: t('difficulty'),
      value: DIFFICULTY_KEY[product.difficulty] ? tCat(DIFFICULTY_KEY[product.difficulty]) : product.difficulty,
    },
    product.min_age && {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      label: t('age'),
      value: t('age_value', { age: product.min_age }),
    },
    product.material && {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      label: t('material'),
      value: product.material,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[]

  if (badges.length === 0) return null

  return (
    <div
      className="grid grid-cols-2 gap-px bg-[#c0c9bc]/20 border border-[#c0c9bc]/20 overflow-hidden"
      style={{ borderRadius: '2px' }}
      role="list"
      aria-label={t('features')}
    >
      {badges.map((badge, i) => (
        <div
          key={badge.label}
          role="listitem"
          className={`bg-[#fff1ec] p-4 flex flex-col items-center gap-1.5 text-center${badges.length % 2 !== 0 && i === badges.length - 1 ? ' col-span-2' : ''}`}
        >
          <span className="text-[#004317]">{badge.icon}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#717a6f]">{badge.label}</span>
          <span className="font-headline italic text-sm text-[#2a170f]">{badge.value}</span>
        </div>
      ))}
    </div>
  )
}
