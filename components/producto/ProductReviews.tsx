import StarDisplay from './StarDisplay'
import { getProductReviews } from '@/lib/supabase/queries'

interface Props {
  productId: string
}

export default async function ProductReviews({ productId }: Props) {
  const reviews = await getProductReviews(productId)

  if (reviews.length === 0) {
    return (
      <div className="mt-16 border-t border-[#c0c9bc]/30 pt-10">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#805533] mb-6">
          Reseñas
        </h2>
        <p className="font-body italic text-sm text-[#717a6f]">
          Aún no hay reseñas para este producto. ¡Sé el primero!
        </p>
      </div>
    )
  }

  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  // Distribución por estrellas
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100),
  }))

  return (
    <div className="mt-16 border-t border-[#c0c9bc]/30 pt-10">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#805533] mb-8">
        Reseñas
      </h2>

      {/* Resumen */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 pb-8 border-b border-[#c0c9bc]/30">

        {/* Media */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-5xl font-headline text-[#2a170f]">
            {avg.toFixed(1)}
          </span>
          <StarDisplay rating={avg} size="md" />
          <span className="font-mono text-[10px] text-[#717a6f] mt-1 uppercase tracking-wider">
            {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
          </span>
        </div>

        {/* Distribución */}
        <div className="flex-1 space-y-2">
          {dist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#717a6f] w-4">{star}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#c9a84c" stroke="#c9a84c" strokeWidth="1.6">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <div className="flex-1 h-1.5 bg-[#c0c9bc]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c9a84c] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#717a6f] w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="pb-6 border-b border-[#c0c9bc]/20 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#2a170f]">
                    {review.profile?.nombre ?? 'Cliente'}
                  </span>
                  {review.verified_purchase && (
                    <span className="font-mono text-[8px] uppercase tracking-wide text-[#004317] bg-[#004317]/10 px-1.5 py-0.5">
                      ✓ Compra verificada
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-[#717a6f]">
                  {new Date(review.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              <StarDisplay rating={review.rating} size="sm" />
            </div>
            {review.titulo && (
              <p className="font-headline text-sm text-[#2a170f] mb-1">{review.titulo}</p>
            )}
            {review.contenido && (
              <p className="font-body text-sm text-[#717a6f] leading-relaxed italic">
                {review.contenido}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}