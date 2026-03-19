// ============================================================
// store/cartStore.ts — Estado global del carrito con Zustand
// ============================================================
// Instala Zustand: npm install zustand

import { LocalCartItem, Product } from '@/types'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  items: LocalCartItem[]
  isOpen: boolean

  // Acciones
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(i => i.product.id === product.id)

        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }
        // Abrir el drawer del carrito al añadir
        set({ isOpen: true })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0
        ),
    }),
    {
      name: 'lacasadelosjuegos-cart', // clave en localStorage
    }
  )
)
