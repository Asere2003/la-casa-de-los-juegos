'use client'

import { useCallback, useState } from 'react'

import Image from 'next/image'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()
    
    img.onload = () => {
      // Máximo 1500px en el lado más largo
      const maxSize = 1500
      let { width, height } = img
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/webp' }))
          } else {
            resolve(file)
          }
        },
        'image/webp',
        0.85
      )
    }
    
    img.src = URL.createObjectURL(file)
  })
}

  async function uploadFile(file: File) {
    // 1. Pedir firma al servidor
    const sigRes = await fetch('/api/cloudinary-signature', { method: 'POST' })
    if (!sigRes.ok) throw new Error('Error al obtener firma')
    const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json()

    // 2. Subir a Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)
    formData.append('folder', folder)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!uploadRes.ok) throw new Error('Error al subir imagen')
    const data = await uploadRes.json()
    return data.secure_url as string
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        const compressed = await compressImage(file)
        const url = await uploadFile(compressed)
        urls.push(url)
      }
      onChange([...images, ...urls])
    } catch (err) {
      console.error(err)
      alert('Error al subir imagen. Revisa la consola.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function moveImage(from: number, to: number) {
    const next = [...images]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">

      {/* Imágenes actuales */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square">
              <Image
                src={url}
                alt={`Imagen ${i + 1}`}
                fill
                className="object-cover rounded border border-[#2c1810]/10"
              />

              {/* Badge principal */}
              {i === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-[#004317] text-white px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}

              {/* Acciones */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="text-white text-xs bg-white/20 hover:bg-white/40 px-2 py-1 rounded"
                    title="Mover a la izquierda"
                  >
                    ←
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="text-white text-xs bg-white/20 hover:bg-white/40 px-2 py-1 rounded"
                    title="Mover a la derecha"
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-white text-xs bg-red-500/70 hover:bg-red-500 px-2 py-1 rounded"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zona de subida */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
          dragOver
            ? 'border-[#004317] bg-[#004317]/10'
            : 'border-[#004317]/30 bg-[#004317]/5'
        }`}
      >
        {uploading ? (
          <div className="text-[#004317] text-sm">Subiendo imagen...</div>
        ) : (
          <>
            <p className="text-[#2c1810]/50 text-sm mb-3">
              Arrastra imágenes aquí o
            </p>
            <label className="btn-outline px-4 py-2 text-sm cursor-pointer">
              Seleccionar archivos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
            </label>
            <p className="text-xs text-[#2c1810]/30 mt-3">
              La primera imagen será la principal. Puedes reordenarlas.
            </p>
          </>
        )}
      </div>

    </div>
  )
}