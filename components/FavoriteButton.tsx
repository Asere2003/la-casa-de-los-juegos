'use client'

import { useEffect, useState, useTransition } from 'react'

import { toggleFavorite } from '@/app/actions/favorites'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface FavoriteButtonProps {
  productId: string
  userId: string | null
  initialIsFavorite?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost'  // ghost = sin fondo, solo silueta
  className?: string
}

const sizeMap = {
  sm: { btn: 'w-7 h-7',   icon: 16 },
  md: { btn: 'w-9 h-9',   icon: 18 },
  lg: { btn: 'w-11 h-11', icon: 22 },
}

export default function FavoriteButton({
  productId,
  userId,
  initialIsFavorite = false,
  size = 'md',
  variant = 'default',
  className = '',
}: FavoriteButtonProps) {
  const router = useRouter()
  const t = useTranslations('product')
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, startTransition] = useTransition()
  const { btn, icon } = sizeMap[size]

  useEffect(() => {
    setIsFavorite(initialIsFavorite)
  }, [initialIsFavorite])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      router.push('/login?redirect=/cuenta?tab=favoritos')
      return
    }

    const next = !isFavorite
    setIsFavorite(next)

    startTransition(async () => {
      const { ok } = await toggleFavorite(productId, next)
      if (!ok) setIsFavorite(!next)
    })
  }

  // ── Variante ghost: sin fondo, solo icono con drop-shadow ──
  if (variant === 'ghost') {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        aria-label={isFavorite ? t('remove_from_wishlist') : t('add_to_wishlist')}
        title={isFavorite ? t('remove_from_wishlist') : t('add_to_wishlist')}
        className={`
          ${btn} flex items-center justify-center
          transition-all duration-200
          ${isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 24 24"
          fill={isFavorite ? '#c9a84c' : 'none'}
          stroke={isFavorite ? '#c9a84c' : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
          className={`transition-transform duration-200 ${isPending ? '' : 'hover:scale-110'}`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    )
  }

  // ── Variante default: con fondo (comportamiento original) ──
  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      className={`
        ${btn} flex items-center justify-center rounded-full
        transition-all duration-200
        ${isFavorite
          ? 'bg-[#c9a84c]/15 text-[#c9a84c] hover:bg-[#c9a84c]/25'
          : 'bg-white/80 text-[#717a6f] hover:bg-white hover:text-[#c9a84c]'
        }
        shadow-sm backdrop-blur-sm
        ${isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${isPending ? '' : 'hover:scale-110'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}