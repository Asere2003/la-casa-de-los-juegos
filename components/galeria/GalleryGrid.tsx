'use client'
// components/galeria/GalleryGrid.tsx
// Grid masonry con filtros por categoría y lightbox integrado

import type { GalleryCategory } from '@/types/gallery'
import { GalleryLightbox } from './GalleryLightbox'
import Image from 'next/image'
import { useGallery } from '@/hooks/useGallery'
import { useState } from 'react'

const CATEGORIES: { key: GalleryCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'tienda', label: 'La tienda' },
  { key: 'productos', label: 'Productos' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'general', label: 'General' },
]

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const { photos, isLoading, hasMore, total } = useGallery(activeCategory, page, 24)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevPhoto = () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))
  const nextPhoto = () => setLightboxIndex(i => (i !== null && i < photos.length - 1 ? i + 1 : i))

  const handleCategoryChange = (cat: GalleryCategory | 'all') => {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <div>
      {/* Filtros de categoría */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`
              font-mono text-[9px] uppercase tracking-[0.18em] px-4 py-2 transition-all
              focus-visible:ring-2 focus-visible:ring-[#c9a84c] outline-none
              ${activeCategory === cat.key
                ? 'bg-[#004317] text-white border border-[#004317]'
                : 'bg-transparent text-[#2a170f]/60 border border-[#c0c9bc]/50 hover:border-[#004317]/40 hover:text-[#2a170f]'
              }
            `}
            style={{ borderRadius: '2px' }}
          >
            {cat.label}
          </button>
        ))}
        {total > 0 && (
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-[#717a6f]">
            {total} foto{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Estado vacío */}
      {!isLoading && photos.length === 0 && (
        <div className="text-center py-24 font-body italic text-[#717a6f]">
          No hay fotos en esta categoría todavía.
        </div>
      )}

      {/* Grid masonry con columnas CSS */}
      {photos.length > 0 && (
        <div
          style={{
            columns: 'var(--gallery-cols, 3)',
            columnGap: '12px',
            ['--gallery-cols' as string]: '3',
          }}
          className="gallery-masonry"
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="gallery-item"
              style={{
                breakInside: 'avoid',
                marginBottom: '12px',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '2px',
                position: 'relative',
              }}
              onClick={() => openLightbox(index)}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                  src={photo.thumbnail_url ?? photo.url}
                  alt={photo.alt_text ?? photo.caption ?? 'Foto de la galería'}
                  width={photo.width ?? 600}
                  height={photo.height ?? 400}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                  className="gallery-img"
                />

                {/* Overlay hover */}
                <div
                  className="gallery-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,67,23,0.85) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px',
                  }}
                >
                  {photo.caption && (
                    <p
                      style={{
                        color: '#fff8f6',
                        fontFamily: 'Newsreader, serif',
                        fontStyle: 'italic',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {photo.caption}
                    </p>
                  )}
                </div>

                {/* Badge featured */}
                {photo.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#c9a84c',
                      color: '#fff8f6',
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    ★
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skeleton loading */}
      {isLoading && (
        <div className="gallery-masonry" style={{ columnGap: '12px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                breakInside: 'avoid',
                marginBottom: '12px',
                borderRadius: '2px',
                background: 'rgba(44,24,16,0.06)',
                height: i % 3 === 0 ? '280px' : i % 3 === 1 ? '200px' : '240px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Cargar más */}
      {hasMore && !isLoading && (
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-3 border border-[#c0c9bc]/60 text-[#2a170f] font-headline italic px-10 py-4 hover:border-[#004317] hover:text-[#004317] hover:bg-[#fff1ec] transition-all focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            style={{ borderRadius: '2px' }}
          >
            Cargar más fotos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      {/* CSS para hover y responsive masonry */}
      <style jsx global>{`
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        .gallery-item:hover .gallery-img {
          transform: scale(1.04);
        }
        .gallery-masonry {
          --gallery-cols: 3;
        }
        @media (max-width: 768px) {
          .gallery-masonry {
            --gallery-cols: 2;
          }
        }
        @media (max-width: 480px) {
          .gallery-masonry {
            --gallery-cols: 1;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}