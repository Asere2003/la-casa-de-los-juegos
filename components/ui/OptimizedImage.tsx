// components/ui/OptimizedImage.tsx

import { CldImage } from 'next-cloudinary'

interface Props {
  src: string  // ID de Cloudinary o URL externa
  alt: string
  width: number
  height: number
  priority?: boolean
  effects?: 'vintage' | 'modern' | 'artistic'
}

export default function OptimizedImage({ 
  src, alt, width, height, priority, effects 
}: Props) {
  const vintageEffects = [
    { sepia: '70' },
    { grayscale: true },
    { contrast: '125' },
    { brightness: '-10' }
  ]
  
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      property={priority ? 'priority' : undefined}
      effects={effects === 'vintage' ? vintageEffects : undefined}
      sizes="(max-width: 768px) 100vw, 50vw"
      format="auto"
      quality="auto"
    />
  )
}