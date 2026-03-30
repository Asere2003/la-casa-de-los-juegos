'use client'

import { useState, useTransition } from 'react'
import StarRating from './Starrating'
import { upsertReview } from '@/lib/supabase/queries'
import type { Review } from '@/types/cuentas'

interface ReviewFormProps {
  userId: string
  productId: string
  existing?: Review | null       // si existe, modo edición
  onSave: (review: Review) => void
  onCancel?: () => void
}

export default function ReviewForm({ userId, productId, existing, onSave, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [titulo, setTitulo] = useState(existing?.titulo ?? '')
  const [contenido, setContenido] = useState(existing?.contenido ?? '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const isEditing = !!existing

  const handleSubmit = () => {
    if (rating === 0) { setError('Por favor, selecciona una valoración'); return }
    setError('')

    startTransition(async () => {
      const result = await upsertReview({ user_id: userId, product_id: productId, rating, titulo, contenido })
      if (result) {
        onSave(result)
      } else {
        setError('No se pudo guardar la reseña. Inténtalo de nuevo.')
      }
    })
  }

  return (
    <div className="bg-[#f9f6f1] border border-[#c0c9bc]/40 rounded-sm p-4 space-y-4">
      {/* Valoración */}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#805533] mb-2">
          Valoración *
        </label>
        <StarRating value={rating} onChange={setRating} size={22} />
      </div>

      {/* Título */}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#717a6f] mb-1.5">
          Título <span className="normal-case tracking-normal font-sans text-[10px]">(opcional)</span>
        </label>
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          maxLength={120}
          placeholder="Un resumen de tu experiencia"
          className="input-base w-full text-sm"
          style={{ fontFamily: 'Newsreader, serif' }}
        />
      </div>

      {/* Contenido */}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#717a6f] mb-1.5">
          Tu opinión <span className="normal-case tracking-normal font-sans text-[10px]">(opcional)</span>
        </label>
        <textarea
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="¿Qué te ha parecido? ¿Para quién lo recomendarías?"
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
          {isPending ? 'Guardando…' : isEditing ? 'Actualizar reseña' : 'Publicar reseña'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isPending}
            className="btn-outline text-xs py-2 px-4"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}