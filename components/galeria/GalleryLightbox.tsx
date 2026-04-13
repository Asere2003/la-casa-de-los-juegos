'use client'
// components/galeria/GalleryLightbox.tsx
// Visor modal con navegación teclado + swipe táctil

import { useCallback, useEffect, useRef } from 'react'

import type { GalleryPhoto } from '@/types/gallery'
import Image from 'next/image'

interface Props {
  photos: GalleryPhoto[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function GalleryLightbox({ photos, currentIndex, onClose, onPrev, onNext }: Props) {
  const photo = photos[currentIndex]
  const touchStartX = useRef<number | null>(null)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  // Teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && hasPrev) onPrev()
    if (e.key === 'ArrowRight' && hasNext) onNext()
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) onNext()
      if (diff < 0 && hasPrev) onPrev()
    }
    touchStartX.current = null
  }

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cerrar */}
      <button
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
        style={{ fontSize: '2rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); onClose() }}
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Contador */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.1em' }}
      >
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Flecha izquierda */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '2px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.25rem',
          }}
          onClick={e => { e.stopPropagation(); onPrev() }}
          aria-label="Anterior"
        >
          ‹
        </button>
      )}

      {/* Imagen principal */}
      <div
        className="relative flex items-center justify-center"
        style={{ maxWidth: 'calc(100vw - 120px)', maxHeight: 'calc(100vh - 120px)' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative"
          style={{
            maxWidth: '90vw',
            maxHeight: '80vh',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
          }}
        >
          <Image
            src={photo.url}
            alt={photo.alt_text ?? photo.caption ?? 'Foto de la galería'}
            width={photo.width ?? 1200}
            height={photo.height ?? 800}
            style={{
              maxWidth: '85vw',
              maxHeight: '75vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
            priority
          />
        </div>

        {/* Caption */}
        {photo.caption && (
          <div
            className="absolute bottom-0 left-0 right-0 text-center text-white/80"
            style={{
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '24px 16px 12px',
              fontFamily: 'Newsreader, serif',
              fontSize: '0.95rem',
              fontStyle: 'italic',
            }}
          >
            {photo.caption}
          </div>
        )}
      </div>

      {/* Flecha derecha */}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '2px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.25rem',
          }}
          onClick={e => { e.stopPropagation(); onNext() }}
          aria-label="Siguiente"
        >
          ›
        </button>
      )}

      {/* Miniaturas strip */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto"
        style={{ maxWidth: 'calc(100vw - 40px)', padding: '4px' }}
        onClick={e => e.stopPropagation()}
      >
        {photos.slice(Math.max(0, currentIndex - 4), Math.min(photos.length, currentIndex + 5)).map((p, i) => {
          const realIndex = Math.max(0, currentIndex - 4) + i
          return (
            <button
              key={p.id}
              onClick={() => {
                // Navegar al índice real — necesita prop onGoTo
                const diff = realIndex - currentIndex
                if (diff > 0) for (let j = 0; j < diff; j++) onNext()
                if (diff < 0) for (let j = 0; j < Math.abs(diff); j++) onPrev()
              }}
              style={{
                flexShrink: 0,
                width: '48px',
                height: '48px',
                borderRadius: '2px',
                overflow: 'hidden',
                border: realIndex === currentIndex
                  ? '2px solid #c9a84c'
                  : '2px solid rgba(255,255,255,0.2)',
                opacity: realIndex === currentIndex ? 1 : 0.5,
                transition: 'all 0.2s',
                cursor: 'pointer',
                background: 'none',
                padding: 0,
              }}
            >
              <Image
                src={p.thumbnail_url ?? p.url}
                alt=""
                width={48}
                height={48}
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}