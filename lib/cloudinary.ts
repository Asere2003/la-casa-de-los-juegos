// lib/cloudinary.ts
// Utilidades para subir imágenes a Cloudinary desde el admin

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
  secure:      true,
})

// Subir imagen de producto
export async function uploadProductImage(
  file: string | Buffer,    // base64 o buffer
  productSlug: string,
): Promise<{ public_id: string; url: string }> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
    {
      folder:         `lacasadelosjuegos/productos/${productSlug}`,
      use_filename:   true,
      unique_filename: true,
      overwrite:      false,
      // Transformación automática al subir
      transformation: [
        { width: 1200, height: 1600, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    }
  )
  return {
    public_id: result.public_id,
    url:       result.secure_url,
  }
}

// Eliminar imagen
export async function deleteProductImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

// Generar URL optimizada para distintos tamaños
export function getOptimizedUrl(publicId: string, options: {
  width?:  number
  height?: number
  crop?:   string
  quality?: number
}) {
  return cloudinary.url(publicId, {
    width:       options.width,
    height:      options.height,
    crop:        options.crop   || 'fill',
    quality:     options.quality || 'auto',
    fetch_format:'auto',
    secure:      true,
  })
}

export default cloudinary
