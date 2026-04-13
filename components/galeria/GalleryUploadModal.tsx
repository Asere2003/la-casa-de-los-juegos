'use client'
// components/galeria/GalleryUploadModal.tsx

import type { GalleryCategory, GalleryPhoto } from '@/types/gallery'
import { useCallback, useRef, useState } from 'react'

import Image from 'next/image'

interface Props {
  onClose: () => void
  onSuccess: (photo: GalleryPhoto) => void
}

const CATEGORIES: { key: GalleryCategory; label: string }[] = [
  { key: 'general',   label: 'General'    },
  { key: 'tienda',    label: 'La tienda'  },
  { key: 'productos', label: 'Productos'  },
  { key: 'eventos',   label: 'Eventos'    },
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function GalleryUploadModal({ onClose, onSuccess }: Props) {
  const [file, setFile]           = useState<File | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [progress, setProgress]   = useState(0)

  const [caption, setCaption]   = useState('')
  const [altText, setAltText]   = useState('')
  const [category, setCategory] = useState<GalleryCategory>('general')
  const [tags, setTags]         = useState('')
  const [featured, setFeatured] = useState(false)
  const [visible, setVisible]   = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Solo se aceptan imágenes (JPG, PNG, WebP, etc.)')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('El archivo supera el límite de 10 MB')
      return
    }
    setError(null)
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const handleSubmit = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    setProgress(10)

    try {
      const signRes = await fetch('/api/gallery/sign', { method: 'POST' })
      if (!signRes.ok) throw new Error('Error al generar firma')
      const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json()
      setProgress(20)

      const cloudinaryForm = new FormData()
      cloudinaryForm.append('file', file)
      cloudinaryForm.append('api_key', apiKey)
      cloudinaryForm.append('timestamp', timestamp)
      cloudinaryForm.append('folder', folder)
      cloudinaryForm.append('signature', signature)

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: cloudinaryForm }
      )
      setProgress(80)

      if (!cloudinaryRes.ok) {
        const err = await cloudinaryRes.json()
        throw new Error(err.error?.message ?? 'Error en Cloudinary')
      }

      const { secure_url, width, height } = await cloudinaryRes.json()
      setProgress(90)

      const saveRes = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: secure_url,
          width,
          height,
          caption,
          alt_text: altText,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          featured,
          visible,
        }),
      })

      if (!saveRes.ok) {
        const err = await saveRes.json()
        throw new Error(err.error ?? 'Error al guardar en base de datos')
      }

      const data = await saveRes.json()
      setProgress(100)
      onSuccess(data.photo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fff8f6] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ borderRadius: '2px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#c0c9bc]/30">
          <h2 className="font-['Noto_Serif'] text-xl text-[#004317]">
            Subir nueva foto
          </h2>
          <button
            onClick={onClose}
            className="text-[#2a170f]/40 hover:text-[#2a170f] transition-colors text-2xl leading-none p-1 -mr-1"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Drop zone */}
          {!preview ? (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-sm py-10 px-6 text-center cursor-pointer transition-all
                ${isDragging
                  ? 'border-[#004317] bg-[#004317]/5'
                  : 'border-[#c0c9bc]/60 hover:border-[#004317]/40'
                }
              `}
            >
              <div className="text-4xl mb-3">📷</div>
              <p className="font-body italic text-[#2a170f] mb-1">
                Arrastra una imagen aquí
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#717a6f]">
                o haz clic para seleccionar — máx. 10 MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }}
              />
            </div>
          ) : (
            <div className="relative overflow-hidden" style={{ borderRadius: '2px' }}>
              <Image
                src={preview}
                alt="Preview"
                width={600}
                height={300}
                className="w-full object-cover"
                style={{ height: '220px' }}
              />
              <button
                onClick={() => { setFile(null); setPreview(null) }}
                className="absolute top-2 right-2 bg-black/70 text-white font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 hover:bg-black/90 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Cambiar
              </button>
            </div>
          )}

          {/* Campos */}
          <div className="space-y-4">
            <div>
              <label className="section-label block mb-1.5">
                Descripción (caption)
              </label>
              <input
                className="input-base"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Una descripción de la foto..."
              />
            </div>

            <div>
              <label className="section-label block mb-1.5">
                Texto alternativo (SEO / accesibilidad)
              </label>
              <input
                className="input-base"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="Describe lo que se ve en la imagen..."
              />
            </div>

            <div>
              <label className="section-label block mb-1.5">
                Categoría
              </label>
              <select
                className="input-base cursor-pointer"
                value={category}
                onChange={e => setCategory(e.target.value as GalleryCategory)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="section-label block mb-1.5">
                Tags (separados por comas)
              </label>
              <input
                className="input-base"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="ajedrez, tablero, colección..."
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-body italic text-sm text-[#2a170f]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#c9a84c]"
                />
                Destacada ★
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-body italic text-sm text-[#2a170f]">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={e => setVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#004317]"
                />
                Visible al público
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-[#b91c1c]/8 border border-[#b91c1c]/25 font-mono text-[10px] uppercase tracking-wide text-[#b91c1c]" style={{ borderRadius: '2px' }}>
              {error}
            </div>
          )}

          {/* Progreso */}
          {uploading && (
            <div>
              <div className="h-[3px] bg-[#c0c9bc]/30 overflow-hidden" style={{ borderRadius: '2px' }}>
                <div
                  className="h-full bg-[#c9a84c] transition-all duration-300"
                  style={{ width: `${progress}%`, borderRadius: '2px' }}
                />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#717a6f] mt-2 text-center">
                Subiendo a Cloudinary…
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={onClose}
              disabled={uploading}
              className="font-mono text-[9px] uppercase tracking-[0.18em] px-5 py-2.5 border border-[#c0c9bc]/60 text-[#2a170f]/70 hover:border-[#2a170f]/40 hover:text-[#2a170f] transition-colors disabled:opacity-40"
              style={{ borderRadius: '2px' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:rotate-0 disabled:hover:bg-[#004317]"
            >
              {uploading ? 'Subiendo…' : 'Subir foto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
