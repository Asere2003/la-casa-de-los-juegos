'use client'

import type { CatalogFilters } from '@/app/catalogo/page'

interface Props {
  filters: CatalogFilters
  onRemove: (key: keyof CatalogFilters) => void
  onClearAll: () => void
}

const LABELS: Record<string, string> = {
  ajedrez:     '♟ Ajedrez',
  puzzles:     '🧩 Puzzles',
  'juegos-mesa':'🎲 Juegos de Mesa',
  rol:         '🐉 Rol',
  clasicos:    '🎭 Clásicos',
  'del-mundo': '🌍 Del Mundo',
  cartas:      '🃏 Cartas',
  habilidad:   '🪀 Habilidad',
  familiar:    'Familiar',
  medio:       'Medio',
  avanzado:    'Avanzado',
  experto:     'Experto',
  '1': '1 jugador',
  '2': '2 jugadores',
  '4': '2–4 jugadores',
  '6': '4–8 jugadores',
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: Props) {
  const pills: { key: keyof CatalogFilters; label: string }[] = []

  if (filters.category)   pills.push({ key: 'category',   label: LABELS[filters.category]   || filters.category })
  if (filters.difficulty) pills.push({ key: 'difficulty', label: LABELS[filters.difficulty] || filters.difficulty })
  if (filters.players)    pills.push({ key: 'players',    label: LABELS[filters.players]    || filters.players })
  if (filters.search)     pills.push({ key: 'search',     label: `"${filters.search}"` })
  if (filters.maxPrice < 500) pills.push({ key: 'maxPrice', label: `Hasta ${filters.maxPrice}€` })

  if (pills.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Filtros activos">
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
            aria-label={`Quitar filtro ${pill.label}`}
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
          Limpiar todo
        </button>
      )}
    </div>
  )
}
