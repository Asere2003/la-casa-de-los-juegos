'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { Product } from '@/types'
import ProductActions from '@/components/producto/ProductActions'
import ProductBadges from '@/components/producto/ProductBadges'
import ProductDescription from '@/components/producto/ProductDescription'
import ProductGallery from '@/components/producto/ProductGallery'
import ProductInfo from '@/components/producto/ProductInfo'
import { createClient } from '@/lib/supabase/client'
import { getProductBySlug } from '@/lib/supabase/queries'
import { useProductDrawerStore } from '@/store/productDrawerStore'

export default function ProductDrawer() {
  const isOpen       = useProductDrawerStore(s => s.isOpen)
  const slug         = useProductDrawerStore(s => s.slug)
  const closeProduct = useProductDrawerStore(s => s.closeProduct)

  const locale = useLocale()
  const t      = useTranslations('product_drawer')
  const tA11y  = useTranslations('accessibility')

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(false)
  const [userId, setUserId]   = useState<string | null>(null)

  const closeRef   = useRef<HTMLButtonElement>(null)
  const drawerRef  = useRef<HTMLDivElement>(null)
  const prevUrlRef = useRef('')

  // ── Obtener usuario autenticado ──────────────────────────────
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  // ── Cargar producto cuando cambia el slug ────────────────────
  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(false)
    setProduct(null)
    getProductBySlug(slug).then((data) => {
      if (data) setProduct(data)
      else setError(true)
      setLoading(false)
    })
  }, [slug])

  // ── Shallow routing ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen && slug) {
      prevUrlRef.current = window.location.pathname + window.location.search
      window.history.pushState({ productDrawer: slug }, '', `/${locale}/producto/${slug}`)
    }
  }, [isOpen, slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cerrar y restaurar URL ────────────────────────────────────
  const handleClose = useCallback(() => {
    closeProduct()
    if (prevUrlRef.current) {
      window.history.replaceState(null, '', prevUrlRef.current)
      prevUrlRef.current = ''
    }
  }, [closeProduct])

  // ── Detectar botón atrás del navegador ───────────────────────
  useEffect(() => {
    const onPopState = () => {
      if (isOpen) { prevUrlRef.current = ''; closeProduct() }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isOpen, closeProduct])

  // ── Focus al abrir ───────────────────────────────────────────
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  // ── Escape para cerrar ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, handleClose])

  // ── Bloquear scroll del body ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Trap focus ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const trap  = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={handleClose}
        className={`fixed inset-0 z-[71] bg-[#2a170f]/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Dialog */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={product?.name ?? t('title')}
        className={`
          fixed z-[72] bg-[#fff8f6] shadow-2xl shadow-[#2a170f]/40
          transition-all duration-300 ease-in-out flex flex-col
          inset-y-0 right-0 w-full max-w-lg
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          md:inset-0 md:m-auto md:w-full md:max-w-5xl md:h-[90vh] md:rounded-sm
          ${isOpen
            ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:pointer-events-auto'
            : 'md:translate-y-4 md:opacity-0 md:pointer-events-none'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c0c9bc]/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#004317]/60 shrink-0">
              {t('title')}
            </span>
            {product && (
              <span className="font-headline italic text-sm text-[#2a170f] truncate">
                {product.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {slug && (
              <Link
                href={`/producto/${slug}`}
                className="font-mono text-[9px] uppercase tracking-widest text-[#717a6f] hover:text-[#004317] transition-colors focus-visible:ring-2 focus-visible:ring-[#004317] rounded px-2 py-1 hidden sm:block"
              >
                {t('view_full_page')} ↗
              </Link>
            )}
            <button
              ref={closeRef}
              onClick={handleClose}
              aria-label={tA11y('close_menu')}
              className="text-[#004317]/70 hover:text-[#004317] transition-colors p-2 rounded focus-visible:ring-2 focus-visible:ring-[#004317]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden">

          {/* Cargando */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-8 h-8 border-2 border-[#004317]/20 border-t-[#004317] rounded-full animate-spin" aria-hidden="true" />
              <p className="font-body italic text-sm text-[#717a6f]">{t('loading')}</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 px-8 text-center">
              <p className="font-body italic text-sm text-[#717a6f]">{t('error')}</p>
              {slug && (
                <Link
                  href={`/producto/${slug}`}
                  className="font-mono text-[10px] uppercase tracking-widest text-[#004317] border-b border-[#004317]/30 pb-0.5 hover:border-[#004317] transition-colors"
                >
                  {t('view_full_page')} →
                </Link>
              )}
            </div>
          )}

          {/* Producto */}
          {product && !loading && (
            <>
              {/* ── Móvil: una columna ── */}
              <div className="md:hidden pb-10">
                <div className="px-5 pt-5">
                  <ProductGallery images={product.images} name={product.name} />
                </div>
                <div className="px-6 pt-6 flex flex-col gap-5">
                  <ProductInfo product={product} userId={userId} isFavorite={false} />
                  <ProductBadges product={product} />
                  <ProductDescription description={product.description} />
                  <ProductActions product={product} onAddToCart={handleClose} />
                  <Link
                    href={`/producto/${slug}`}
                    className="flex items-center justify-center gap-2 w-full border border-[#c0c9bc]/60 text-[#2a170f] font-headline italic py-3 hover:border-[#004317] hover:text-[#004317] hover:bg-white transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c] text-sm"
                    style={{ borderRadius: '2px' }}
                  >
                    {t('view_full_page')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* ── Desktop: dos columnas ── */}
              <div className="hidden md:grid md:grid-cols-2 md:h-full">

                {/* Columna izquierda — galería */}
                <div className="overflow-y-auto border-r border-[#c0c9bc]/20 p-6 bg-white">
                  <ProductGallery images={product.images} name={product.name} />
                </div>

                {/* Columna derecha — info + acciones */}
                <div className="overflow-y-auto p-6 flex flex-col gap-5">
                  <ProductInfo product={product} userId={userId} isFavorite={false} />
                  <ProductBadges product={product} />
                  <ProductDescription description={product.description} />
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <ProductActions product={product} onAddToCart={handleClose} />
                    <Link
                      href={`/producto/${slug}`}
                      className="flex items-center justify-center gap-2 w-full border border-[#c0c9bc]/60 text-[#2a170f] font-headline italic py-3 hover:border-[#004317] hover:text-[#004317] hover:bg-white transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c] text-sm"
                      style={{ borderRadius: '2px' }}
                    >
                      {t('view_full_page')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}