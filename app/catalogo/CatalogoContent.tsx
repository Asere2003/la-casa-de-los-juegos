'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import ActiveFilters from '@/components/catalogo/ActiveFilters'
import CatalogHeader from '@/components/catalogo/CatalogHeader'
import FilterSidebar from '@/components/catalogo/FilterSidebar'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import ProductGrid from '@/components/catalogo/ProductGrid'
import SortSelect from '@/components/catalogo/SortSelect'

export interface CatalogFilters {
  category:   string
  minPrice:   number
  maxPrice:   number
  difficulty: string
  players:    string
  search:     string
  sort:       string
}

const DEFAULT_FILTERS: CatalogFilters = {
  category: '', minPrice: 0, maxPrice: 500,
  difficulty: '', players: '', search: '', sort: 'newest',
}

export default function CatalogoContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [filters, setFilters]         = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setFilters({
      category:   searchParams.get('category')   || '',
      minPrice:   Number(searchParams.get('minPrice'))  || 0,
      maxPrice:   Number(searchParams.get('maxPrice'))  || 500,
      difficulty: searchParams.get('difficulty') || '',
      players:    searchParams.get('players')    || '',
      search:     searchParams.get('search')     || '',
      sort:       searchParams.get('sort')        || 'newest',
    })
  }, [searchParams])

  const updateFilters = useCallback((newFilters: Partial<CatalogFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    const params = new URLSearchParams()
    if (updated.category)          params.set('category',   updated.category)
    if (updated.difficulty)        params.set('difficulty', updated.difficulty)
    if (updated.players)           params.set('players',    updated.players)
    if (updated.search)            params.set('search',     updated.search)
    if (updated.sort !== 'newest') params.set('sort',       updated.sort)
    if (updated.minPrice > 0)      params.set('minPrice',   String(updated.minPrice))
    if (updated.maxPrice < 500)    params.set('maxPrice',   String(updated.maxPrice))
    router.push(`/catalogo?${params.toString()}`, { scroll: false })
  }, [filters, router])

  const clearFilter = (key: keyof CatalogFilters) => updateFilters({ [key]: DEFAULT_FILTERS[key] })
  const clearAll    = () => { setFilters(DEFAULT_FILTERS); router.push('/catalogo', { scroll: false }) }

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (filters.category   && p.category?.slug !== filters.category) return false
    if (filters.difficulty && p.difficulty !== filters.difficulty)    return false
    if (filters.minPrice   && p.price < filters.minPrice)            return false
    if (filters.maxPrice   && p.price > filters.maxPrice)            return false
    if (filters.search     && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.players) {
      const n = parseInt(filters.players)
      if (p.min_players && p.max_players && (n < p.min_players || n > p.max_players)) return false
    }
    return true
  }).sort((a, b) => {
    if (filters.sort === 'price_asc')  return a.price - b.price
    if (filters.sort === 'price_desc') return b.price - a.price
    if (filters.sort === 'popular')    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    return 0
  })

  const activeFilterCount = [
    filters.category, filters.difficulty, filters.players, filters.search,
    filters.minPrice > 0 || filters.maxPrice < 500 ? 'price' : '',
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <CatalogHeader
        total={filteredProducts.length}
        search={filters.search}
        onSearch={val => updateFilters({ search: val })}
        filterCount={activeFilterCount}
        onOpenFilters={() => setSidebarOpen(true)}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 flex md:gap-10">
        <FilterSidebar
          filters={filters}
          onChange={updateFilters}
          onClear={clearAll}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <section className="flex-1 min-w-0" aria-label="Resultados del catálogo">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <ActiveFilters filters={filters} onRemove={clearFilter} onClearAll={clearAll} />
            <SortSelect value={filters.sort} onChange={val => updateFilters({ sort: val })} />
          </div>
          <ProductGrid products={filteredProducts} loading={false} />
          {filteredProducts.length > 0 && (
            <div className="mt-14 flex justify-center">
              <button
                className="flex items-center gap-3 border border-[#c0c9bc]/60 text-[#2a170f] font-headline italic px-10 py-4 hover:border-[#004317] hover:text-[#004317] hover:bg-[#fff1ec] transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                style={{ borderRadius: '2px' }}
              >
                Cargar más productos
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true" />
    </div>
  )
}