'use client'

import { useCallback, useEffect, useState } from 'react'

import CloudinaryImage from '@/components/shared/CloudinaryImage'
import useEmblaCarousel from 'embla-carousel-react'
import { useTranslations } from 'next-intl'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const t = useTranslations('product')
  const tA11y = useTranslations('accessibility')

  const [selectedIndex, setSelectedIndex] = useState(0)

  // ── Carrusel principal ──
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true, dragFree: false })

  // ── Carrusel thumbnails ──
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return
      mainApi.scrollTo(index)
    },
    [mainApi, thumbApi]
  )

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return
    const index = mainApi.selectedScrollSnap()
    setSelectedIndex(index)
    thumbApi.scrollTo(index)
  }, [mainApi, thumbApi])

  useEffect(() => {
    if (!mainApi) return
    onSelect()
    mainApi.on('select', onSelect)
    mainApi.on('reInit', onSelect)
    return () => {
      mainApi.off('select', onSelect)
      mainApi.off('reInit', onSelect)
    }
  }, [mainApi, onSelect])

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi])
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi])

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">

      {/* ── Carrusel principal ── */}
      <div
        className="relative group overflow-hidden bg-white shadow-warm-lg"
        style={{ borderRadius: '2px' }}
      >
        <div ref={mainRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative flex-[0_0_100%] aspect-[4/5]"
              >
                <CloudinaryImage
                  src={img}
                  alt={t('image_n_of', { name, current: i + 1, total: images.length })}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain p-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/10 to-transparent pointer-events-none" aria-hidden="true" />

        {/* Flechas — solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label={tA11y('prev_image')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fff8f6]/80 backdrop-blur-sm flex items-center justify-center text-[#2a170f] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fff8f6] shadow-warm focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={scrollNext}
              aria-label={tA11y('next_image')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fff8f6]/80 backdrop-blur-sm flex items-center justify-center text-[#2a170f] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fff8f6] shadow-warm focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => mainApi?.scrollTo(i)}
                  aria-label={t('image_n', { n: i + 1 })}
                  className={`transition-all duration-300 rounded-full ${
                    i === selectedIndex
                      ? 'w-4 h-1.5 bg-[#c9a84c]'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

            {/* Contador */}
            <div
              className="absolute top-3 right-3 bg-[#2a170f]/60 text-white font-mono text-[9px] px-2 py-1 backdrop-blur-sm"
              style={{ borderRadius: '2px' }}
              aria-live="polite"
            >
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div ref={thumbRef} className="overflow-hidden">
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onThumbClick(i)}
                aria-label={t('view_image_n', { n: i + 1 })}
                aria-pressed={i === selectedIndex}
                className={`relative flex-[0_0_22%] aspect-square overflow-hidden transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c] flex-shrink-0 ${
                  i === selectedIndex
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
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}