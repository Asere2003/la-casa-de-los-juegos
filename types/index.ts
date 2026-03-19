// ============================================================
// LA CASA DE LOS JUEGOS — TypeScript Types
// ============================================================

// ── Categoría ──
export interface Category {
  id: string
  name: string
  slug: string
  emoji: string
  color: string
  description?: string
  created_at: string
}

// ── Producto ──
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_price?: number       // precio tachado
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
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

// ── Perfil de usuario ──
export interface Profile {
  id: string
  full_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// ── Dirección ──
export interface Address {
  id: string
  user_id: string
  name: string
  full_name: string
  line1: string
  line2?: string
  city: string
  province: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

// ── Carrito ──
export interface CartItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
  quantity: number
  created_at: string
}

// Carrito local (sin login)
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
  shipping_address: Address
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
