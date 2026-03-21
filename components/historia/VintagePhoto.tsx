'use client'

import { CldImage } from 'next-cloudinary'

interface VintagePhotoProps {
  src: string
  alt: string
  caption: string
  rotate?: 'left' | 'right' | 'none'
  size?: 'small' | 'medium' | 'large'
  width?: number
  height?: number
}

export default function VintagePhoto({ 
  src, 
  alt, 
  caption, 
  rotate = 'none',
  size = 'medium',
  width = 800,
  height = 600
}: VintagePhotoProps) {
  const rotations = {
    left: '-rotate-2',
    right: 'rotate-2',
    none: ''
  }

  const sizes = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl'
  }

  // Efectos vintage aplicados en servidor por Cloudinary
  const vintageEffects = [
    // { sepia: '70' },
    { grayscale: true },
    // { contrast: '125' },
    // { brightness: '-10' }
  ]

  return (
    <div 
      className={`relative ${sizes[size]} mx-auto`}
      role="figure"
      aria-label={caption}
    >
      <div 
        className={`
          bg-surface-container-low p-4 shadow-2xl 
          ${rotations[rotate]} 
          hover:rotate-0 transition-transform duration-500 
          border border-outline-variant/10
        `}
      >
        <CldImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          effects={vintageEffects }
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          format="auto"
          quality="auto"
          className="w-full h-auto"
          deliveryType={src.startsWith('http') ? 'fetch' : 'upload'}
        />
        <p className="font-body italic text-sm mt-4 text-center text-secondary">
          {caption}
        </p>
      </div>
      <div 
        className="absolute -z-10 top-4 left-4 right-0 bottom-0 bg-tertiary/10 rounded-sm"
        aria-hidden="true"
      />
    </div>
  )
}
