'use client'

import { useState, useTransition } from 'react'

import type { Favorite } from '@/types/cuentas'
import Image from 'next/image'
import Link from 'next/link'
import { removeFavorite } from '@/lib/supabase/queries'
import { useCartStore } from '@/store/cartStore'
import { useLocale, useTranslations } from 'next-intl'
import { useProductDrawerStore } from '@/store/productDrawerStore'

interface FavoritosTabProps {
  userId: string
  initialFavorites: Favorite[]
}

export default function FavoritosTab({ userId, initialFavorites }: FavoritosTabProps) {
  const [favorites, setFavorites] = useState(initialFavorites)
  const locale = useLocale()
  const t = useTranslations('favoritos')
  const openProduct = useProductDrawerStore(s => s.openProduct)

  const handleRemove = (productId: string) => {
    setFavorites(prev => prev.filter(f => f.product_id !== productId))
  }

  if (favorites.length === 0) {
    return <FavoritosEmpty locale={locale} />
  }

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
            {t('heading')}
          </span>
          <span className="block w-8 h-0.5 bg-[#c9a84c] mt-1.5" />
        </div>
        <span className="font-mono text-[10px] text-[#717a6f]">
          {favorites.length === 1 ? t('product_count_one', { count: favorites.length }) : t('product_count_other', { count: favorites.length })}
        </span>
      </div>

      {/* Grid estilo NewArrivals */}
      <div className="grid grid-cols-2 gap-5">
        {favorites.map(fav => (
          <FavoriteCard
            key={fav.id}
            favorite={fav}
            userId={userId}
            locale={locale}
            onRemove={handleRemove}
            onOpenDrawer={openProduct}
          />
        ))}
      </div>
    </div>
  )
}

// ── FavoriteCard ──────────────────────────────────────────────

interface FavoriteCardProps {
  favorite: Favorite
  userId: string
  locale: string
  onRemove: (productId: string) => void
  onOpenDrawer: (slug: string) => void
}

function FavoriteCard({ favorite, userId, locale, onRemove, onOpenDrawer }: FavoriteCardProps) {
  const t = useTranslations('favoritos')
  const [isPending, startTransition] = useTransition()
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const { product } = favorite
  const imagen = product.images?.[0] ?? null
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const isOutOfStock = product.stock === 0

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirmRemove) { setConfirmRemove(true); return }
    startTransition(async () => {
      const ok = await removeFavorite(userId, product.id)
      if (ok) onRemove(product.id)
    })
  }

const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault()
  addItem(product as any, 1)
  setAdded(true)
  setTimeout(() => setAdded(false), 1800)
}

  return (
<article
  className={`group flex flex-col bg-white overflow-hidden border border-[#c0c9bc]/20 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-md ${isPending ? 'opacity-50' : ''}`}
  style={{ borderRadius: '2px' }}
>
      {/* Imagen */}
      <a
        href={`/${locale}/producto/${product.slug}`}
        onClick={(e) => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) { e.preventDefault(); onOpenDrawer(product.slug) } }}
        className="relative aspect-[3/4] overflow-hidden block focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
      >
        {imagen ? (
          <Image
            src={imagen}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#fff1ec] flex items-center justify-center text-4xl">🎲</div>
        )}

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/20 to-transparent pointer-events-none" aria-hidden="true" />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {isOutOfStock && (
            <span className="bg-[#717a6f] text-white text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter" style={{ borderRadius: '2px' }}>
              {t('out_of_stock')}
            </span>
          )}
          {product.badge && !isOutOfStock && (
            <span className="bg-[#c9a84c] text-[#2c1810] text-[8px] font-mono px-2 py-0.5 uppercase tracking-tighter font-bold" style={{ borderRadius: '2px' }}>
              {product.badge}
            </span>
          )}
        </div>
      </a>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 border-t border-[#c0c9bc]/15">
        <a
          href={`/${locale}/producto/${product.slug}`}
          onClick={(e) => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) { e.preventDefault(); onOpenDrawer(product.slug) } }}
          className="font-headline italic text-sm leading-snug mb-1 group-hover:text-[#004317] transition-colors flex-1"
        >
          {product.name}
        </a>

        {/* Precio */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-sm font-bold text-[#004317]">
            {product.price.toFixed(2).replace('.', ',')}€
          </span>
          {hasDiscount && (
            <span className="font-mono text-[10px] text-[#717a6f] line-through">
              {product.compare_price!.toFixed(2).replace('.', ',')}€
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between mt-auto">
          {/* Eliminar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRemove}
              disabled={isPending}
              className={`font-mono text-[8px] uppercase tracking-[0.15em] transition-colors ${
                confirmRemove ? 'text-red-500' : 'text-[#c0c9bc] hover:text-red-400'
              }`}
            >
              {confirmRemove ? t('confirm_remove') : t('remove')}
            </button>
            {confirmRemove && (
              <button
                onClick={(e) => { e.preventDefault(); setConfirmRemove(false) }}
                className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#c0c9bc] hover:text-[#717a6f] transition-colors"
              >
                {t('cancel')}
              </button>
            )}
          </div>

          {/* Añadir al carrito */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className={`p-1.5 transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                added
                  ? 'bg-[#c9a84c] text-[#2c1810]'
                  : 'bg-[#004317] text-white hover:bg-[#1a5c2a]'
              }`}
              style={{ borderRadius: '2px' }}
              aria-label={`Añadir ${product.name} al carrito`}
            >
              {added ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

// ── FavoritosEmpty ────────────────────────────────────────────

function FavoritosEmpty({ locale }: { locale: string }) {
  const t = useTranslations('favoritos')
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c9a84c]/10 mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <span className="block w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
      <p className="text-[#2a170f] mb-1" style={{ fontFamily: 'Noto Serif, serif' }}>
        {t('empty_title')}
      </p>
      <p className="text-sm text-[#717a6f] mb-6" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>
        {t('empty_desc')}
      </p>
      <Link href={`/${locale}/catalogo`} className="btn-primary inline-block">
        {t('explore_catalogue')}
      </Link>
    </div>
  )
}