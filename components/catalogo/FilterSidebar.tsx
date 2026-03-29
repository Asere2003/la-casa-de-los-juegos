'use client'

import { useEffect, useRef, useState } from 'react'

import type { CatalogFilters } from '@/types/catalog'
import { getCategories } from '@/lib/supabase/queries'
import { useTranslations } from 'next-intl'

const DIFFICULTIES = [
  { value: 'familiar', key: 'difficulty_family' as const },
  { value: 'medio',    key: 'difficulty_medium' as const },
  { value: 'avanzado', key: 'difficulty_advanced' as const },
  { value: 'experto',  key: 'difficulty_expert' as const },
]

const PLAYERS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '4', label: '2–4' },
  { value: '6', label: '4–8' },
]

interface Props {
  filters: CatalogFilters
  onChange: (f: Partial<CatalogFilters>) => void
  onClear: () => void
  isOpen: boolean
  onClose: () => void
}

export default function FilterSidebar({ filters, onChange, onClear, isOpen, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('catalogue')
  const tCat = useTranslations('categories')
  const tA11y = useTranslations('accessibility')

  const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([])

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Bloquear scroll cuando sheet abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const FilterContent = () => (
    <div className="space-y-0">

      {/* Limpiar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline text-lg text-[#2a170f] flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          {t('filters')}
        </h2>
        <button onClick={onClear}
          className="font-mono text-[9px] uppercase tracking-wide text-[#717a6f] hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
          {t('clear')}
        </button>
      </div>

      {/* ── Categoría ── */}
      <FilterSection title={t('category')}>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat.slug}
                onChange={e => onChange({ category: e.target.checked ? cat.slug : '' })}
                className="w-4 h-4 rounded-sm border-[#c0c9bc] text-[#004317] focus:ring-[#c9a84c] cursor-pointer"
                aria-label={tCat(cat.key as any)}
              />
              <span className="flex-1 text-sm font-body group-hover:text-[#004317] transition-colors">
                <span aria-hidden="true">{cat.emoji}</span>{' '}
                {tCat(cat.key as any)}
              </span>
              <span className="font-mono text-[9px] text-[#717a6f]">{cat.product_count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── Precio ── */}
      <FilterSection title={t('price')}>
        <div>
          <input
            type="range"
            min={0} max={500} step={5}
            value={filters.maxPrice}
            onChange={e => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-[#c9a84c] cursor-pointer"
            aria-label={`${t('price')}: ${filters.maxPrice}€`}
          />
          <div className="flex justify-between font-mono text-[10px] text-[#717a6f] mt-1.5">
            <span>0€</span>
            <span className="font-bold text-[#004317]">{filters.maxPrice}€</span>
          </div>
        </div>
      </FilterSection>

      {/* ── Dificultad ── */}
      <FilterSection title={t('difficulty')}>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('difficulty')}>
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              onClick={() => onChange({ difficulty: filters.difficulty === d.value ? '' : d.value })}
              aria-pressed={filters.difficulty === d.value}
              className={`font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                filters.difficulty === d.value
                  ? 'bg-[#004317] text-white'
                  : 'border border-[#c0c9bc]/60 text-[#2a170f] hover:border-[#004317] hover:text-[#004317]'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {t(d.key)}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── Jugadores ── */}
      <FilterSection title={t('players')}>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('players')}>
          {PLAYERS.map(p => (
            <button
              key={p.value}
              onClick={() => onChange({ players: filters.players === p.value ? '' : p.value })}
              aria-pressed={filters.players === p.value}
              className={`font-mono text-[9px] px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                filters.players === p.value
                  ? 'bg-[#c9a84c] text-[#2c1810] font-bold'
                  : 'border border-[#c0c9bc]/60 text-[#2a170f] hover:border-[#004317] hover:text-[#004317]'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* ── Sidebar desktop ── */}
      <aside className="hidden md:block w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"
        aria-label={t('filters')}>
        <FilterContent/>
      </aside>

      {/* ── Sheet móvil ── */}
      <div aria-hidden={!isOpen}>
        {/* Overlay */}
        <div
          aria-hidden="true"
          onClick={onClose}
          className={`fixed inset-0 z-[59] bg-[#2a170f]/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('filters')}
          className={`fixed inset-x-0 bottom-0 z-[60] bg-[#fff8f6] rounded-t-2xl shadow-2xl transition-transform duration-400 max-h-[85dvh] overflow-y-auto ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {/* Handle */}
          <div className="sticky top-0 bg-[#fff8f6] border-b border-[#c0c9bc]/20 px-5 py-4 flex items-center justify-between z-10">
            <h2 className="font-headline text-lg text-[#2a170f]">{t('filters')}</h2>
            <button onClick={onClose} aria-label={tA11y('close_menu')}
              className="text-[#717a6f] hover:text-[#2a170f] p-1 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="px-5 py-4">
            <FilterContent/>
          </div>
          <div className="sticky bottom-0 bg-[#fff8f6] border-t border-[#c0c9bc]/20 px-5 py-4">
            <button onClick={onClose}
              className="w-full bg-[#004317] text-white font-headline font-bold py-4 hover:bg-[#1a5c2a] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}>
              {t('view_results')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Subcomponente sección colapsable
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-[#c0c9bc]/25 py-4" open>
      <summary className="flex items-center justify-between cursor-pointer font-headline text-sm text-[#004317] hover:text-[#1a5c2a] transition-colors list-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
        {title}
        <svg className="transition-transform group-open:rotate-180" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </summary>
      <div className="mt-3">
        {children}
      </div>
    </details>
  )
}