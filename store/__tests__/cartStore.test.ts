import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from '../cartStore'
import type { Product } from '@/types'

// ── Fixtures de productos de prueba ──────────────────────────────────────────

const catan: Product = {
  id: 'prod-catan',
  name: 'Catan',
  slug: 'catan',
  price: 45.99,
  stock: 10,
  images: ['catan.jpg'],
  featured: false,
  active: true,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

const ticketToRide: Product = {
  id: 'prod-ttr',
  name: 'Ticket to Ride',
  slug: 'ticket-to-ride',
  price: 39.95,
  stock: 5,
  images: ['ttr.jpg'],
  featured: false,
  active: true,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const carrito = () => useCartStore.getState()

// ─────────────────────────────────────────────────────────────────────────────

describe('cartStore — estado global del carrito', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isOpen: false,
      _hasHydrated: false,
    })
    localStorage.clear()
  })

  // ─── Happy path ─────────────────────────────────────────────────────────────

  describe('añadir productos al carrito', () => {
    it('añadir un producto nuevo lo agrega con cantidad 1 por defecto', () => {
      carrito().addItem(catan)

      expect(carrito().items).toHaveLength(1)
      expect(carrito().items[0].product.id).toBe('prod-catan')
      expect(carrito().items[0].quantity).toBe(1)
    })

    it('añadir un producto abre el drawer del carrito', () => {
      carrito().addItem(catan)

      expect(carrito().isOpen).toBe(true)
    })

    it('añadir el mismo producto acumula la cantidad en lugar de duplicar el item', () => {
      carrito().addItem(catan)
      carrito().addItem(catan)

      expect(carrito().items).toHaveLength(1)
      expect(carrito().items[0].quantity).toBe(2)
    })

    it('añadir con cantidad personalizada respeta esa cantidad', () => {
      carrito().addItem(catan, 3)

      expect(carrito().items[0].quantity).toBe(3)
    })

    it('añadir el mismo producto con cantidad personalizada acumula correctamente', () => {
      carrito().addItem(catan, 2)
      carrito().addItem(catan, 3)

      expect(carrito().items[0].quantity).toBe(5)
    })

    it('añadir productos distintos los mantiene como items separados', () => {
      carrito().addItem(catan)
      carrito().addItem(ticketToRide)

      expect(carrito().items).toHaveLength(2)
    })
  })

  describe('eliminar productos del carrito', () => {
    it('eliminar un producto lo quita del carrito', () => {
      carrito().addItem(catan)
      carrito().removeItem('prod-catan')

      expect(carrito().items).toHaveLength(0)
    })

    it('eliminar un producto no afecta al resto del carrito', () => {
      carrito().addItem(catan)
      carrito().addItem(ticketToRide)
      carrito().removeItem('prod-catan')

      expect(carrito().items).toHaveLength(1)
      expect(carrito().items[0].product.id).toBe('prod-ttr')
    })

    it('eliminar un producto inexistente no lanza error ni modifica el carrito', () => {
      carrito().addItem(catan)
      carrito().removeItem('prod-inexistente')

      expect(carrito().items).toHaveLength(1)
    })
  })

  describe('actualizar cantidad de un producto', () => {
    it('actualizar cantidad modifica el item correctamente', () => {
      carrito().addItem(catan)
      carrito().updateQuantity('prod-catan', 5)

      expect(carrito().items[0].quantity).toBe(5)
    })

    it('actualizar cantidad no afecta a otros productos del carrito', () => {
      carrito().addItem(catan)
      carrito().addItem(ticketToRide)
      carrito().updateQuantity('prod-catan', 4)

      expect(carrito().items.find(i => i.product.id === 'prod-ttr')?.quantity).toBe(1)
    })
  })

  describe('limpiar el carrito', () => {
    it('clearCart vacía todos los items', () => {
      carrito().addItem(catan)
      carrito().addItem(ticketToRide)
      carrito().clearCart()

      expect(carrito().items).toHaveLength(0)
    })

    it('clearCart sobre un carrito vacío no lanza error', () => {
      expect(() => carrito().clearCart()).not.toThrow()
    })
  })

  describe('visibilidad del drawer del carrito', () => {
    it('openCart abre el drawer', () => {
      carrito().openCart()

      expect(carrito().isOpen).toBe(true)
    })

    it('closeCart cierra el drawer', () => {
      carrito().openCart()
      carrito().closeCart()

      expect(carrito().isOpen).toBe(false)
    })

    it('toggleCart alterna el estado del drawer', () => {
      expect(carrito().isOpen).toBe(false)

      carrito().toggleCart()
      expect(carrito().isOpen).toBe(true)

      carrito().toggleCart()
      expect(carrito().isOpen).toBe(false)
    })
  })

  // ─── Cálculo de totales ──────────────────────────────────────────────────────

  describe('calcular totales del carrito', () => {
    it('totalItems devuelve 0 con el carrito vacío', () => {
      expect(carrito().totalItems()).toBe(0)
    })

    it('totalPrice devuelve 0 con el carrito vacío', () => {
      expect(carrito().totalPrice()).toBe(0)
    })

    it('totalItems suma las cantidades de todos los productos', () => {
      carrito().addItem(catan, 2)
      carrito().addItem(ticketToRide, 3)

      expect(carrito().totalItems()).toBe(5)
    })

    it('totalPrice calcula el precio total correctamente', () => {
      carrito().addItem(catan, 2)       // 2 × 45.99 = 91.98
      carrito().addItem(ticketToRide, 1) // 1 × 39.95 = 39.95

      expect(carrito().totalPrice()).toBeCloseTo(2 * 45.99 + 1 * 39.95)
    })

    it('totalItems refleja la cantidad actualizada tras updateQuantity', () => {
      carrito().addItem(catan, 1)
      carrito().updateQuantity('prod-catan', 4)

      expect(carrito().totalItems()).toBe(4)
    })

    it('totalItems se reduce correctamente al eliminar un producto', () => {
      carrito().addItem(catan, 3)
      carrito().addItem(ticketToRide, 2)
      carrito().removeItem('prod-catan')

      expect(carrito().totalItems()).toBe(2)
    })
  })

  // ─── Hidratación y persistencia ──────────────────────────────────────────────

  describe('hidratación del estado persistido', () => {
    it('_hasHydrated empieza en false antes de rehidratar', () => {
      expect(carrito()._hasHydrated).toBe(false)
    })

    it('setHasHydrated(true) marca el carrito como rehidratado', () => {
      carrito().setHasHydrated(true)

      expect(carrito()._hasHydrated).toBe(true)
    })

    it('setHasHydrated(false) revierte el flag de hidratación', () => {
      carrito().setHasHydrated(true)
      carrito().setHasHydrated(false)

      expect(carrito()._hasHydrated).toBe(false)
    })
  })

  // ─── Edge cases del dominio ──────────────────────────────────────────────────

  describe('cantidades inválidas', () => {
    it('actualizar cantidad a 0 elimina el producto del carrito', () => {
      carrito().addItem(catan)
      carrito().updateQuantity('prod-catan', 0)

      expect(carrito().items).toHaveLength(0)
    })

    it('actualizar cantidad negativa elimina el producto del carrito', () => {
      carrito().addItem(catan)
      carrito().updateQuantity('prod-catan', -5)

      expect(carrito().items).toHaveLength(0)
    })
  })

  describe('producto sin imagen', () => {
    it('permite añadir un producto con array de imágenes vacío', () => {
      const juegoSinFoto: Product = { ...catan, id: 'sin-foto', images: [] }

      carrito().addItem(juegoSinFoto)

      expect(carrito().items).toHaveLength(1)
      expect(carrito().items[0].product.images).toHaveLength(0)
    })
  })

  describe('storage corrupto', () => {
    it('el carrito funciona con normalidad aunque localStorage tenga datos corruptos', () => {
      localStorage.setItem('lacasadelosjuegos-cart', 'DATOS_CORRUPTOS_{{{')

      expect(() => {
        carrito().addItem(catan)
        carrito().totalItems()
        carrito().totalPrice()
      }).not.toThrow()
    })
  })
})
