// app/catalogo/page.tsx — Server Component

import CatalogoContent from './CatalogoContent'
import { Suspense } from 'react'

interface Props {
  searchParams: {
    category?: string
    difficulty?: string
    players?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default function CatalogoPage({ searchParams }: Props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fff8f6] flex items-center justify-center">
        <p className="font-headline italic text-[#717a6f] text-xl">Cargando...</p>
      </div>
    }>
      <CatalogoContent initialSearchParams={searchParams} />
    </Suspense>
  )
}