// app/catalogo/page.tsx

import CatalogoContent from './CatalogoContent'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'  // ← añade esta línea

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fff8f6] flex items-center justify-center">
        <p className="font-headline italic text-[#717a6f] text-xl">Cargando...</p>
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  )
}