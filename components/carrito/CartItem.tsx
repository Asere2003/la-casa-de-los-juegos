'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { LocalCartItem } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props {
  item: LocalCartItem
}

export default function CartItem({ item }: Props) {
  const removeItem  = useCartStore(s => s.removeItem)
  const updateQty   = useCartStore(s => s.updateQuantity)
  const { product, quantity } = item

  const isLowStock = product.stock > 0 && product.stock <= 3

  return (
    <div className="flex flex-col sm:flex-row gap-5 bg-white p-5 shadow-warm hover:shadow-warm-lg transition-shadow group" style={{ borderRadius: '2px' }}>

      {/* Imagen */}
      <Link
        href={`/producto/${product.slug}`}
        className="w-full sm:w-28 h-36 sm:h-28 shrink-0 overflow-hidden bg-[#fff1ec] focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        style={{ borderRadius: '2px' }}
        aria-label={`Ver ${product.name}`}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={112}
            height={112}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl" aria-hidden="true">🎲</div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-3">
          <div>
            {/* Categoría */}
            {product.category && (
              <span
                className="inline-block text-white text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter mb-1.5"
                style={{ background: product.category.color || '#1a5c2a', borderRadius: '2px' }}
              >
                {product.category.emoji} {product.category.name}
              </span>
            )}
            {/* SKU */}
            {product.sku && (
              <p className="font-mono text-[8px] text-[#717a6f] mb-1">{product.sku}</p>
            )}
            {/* Nombre */}
            <Link
              href={`/producto/${product.slug}`}
              className="font-headline italic text-lg md:text-xl text-[#2a170f] hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded leading-tight block"
            >
              {product.name}
            </Link>
          </div>

          {/* Botón eliminar */}
          <button
            onClick={() => removeItem(product.id)}
            aria-label={`Eliminar ${product.name} del carrito`}
            className="shrink-0 text-[#c0c9bc] hover:text-[#ba1a1a] transition-colors p-1.5 rounded focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>

        {/* Cantidad + Precio */}
        <div className="flex justify-between items-end mt-4">

          {/* Selector cantidad */}
          <div
            role="group"
            aria-label={`Cantidad de ${product.name}`}
            className="flex items-center border border-[#c0c9bc]/40 bg-[#fff1ec]"
            style={{ borderRadius: '2px' }}
          >
            <button
              onClick={() => updateQty(product.id, quantity - 1)}
              aria-label="Reducir cantidad"
              className="w-9 h-9 flex items-center justify-center hover:bg-[#ffe9e2] transition-colors font-mono text-[#004317] text-lg focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            >
              −
            </button>
            <span
              aria-live="polite"
              aria-label={`Cantidad: ${quantity}`}
              className="w-10 h-9 flex items-center justify-center font-mono text-sm font-bold border-x border-[#c0c9bc]/40"
            >
              {String(quantity).padStart(2, '0')}
            </span>
            <button
              onClick={() => updateQty(product.id, quantity + 1)}
              aria-label="Aumentar cantidad"
              disabled={quantity >= product.stock}
              className="w-9 h-9 flex items-center justify-center hover:bg-[#ffe9e2] transition-colors font-mono text-[#004317] text-lg disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            >
              +
            </button>
          </div>

          {/* Precio total línea */}
          <div className="text-right">
            {isLowStock && (
              <p className="font-mono text-[8px] text-[#ba1a1a] uppercase tracking-wide mb-1">
                Solo {product.stock} disponibles
              </p>
            )}
            <span className="font-mono text-lg font-bold text-[#2a170f]">
              {(product.price * quantity).toFixed(2).replace('.', ',')}€
            </span>
            {quantity > 1 && (
              <p className="font-mono text-[9px] text-[#717a6f]">
                {product.price.toFixed(2).replace('.', ',')}€ / ud.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
