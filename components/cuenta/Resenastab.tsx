'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { deleteReview } from '@/lib/supabase/queries'
import type { Review } from '@/types/cuentas'
import StarRating from './Starrating'
import ReviewForm from './ReviewForm'

interface ResenasTabProps {
  userId: string
  initialReviews: Review[]
  /** IDs de productos comprados — para el badge verified */
  purchasedProductIds: string[]
}

export default function ResenasTab({ userId, initialReviews, purchasedProductIds }: ResenasTabProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [editingId, setEditingId] = useState<string | null>(null)
  const locale = useLocale()

  const handleSave = (updated: Review) => {
    setReviews(prev => {
      const exists = prev.find(r => r.id === updated.id || r.product_id === updated.product_id)
      if (exists) return prev.map(r => (r.product_id === updated.product_id ? updated : r))
      return [updated, ...prev]
    })
    setEditingId(null)
  }

  const handleDelete = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  if (reviews.length === 0) {
    return <ResenasEmpty locale={locale} />
  }

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Lista */}
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
            onDelete={handleDelete}
          />
        ))}
      </div>
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
            {/* Rating + fecha */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <StarRating value={review.rating} size={16} />
              <span className="font-mono text-[9px] text-[#c0c9bc] flex-shrink-0">{fecha}</span>
            </div>

            {/* Título */}
            {review.titulo && (
              <p className="text-sm font-semibold text-[#2a170f] mb-1" style={{ fontFamily: 'Noto Serif, serif' }}>
                {review.titulo}
              </p>
            )}

            {/* Contenido */}
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