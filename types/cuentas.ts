// ============================================================
// TIPOS
// ============================================================
 
export type Favorite = {
  id: string
  product_id: string
  created_at: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_price: number | null
    images: string[]
    badge: string | null
    stock: number
  }
}
 
export type Review = {
  id: string
  user_id: string
  product_id: string
  rating: number
  titulo: string | null
  contenido: string | null
  verified_purchase: boolean
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    slug: string
    images: string[]
  }
  profile?: {
    nombre: string | null
  }
}