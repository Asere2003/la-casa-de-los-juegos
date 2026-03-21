'use client'

import { useTranslations } from 'next-intl'

interface Props {
  value: string
  onChange: (val: string) => void
}

const SORT_KEYS = ['newest', 'popular', 'price_asc', 'price_desc'] as const

export default function SortSelect({ value, onChange }: Props) {
  const t = useTranslations('catalogue')

  return (
    <div className="relative shrink-0">
      <label htmlFor="sort-select" className="sr-only">{t('sort')}</label>
      <select
        id="sort-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-white border border-[#c0c9bc]/50 text-[#2a170f] font-body italic text-sm pl-4 pr-9 py-2.5 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] cursor-pointer transition-colors"
        style={{ borderRadius: '2px' }}
      >
        {SORT_KEYS.map(key => (
          <option key={key} value={key}>{t(`sort_${key}`)}</option>
        ))}
      </select>
    </div>
  )
}
