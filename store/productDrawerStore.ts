// ============================================================
// store/productDrawerStore.ts — Estado del drawer de producto
// ============================================================

import { create } from 'zustand'

interface ProductDrawerStore {
  isOpen: boolean
  slug: string | null
  openProduct: (slug: string) => void
  closeProduct: () => void
}

export const useProductDrawerStore = create<ProductDrawerStore>((set) => ({
  isOpen: false,
  slug: null,
  openProduct: (slug: string) => set({ isOpen: true, slug }),
  closeProduct: () => set({ isOpen: false }),
}))
