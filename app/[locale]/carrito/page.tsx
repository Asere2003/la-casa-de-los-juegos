'use client'

import CartEmpty from '@/components/carrito/CartEmpty'
import CartHeader from '@/components/carrito/CartHeader'
import CartItemList from '@/components/carrito/CartItemList'
import CartSummary from '@/components/carrito/CartSummary'
import { useCartStore } from '@/store/cartStore'

export default function CarritoPage() {
  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

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
