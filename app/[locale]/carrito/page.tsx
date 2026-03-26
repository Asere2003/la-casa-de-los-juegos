'use client'

import { useEffect, useState } from 'react'

import CartEmpty from '@/components/carrito/CartEmpty'
import CartHeader from '@/components/carrito/CartHeader'
import CartItemList from '@/components/carrito/CartItemList'
import CartSummary from '@/components/carrito/CartSummary'
import { useCartStore } from '@/store/cartStore'

export default function CarritoPage() {
  const _hasHydrated = useCartStore(s => s._hasHydrated)
const [forceShow, setForceShow] = useState(false)

useEffect(() => {
  const timer = setTimeout(() => setForceShow(true), 1500)
  return () => clearTimeout(timer)
}, [])

useEffect(() => {
  const handlePageShow = (e: PageTransitionEvent) => {
    if (e.persisted) {
      // Página restaurada del bfcache — forzar show
      setForceShow(true)
    }
  }
  window.addEventListener('pageshow', handlePageShow)
  return () => window.removeEventListener('pageshow', handlePageShow)
}, [])
  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  if (!_hasHydrated && !forceShow) return (
  <div className="min-h-screen bg-[#fff8f6]">
    <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
      <div className="h-8 w-48 bg-[#004317]/10 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-4">
          {[1,2].map(i => (
            <div key={i} className="h-24 bg-[#004317]/10 rounded animate-pulse" />
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="h-64 bg-[#004317]/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
)

  return (
    <div className="min-h-screen bg-[#fff8f6]">

      <CartHeader totalItems={totalItems} />

      <main className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        {items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <CartItemList />
            </div>
            <aside className="lg:col-span-4">
              <CartSummary />
            </aside>
          </div>
        )}
      </main>
        {/* goog */}
      <div className="h-20 md:h-0" aria-hidden="true" />
    </div>
  )
}
