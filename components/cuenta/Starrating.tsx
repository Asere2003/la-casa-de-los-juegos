'use client'

import { useState } from 'react'

interface StarRatingProps {
  value: number           // rating actual (1-5)
  onChange?: (v: number) => void  // si se pasa → interactivo
  size?: number
  className?: string
}

export default function StarRating({ value, onChange, size = 18, className = '' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const isInteractive = !!onChange
  const display = isInteractive ? (hovered || value) : value

  return (
    <div className={`flex gap-0.5 ${className}`} role={isInteractive ? 'radiogroup' : undefined} aria-label="Valoración">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          aria-label={isInteractive ? `${star} estrella${star > 1 ? 's' : ''}` : undefined}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => isInteractive && setHovered(star)}
          onMouseLeave={() => isInteractive && setHovered(0)}
          className={`transition-transform duration-100 ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= display ? '#c9a84c' : 'none'}
            stroke={star <= display ? '#c9a84c' : '#c0c9bc'}
            strokeWidth="1.5"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  )
}

/** Versión de solo lectura más pequeña para mostrar en tarjetas */
export function StarDisplay({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill={star <= Math.round(rating) ? '#c9a84c' : 'none'}
            stroke={star <= Math.round(rating) ? '#c9a84c' : '#c0c9bc'}
            strokeWidth="1.5"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className="font-mono text-[9px] text-[#717a6f]">({count})</span>
      )}
    </div>
  )
}