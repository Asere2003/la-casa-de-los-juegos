'use client'

import { useState, useTransition } from 'react'
import StarRating from './Starrating'
import { upsertReview } from '@/lib/supabase/queries'
import type { Review } from '@/types/cuentas'
import { useTranslations } from 'next-intl'

interface ReviewFormProps {
  userId: string
  productId: string
  existing?: Review | null       // si existe, modo edición
  onSave: (review: Review) => void
  onCancel?: () => void
}

export default function ReviewForm({ userId, productId, existing, onSave, onCancel }: ReviewFormProps) {
  const t = useTranslations('resenas')
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [titulo, setTitulo] = useState(existing?.titulo ?? '')
  const [contenido, setContenido] = useState(existing?.contenido ?? '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const isEditing = !!existing

  const handleSubmit = () => {
    if (rating === 0) { setError(t('form_error_rating')); return }
    setError('')

    startTransition(async () => {
      const result = await upsertReview({ user_id: userId, product_id: productId, rating, titulo, contenido })
      if (result) {
        onSave(result)
      } else {
        setError(t('form_error_save'))
      }
    })
  }

  let submitLabel = isEditing ? t('form_update') : t('form_publish')
  if (isPending) submitLabel = t('form_saving')

  return (
    <div className="bg-[#f9f6f1] border border-[#c0c9bc]/40 rounded-sm p-4 space-y-4">
      {/* Valoración */}
      <div>
        <label htmlFor="review-rating" className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#805533] mb-2">
          {t('form_rating_label')}
        </label>
        <StarRating value={rating} onChange={setRating} size={22} />
      </div>

      {/* Título */}
      <div>
        <label htmlFor="review-titulo" className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#717a6f] mb-1.5">
          {t('form_title_label')} <span className="normal-case tracking-normal font-sans text-[10px]">{t('form_title_optional')}</span>
        </label>
        <input
          id="review-titulo"
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          maxLength={120}
          placeholder={t('form_title_placeholder')}
          className="input-base w-full text-sm"
          style={{ fontFamily: 'Newsreader, serif' }}
        />
      </div>

      {/* Contenido */}
      <div>
        <label htmlFor="review-contenido" className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#717a6f] mb-1.5">
          {t('form_content_label')} <span className="normal-case tracking-normal font-sans text-[10px]">{t('form_title_optional')}</span>
        </label>
        <textarea
          id="review-contenido"
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder={t('form_content_placeholder')}
          className="input-base w-full text-sm resize-none"
          style={{ fontFamily: 'Newsreader, serif' }}
        />
        <span className="font-mono text-[9px] text-[#c0c9bc] mt-1 block text-right">
          {contenido.length}/1000
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="font-mono text-[10px] text-red-600">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
          disabled={isPending || rating === 0}
          className="btn-primary text-xs py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isPending}
            className="btn-outline text-xs py-2 px-4"
          >
            {t('form_cancel')}
          </button>
        )}
      </div>
    </div>
  )
}