// types/gallery.ts
// Tipos compartidos para el sistema de galería

export type GalleryCategory = 'general' | 'tienda' | 'eventos' | 'productos'
export type GallerySourceRole = 'admin' | 'user'

export interface GalleryPhoto {
  id: string
  url: string
  thumbnail_url: string | null
  width: number | null
  height: number | null
  caption: string | null
  alt_text: string | null
  category: GalleryCategory
  tags: string[]
  featured: boolean
  display_order: number
  created_at: string
}

// Versión completa (admin)
export interface GalleryPhotoAdmin extends GalleryPhoto {
  uploaded_by: string | null
  source_role: GallerySourceRole
  visible: boolean
  updated_at: string
}

// Payload para subir una foto
export interface GalleryUploadPayload {
  url: string
  thumbnail_url?: string
  width?: number
  height?: number
  caption?: string
  alt_text?: string
  category?: GalleryCategory
  tags?: string[]
  featured?: boolean
  visible?: boolean
}

// Payload para editar una foto
export interface GalleryUpdatePayload {
  caption?: string
  alt_text?: string
  category?: GalleryCategory
  tags?: string[]
  featured?: boolean
  visible?: boolean
  display_order?: number
}

// Respuesta paginada de la API
export interface GalleryResponse {
  photos: GalleryPhoto[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Filtros para la galería pública
export interface GalleryFilters {
  category?: GalleryCategory | 'all'
  page?: number
  pageSize?: number
}