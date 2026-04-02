// ============================================================
// LA CASA DE LOS JUEGOS — TypeScript Types
// ============================================================

// ── Categoría ──
export interface Category  {
  id: string
  name: string
  name_en: string
  name_cat: string
  slug: string
  emoji: string
  key: string
  product_count: number
  created_at: string
}

// ── Producto ──
export interface Product {
  id: string
  name: string
  name_en?: string
  name_cat?: string
  slug: string
  description?: string
  description_en?: string
  description_cat?: string
  price: number
  compare_price?: number
  stock: number
  sku?: string
  category_id?: string
  category?: Category
  images: string[]
  difficulty?: 'familiar' | 'medio' | 'avanzado' | 'experto'
  min_players?: number
  max_players?: number
  min_age?: number
  duration_min?: number
  material?: string
  origin?: string
  badge?: 'nuevo' | 'agotandose' | 'ultimas-unidades' | 'oferta'
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  avg_rating?: number
  review_count?: number
}

// ── Perfil de usuario ──
export interface Profile {
  id: string
  nombre?: string
  telefono?: string
  direccion?: string
  ciudad?: string
  codigo_postal?: string
  pais?: string
  role: string
  created_at: string
  updated_at: string
}

// ── Carrito local (sin login) ──
export interface LocalCartItem {
  product: Product
  quantity: number
}

// ── Pedido ──
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  subtotal: number
  shipping_cost: number
  stripe_payment_id?: string
  stripe_session_id?: string
  shipping_address: {
    nombre: string
    direccion: string
    ciudad: string
    codigo_postal: string
    pais: string
  }
  notes?: string
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_snapshot: Partial<Product>
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

// ── Reseña ──
export interface Review {
  id: string
  product_id: string
  user_id: string
  profile?: Profile
  rating: number
  title?: string
  body?: string
  verified: boolean
  created_at: string
}

// ── Filtros del catálogo ──
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  difficulty?: string
  players?: number
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
}

// ── Respuestas API ──
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// ── Checkout ──
export interface CheckoutSession {
  sessionId: string
  url: string
}

export interface CheckoutItem {
  productId: string
  quantity: number
}