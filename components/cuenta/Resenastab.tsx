'use client'

import { useEffect, useState, useTransition } from 'react'
import useSWR from 'swr'

import Image from 'next/image'
import Link from 'next/link'
import type { Review } from '@/types/cuentas'
import ReviewForm from './ReviewForm'
import StarRating from './Starrating'
import { createClient } from '@/lib/supabase/client'
import { useUserReviews } from '@/lib/useUserReviews'
import { deleteReview } from '@/lib/supabase/queries'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'

interface PendingProduct {
  id: string
  name: string
  slug: string
  images: string[]
}

interface ResenasTabProps {
  userId: string
  initialReviews: Review[]
  purchasedProductIds: string[]
}

export default function ResenasTab({ userId, initialReviews, purchasedProductIds }: ResenasTabProps) {
  const { data: reviews = [], mutate } = useUserReviews(userId)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [writingFor, setWritingFor] = useState<string | null>(null)
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[] | null>(null)
  const [loadingPending, setLoadingPending] = useState(false)
  const locale = useLocale()
  const searchParams = useSearchParams()
  const productFromUrl = searchParams.get('product')

  // IDs ya reseñados
  const reviewedIds = new Set(reviews.map(r => r.product_id))

  // IDs comprados pero sin reseña (sin duplicados)
  const pendingIds = [...new Set(purchasedProductIds)].filter(id => !reviewedIds.has(id))

  // Carga lazy de productos pendientes
  async function loadPendingProducts() {
    if (pendingProducts !== null || pendingIds.length === 0) return
    setLoadingPending(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, images')
      .in('id', pendingIds)
    setPendingProducts((data ?? []) as PendingProduct[])
    setLoadingPending(false)
  }

  const handleSave = async (updated: Review) => {
    setEditingId(null)
    setWritingFor(null)
    setPendingProducts(prev => prev ? prev.filter(p => p.id !== updated.product_id) : prev)
    await mutate()
  }

  const handleDelete = async (reviewId: string, productId: string) => {
    if (purchasedProductIds.includes(productId) && pendingProducts !== null) {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, images')
        .eq('id', productId)
        .single()
      if (data) setPendingProducts(prev => prev ? [data as PendingProduct, ...prev] : [data as PendingProduct])
    }
    await mutate()
  }

  const hasPending = pendingIds.length > 0
  const hasReviews = reviews.length > 0

  useEffect(() => {
    if (!productFromUrl || !pendingIds.includes(productFromUrl)) return

    const supabase = createClient()
    supabase
      .from('products')
      .select('id, name, slug, images')
      .in('id', pendingIds)
      .then(({ data }) => {
        const products = (data ?? []) as PendingProduct[]
        // Reordenar para que el producto del URL aparezca primero
        const sorted = [
          ...products.filter(p => p.id === productFromUrl),
          ...products.filter(p => p.id !== productFromUrl),
        ]
        setPendingProducts(sorted)
        // Pequeño delay para que React procese el estado antes de abrir el form
        setTimeout(() => setWritingFor(productFromUrl), 50)
      })
  }, [productFromUrl])

  if (!hasPending && !hasReviews) {
    return <ResenasEmpty locale={locale} />
  }

  return (
    <div className="space-y-10">

      {/* ── Pendientes de reseñar ── */}
      {hasPending && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
                Pendientes de reseñar
              </span>
              <span className="block w-8 h-0.5 bg-[#c9a84c] mt-1.5" />
            </div>
            <span className="font-mono text-[10px] text-[#717a6f]">
              {pendingIds.length} {pendingIds.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          {pendingProducts === null ? (
            <button
              onClick={loadPendingProducts}
              disabled={loadingPending}
              className="btn-outline text-xs py-2 px-4"
            >
              {loadingPending ? 'Cargando...' : 'Ver productos pendientes'}
            </button>
          ) : (
            <div className="space-y-3">
              {pendingProducts.map(product => (
                <div key={product.id}>
                  <div className="bg-white border border-[#c0c9bc]/30 rounded-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-3">
                      {/* Imagen */}
                      <div className="w-10 h-10 flex-shrink-0 bg-[#f5f0eb] rounded-sm overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#c0c9bc]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Nombre */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/${locale}/producto/${product.slug}`}
                          className="text-xs text-[#2a170f] hover:text-[#004317] transition-colors truncate block"
                          style={{ fontFamily: 'Newsreader, serif' }}
                        >
                          {product.name}
                        </Link>
                        <span className="font-mono text-[8px] text-[#717a6f]">Sin reseña</span>
                      </div>

                      {/* Botón */}
                      <button
                        onClick={() => setWritingFor(writingFor === product.id ? null : product.id)}
                        className="btn-primary text-xs py-1.5 px-3 shrink-0"
                      >
                        {writingFor === product.id ? 'Cancelar' : 'Escribir reseña'}
                      </button>
                    </div>

                    {/* Formulario inline */}
                    {writingFor === product.id && (
                      <div className="border-t border-[#c0c9bc]/20 bg-[#f9f6f1] p-4">
                        <ReviewForm
                          userId={userId}
                          productId={product.id}
                          onSave={review => handleSave({
                            ...review,
                            product: {
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              images: product.images,
                            }
                          })}
                          onCancel={() => setWritingFor(null)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Mis reseñas ── */}
      {hasReviews && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
                Mis reseñas
              </span>
              <span className="block w-8 h-0.5 bg-[#c9a84c] mt-1.5" />
            </div>
            <span className="font-mono text-[10px] text-[#717a6f]">
              {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>

          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                userId={userId}
                locale={locale}
                isEditing={editingId === review.id}
                isVerified={purchasedProductIds.includes(review.product_id)}
                onEdit={() => setEditingId(review.id)}
                onCancelEdit={() => setEditingId(null)}
                onSave={handleSave}
                onDelete={(id) => handleDelete(id, review.product_id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── ReviewCard ────────────────────────────────────────────────

interface ReviewCardProps {
  review: Review
  userId: string
  locale: string
  isEditing: boolean
  isVerified: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: (r: Review) => void
  onDelete: (id: string) => void
}

function ReviewCard({
  review, userId, locale, isEditing, isVerified, onEdit, onCancelEdit, onSave, onDelete
}: ReviewCardProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const product = review.product
  const imagen = product?.images?.[0] ?? null
  const fecha = new Date(review.updated_at).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    startTransition(async () => {
      const ok = await deleteReview(userId, review.id)
      if (ok) onDelete(review.id)
    })
  }

  return (
    <div className={`bg-white border border-[#c0c9bc]/30 rounded-sm overflow-hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      {/* Producto */}
      {product && (
        <Link
          href={`/${locale}/producto/${product.slug}`}
          className="flex items-center gap-3 p-3 border-b border-[#c0c9bc]/20 hover:bg-[#f9f6f1] transition-colors"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-[#f5f0eb] rounded-sm overflow-hidden">
            {imagen ? (
              <Image src={imagen} alt={product.name} width={40} height={40} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#c0c9bc]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#2a170f] truncate" style={{ fontFamily: 'Newsreader, serif' }}>
              {product.name}
            </p>
            {isVerified && (
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#004317]">
                ✓ Compra verificada
              </span>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c9bc" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      )}

      {/* Contenido reseña o formulario */}
      <div className="p-4">
        {isEditing ? (
          <ReviewForm
            userId={userId}
            productId={review.product_id}
            existing={review}
            onSave={onSave}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-2 mb-3">
              <StarRating value={review.rating} size={16} />
              <span className="font-mono text-[9px] text-[#c0c9bc] flex-shrink-0">{fecha}</span>
            </div>

            {review.titulo && (
              <p className="text-sm font-semibold text-[#2a170f] mb-1" style={{ fontFamily: 'Noto Serif, serif' }}>
                {review.titulo}
              </p>
            )}

            {review.contenido && (
              <p className="text-sm text-[#717a6f] leading-relaxed" style={{ fontFamily: 'Newsreader, serif' }}>
                {review.contenido}
              </p>
            )}

            {!review.titulo && !review.contenido && (
              <p className="text-sm text-[#c0c9bc] italic" style={{ fontFamily: 'Newsreader, serif' }}>
                Sin comentario escrito
              </p>
            )}

            {/* Acciones */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#c0c9bc]/20">
              <button
                onClick={onEdit}
                className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#004317] hover:text-[#1a5c2a] transition-colors"
              >
                Editar
              </button>
              <span className="text-[#c0c9bc]">·</span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className={`font-mono text-[9px] uppercase tracking-[0.15em] transition-colors ${
                  confirmDelete ? 'text-red-500' : 'text-[#717a6f] hover:text-red-400'
                }`}
              >
                {confirmDelete ? '¿Confirmar?' : 'Eliminar'}
              </button>
              {confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#717a6f] hover:text-[#2a170f] transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── ResenasEmpty ──────────────────────────────────────────────

function ResenasEmpty({ locale }: { locale: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c9a84c]/10 mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <span className="block w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
      <p className="text-[#2a170f] mb-1" style={{ fontFamily: 'Noto Serif, serif' }}>
        Aún no has dejado ninguna reseña
      </p>
      <p className="text-sm text-[#717a6f] mb-6" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>
        Comparte tu experiencia con otros jugadores después de recibir tu pedido
      </p>
      <Link href={`/${locale}/catalogo`} className="btn-primary inline-block">
        Explorar catálogo
      </Link>
    </div>
  )
}