'use client'

import { CldImage } from 'next-cloudinary'
import Image from 'next/image'

interface Props {
  src: string           // public_id de Cloudinary O URL externa
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  quality?: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'auto'
}

// Detecta si es un public_id de Cloudinary o una URL externa
function isCloudinaryId(src: string): boolean {
  return !src.startsWith('http') && !src.startsWith('/')
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority = false,
  className = '',
  quality = 80,
  crop = 'fill',
}: Props) {

  // Si es public_id de Cloudinary → usamos CldImage con transformaciones
  if (isCloudinaryId(src)) {
    if (fill) {
      return (
        <CldImage
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          priority={priority}
          className={className}
          crop={crop}
          quality={quality}
          format="auto"
        />
      )
    }
    return (
      <CldImage
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        sizes={sizes}
        priority={priority}
        className={className}
        crop={crop}
        quality={quality}
        format="auto"
      />
    )
  }

  // Si es URL externa (mock data, Google, etc.) → Next.js Image normal
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
