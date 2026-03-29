'use client'

import { useCallback, useState } from 'react'

import CloudinaryImage from '@/components/shared/CloudinaryImage'
import { useTranslations } from 'next-intl'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0)
  const t = useTranslations('product')
  const tA11y = useTranslations('accessibility')

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  prev()
    if (e.key === 'ArrowRight') next()
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Imagen principal */}
      <div
        className="relative group aspect-[4/5] overflow-hidden bg-white shadow-warm-lg"
        style={{ borderRadius: '2px' }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={t('gallery', { name })}
        aria-roledescription="carrusel"
      >
        <CloudinaryImage
          key={current}
          src={images[current]}
          alt={t('image_n_of', { name, current: current + 1, total: images.length })}
          fill
          priority={current === 0}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/10 to-transparent pointer-events-none" aria-hidden="true" />

        {/* Flechas navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label={tA11y('prev_image')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fff8f6]/80 backdrop-blur-sm flex items-center justify-center text-[#2a170f] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fff8f6] shadow-warm focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label={tA11y('next_image')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fff8f6]/80 backdrop-blur-sm flex items-center justify-center text-[#2a170f] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fff8f6] shadow-warm focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </>
        )}

        {/* Dots navegación */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist" aria-label={t('select_image')}>
            {images.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={t('image_n', { n: i + 1 })}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded-full ${
                  i === current
                    ? 'w-4 h-1.5 bg-[#c9a84c]'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-[#2a170f]/60 text-white font-mono text-[9px] px-2 py-1 backdrop-blur-sm" style={{ borderRadius: '2px' }} aria-live="polite">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3" role="list" aria-label={t('select_image')}>
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setCurrent(i)}
              aria-label={t('view_image_n', { n: i + 1 })}
              aria-pressed={i === current}
              className={`relative aspect-square overflow-hidden transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
                i === current
                  ? 'ring-2 ring-[#c9a84c] opacity-100'
                  : 'opacity-55 hover:opacity-90'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <CloudinaryImage
                src={img}
                alt={`${name} — miniatura ${i + 1}`}
                fill
                sizes="15vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
