'use client'
// app/[locale]/admin/galeria/AdminGaleriaClient.tsx

import type { GalleryCategory, GalleryPhotoAdmin } from '@/types/gallery'

import { GalleryUploadModal } from '@/components/galeria/GalleryUploadModal'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  initialPhotos: GalleryPhotoAdmin[]
}

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  general: 'General',
  tienda: 'La tienda',
  productos: 'Productos',
  eventos: 'Eventos',
}

const FILTERS = [
  { key: 'all' as const,        label: 'Todas'      },
  { key: 'general' as const,    label: 'General'    },
  { key: 'tienda' as const,     label: 'La tienda'  },
  { key: 'productos' as const,  label: 'Productos'  },
  { key: 'eventos' as const,    label: 'Eventos'    },
]

export function AdminGaleriaClient({ initialPhotos }: Props) {
  const [photos, setPhotos]           = useState<GalleryPhotoAdmin[]>(initialPhotos)
  const [showUpload, setShowUpload]   = useState(false)
  const [filter, setFilter]           = useState<GalleryCategory | 'all'>('all')
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [togglingId, setTogglingId]   = useState<string | null>(null)
  const [notification, setNotification] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const notify = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.category === filter)

  const handleUploadSuccess = (newPhoto: any) => {
    setPhotos(prev => [newPhoto, ...prev])
    setShowUpload(false)
    notify('Foto subida correctamente')
  }

  const handleToggleVisible = async (photo: GalleryPhotoAdmin) => {
    setTogglingId(photo.id)
    try {
      const res = await fetch(`/api/gallery/${photo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !photo.visible }),
      })
      if (!res.ok) throw new Error()
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, visible: !p.visible } : p))
      notify(photo.visible ? 'Foto ocultada' : 'Foto visible al público')
    } catch {
      notify('Error al actualizar', 'err')
    } finally {
      setTogglingId(null)
    }
  }

  const handleToggleFeatured = async (photo: GalleryPhotoAdmin) => {
    try {
      const res = await fetch(`/api/gallery/${photo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !photo.featured }),
      })
      if (!res.ok) throw new Error()
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, featured: !p.featured } : p))
      notify(photo.featured ? 'Quitada de destacadas' : 'Añadida a destacadas ★')
    } catch {
      notify('Error al actualizar', 'err')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta foto permanentemente?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setPhotos(prev => prev.filter(p => p.id !== id))
      notify('Foto eliminada')
    } catch {
      notify('Error al eliminar', 'err')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>

      {/* ── Cabecera ────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#004317]">
            Galería
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#717a6f] mt-1">
            {photos.length} foto{photos.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="btn-primary px-5 py-2 text-sm"
        >
          + Subir foto
        </button>
      </div>

      {/* ── Filtros ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => {
          const count = f.key === 'all' ? photos.length : photos.filter(p => p.category === f.key).length
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`
                font-mono text-[9px] uppercase tracking-[0.18em] px-4 py-2 transition-all
                focus-visible:ring-2 focus-visible:ring-[#c9a84c] outline-none
                ${filter === f.key
                  ? 'bg-[#004317] text-white border border-[#004317]'
                  : 'bg-transparent text-[#2a170f]/60 border border-[#c0c9bc]/50 hover:border-[#004317]/40 hover:text-[#2a170f]'
                }
              `}
              style={{ borderRadius: '2px' }}
            >
              {f.label} ({count})
            </button>
          )
        })}
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-24 font-body italic text-[#717a6f]">
          No hay fotos en esta categoría. Sube la primera.
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              className={`
                bg-white border border-[#c0c9bc]/40 overflow-hidden transition-opacity
                ${photo.visible ? 'opacity-100' : 'opacity-55'}
              `}
              style={{ borderRadius: '2px' }}
            >
              {/* Imagen */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={photo.thumbnail_url ?? photo.url}
                  alt={photo.alt_text ?? ''}
                  fill
                  className="object-cover"
                />
                {/* Badges */}
                <div className="absolute top-1.5 left-1.5 flex gap-1">
                  {photo.featured && (
                    <span className="bg-[#c9a84c] text-[#2a170f] font-mono text-[8px] uppercase tracking-wide px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
                      ★ Dest.
                    </span>
                  )}
                  {!photo.visible && (
                    <span className="bg-black/60 text-white font-mono text-[8px] uppercase tracking-wide px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
                      Oculta
                    </span>
                  )}
                </div>
                <div className="absolute bottom-1.5 right-1.5">
                  <span className="bg-black/60 text-white font-mono text-[8px] uppercase tracking-wide px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
                    {CATEGORY_LABELS[photo.category]}
                  </span>
                </div>
              </div>

              {/* Info y acciones */}
              <div className="p-3">
                {photo.caption && (
                  <p className="font-body italic text-sm text-[#2a170f] mb-1.5 leading-snug">
                    {photo.caption.length > 60 ? photo.caption.slice(0, 60) + '…' : photo.caption}
                  </p>
                )}
                <p className="font-mono text-[9px] uppercase tracking-wide text-[#717a6f] mb-3">
                  {new Date(photo.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                {/* Botones */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleToggleVisible(photo)}
                    disabled={togglingId === photo.id}
                    title={photo.visible ? 'Ocultar' : 'Publicar'}
                    className="font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 border border-[#c0c9bc]/60 text-[#2a170f]/70 hover:border-[#004317] hover:text-[#004317] transition-colors disabled:opacity-40"
                    style={{ borderRadius: '2px' }}
                  >
                    {photo.visible ? 'Ocultar' : 'Publicar'}
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(photo)}
                    title={photo.featured ? 'Quitar destacada' : 'Destacar'}
                    className="font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 border border-[#c0c9bc]/60 text-[#2a170f]/70 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                    style={{ borderRadius: '2px' }}
                  >
                    {photo.featured ? '★' : '☆'}
                  </button>

                  <button
                    onClick={() => handleDelete(photo.id)}
                    disabled={deletingId === photo.id}
                    title="Eliminar"
                    className="font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 border border-[#c0c9bc]/60 text-[#b91c1c]/60 hover:border-[#b91c1c] hover:text-[#b91c1c] transition-colors disabled:opacity-40 ml-auto"
                    style={{ borderRadius: '2px' }}
                  >
                    {deletingId === photo.id ? '…' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal de subida ─────────────────────────────────── */}
      {showUpload && (
        <GalleryUploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────── */}
      {notification && (
        <div
          className={`
            fixed bottom-6 right-6 z-[100]
            font-mono text-[11px] uppercase tracking-wide text-white
            px-5 py-3 shadow-lg
            ${notification.type === 'ok' ? 'bg-[#004317]' : 'bg-[#b91c1c]'}
          `}
          style={{ borderRadius: '2px', animation: 'slideIn 0.2s ease' }}
        >
          {notification.msg}
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(12px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
