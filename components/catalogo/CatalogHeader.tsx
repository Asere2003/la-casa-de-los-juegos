'use client'

import { useEffect, useRef } from 'react'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface Props {
  total: number
  search: string
  onSearch: (val: string) => void
  filterCount: number
  onOpenFilters: () => void
}

export default function CatalogHeader({ total, search, onSearch, filterCount, onOpenFilters }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('catalogue')
  const tNav = useTranslations('nav')
  const tA11y = useTranslations('accessibility')

  return (
    <div className="border-b border-[#c0c9bc]/20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">

        {/* Breadcrumbs */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs font-body italic text-[#717a6f] mb-5">
          <Link href="/" className="hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded">
            {tNav('home')}
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span className="text-[#2a170f] font-semibold">{tNav('catalogue')}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="font-mono text-[9px] section-label uppercase tracking-[0.22em] text-[#805533] mb-2 mt-2">{t('label')}</p>
            <h1 className="text-2xl text-primary font-bold font-headline md:text-4xl ">{t('title')}</h1>
          </div>

          {/* Búsqueda + botón filtros móvil */}
          <div className="flex items-center gap-3">

            {/* Buscador */}
            <div className="relative flex-1 md:w-64">
              <label htmlFor="catalog-search" className="sr-only">{tA11y('search')}</label>
              <input
                ref={inputRef}
                id="catalog-search"
                type="search"
                value={search}
                onChange={e => onSearch(e.target.value)}
                placeholder={tNav('search') + '...'}
                className="w-full bg-white border border-[#c0c9bc]/50 text-[#2a170f] font-body italic text-sm px-4 py-2.5 pr-10 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-colors"
                style={{ borderRadius: '2px' }}
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717a6f]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            {/* Botón filtros — solo móvil */}
            <button
              onClick={onOpenFilters}
              aria-label={`Abrir filtros${filterCount > 0 ? `, ${filterCount} activos` : ''}`}
              className="md:hidden relative flex items-center gap-2 bg-[#004317] text-white font-mono text-xs uppercase tracking-wide px-4 py-2.5 hover:bg-[#1a5c2a] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              {t('filters')}
              {filterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#c9a84c] text-[#2c1810] text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        <p className="font-mono text-[10px] uppercase tracking-wide text-[#717a6f] mt-4" aria-live="polite" aria-atomic="true" >
          {t('found', { count: total })}
        </p>
      </div>
    </div>
  )
}
