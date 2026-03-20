import CatalogoContent from './CatalogoContent'
import { Suspense } from 'react'

interface Props {
  searchParams: Promise<{
    category?: string
    difficulty?: string
    players?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fff8f6] flex items-center justify-center">
        <p className="font-headline italic text-[#717a6f] text-xl">Cargando...</p>
      </div>
    }>
      <CatalogoContent initialSearchParams={params} />
    </Suspense>
  )
}