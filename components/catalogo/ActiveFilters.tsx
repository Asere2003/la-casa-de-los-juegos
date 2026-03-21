'use client'

import type { CatalogFilters } from '@/types/catalog'
import { useTranslations } from 'next-intl'

const CATEGORY_EMOJI: Record<string, string> = {
  ajedrez: '♟', puzzles: '🧩', 'juegos-mesa': '🎲', rol: '🐉',
  clasicos: '🎭', 'del-mundo': '🌍', cartas: '🃏', habilidad: '🪀',
}

const CATEGORY_KEY: Record<string, string> = {
  ajedrez: 'chess', puzzles: 'puzzles', 'juegos-mesa': 'boardgames', rol: 'rpg',
  clasicos: 'classics', 'del-mundo': 'world', cartas: 'cards', habilidad: 'skill',
}

const DIFFICULTY_KEY: Record<string, string> = {
  familiar: 'difficulty_family', medio: 'difficulty_medium',
  avanzado: 'difficulty_advanced', experto: 'difficulty_expert',
}

interface Props {
  filters: CatalogFilters
  onRemove: (key: keyof CatalogFilters) => void
  onClearAll: () => void
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: Props) {
  const t = useTranslations('catalogue')
  const tCat = useTranslations('categories')

  function getLabel(key: keyof CatalogFilters, value: string | number): string {
    if (key === 'category') {
      const emoji = CATEGORY_EMOJI[value] || ''
      const catKey = CATEGORY_KEY[value]
      return catKey ? `${emoji} ${tCat(catKey)}` : String(value)
    }
    if (key === 'difficulty') {
      const dKey = DIFFICULTY_KEY[value]
      return dKey ? t(dKey) : String(value)
    }
    if (key === 'players') return t(`players_${value}`)
    if (key === 'maxPrice') return t('price_up_to', { price: value })
    if (key === 'search') return `"${value}"`
    return String(value)
  }

  const pills: { key: keyof CatalogFilters; label: string }[] = []

  if (filters.category)   pills.push({ key: 'category',   label: getLabel('category', filters.category) })
  if (filters.difficulty) pills.push({ key: 'difficulty', label: getLabel('difficulty', filters.difficulty) })
  if (filters.players)    pills.push({ key: 'players',    label: getLabel('players', filters.players) })
  if (filters.search)     pills.push({ key: 'search',     label: getLabel('search', filters.search) })
  if (filters.maxPrice < 500) pills.push({ key: 'maxPrice', label: getLabel('maxPrice', filters.maxPrice) })

  if (pills.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label={t('active_filters')}>
      {pills.map(pill => (
        <span
          key={pill.key}
          role="listitem"
          className="inline-flex items-center gap-1.5 bg-[#1a5c2a] text-white font-mono text-[9px] uppercase tracking-wide px-3 py-1.5"
          style={{ borderRadius: '99px' }}
        >
          {pill.label}
          <button
            onClick={() => onRemove(pill.key)}
            aria-label={t('remove_filter', { label: pill.label })}
            className="hover:text-[#c9a84c] transition-colors focus-visible:ring-1 focus-visible:ring-[#c9a84c] rounded-full ml-0.5"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </span>
      ))}

      {pills.length > 1 && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 bg-[#fff8f6] text-[#2a170f] border border-[#c0c9bc]/50 font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 hover:border-[#c9a84c] hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          style={{ borderRadius: '99px' }}
        >
          {t('clear_all')}
        </button>
      )}
    </div>
  )
}
