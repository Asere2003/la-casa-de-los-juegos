import type { Category, Product } from '@/types'
import type { Favorite, Review } from '@/types/cuentas'

import { createClient } from '@/lib/supabase/client'

// ── CATEGORÍAS ──────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('categories_with_count')
        .select('*')
        .order('name')

    if (error) { console.error('getCategories:', error); return [] }
    return data ?? []
}

// Auxiliar para aplicar filtros y ordenación a queries de productos
async function applyProductFilters(query: any, filters?: {
    category?: string
    difficulty?: string
    minPrice?: number
    maxPrice?: number
    players?: number
    search?: string
    sort?: string
    featured?: boolean
    limit?: number
}) {
    if (filters?.category) {
        const supabase2 = createClient()
        const { data: cat } = await supabase2
            .from('categories')
            .select('id')
            .eq('slug', filters.category)
            .single()
        if (cat) query = query.eq('category_id', cat.id)
    }
    if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty)
    if (filters?.minPrice) query = query.gte('price', filters.minPrice)
    if (filters?.maxPrice) query = query.lte('price', filters.maxPrice)
    if (filters?.featured) query = query.eq('featured', true)
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`)
    if (filters?.players) {
        query = query
            .lte('min_players', filters.players)
            .gte('max_players', filters.players)
    }
    if (filters?.limit) query = query.limit(filters.limit)

    switch (filters?.sort) {
        case 'price_asc': query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'popular': query = query.order('featured', { ascending: false }); break
        default: query = query.order('created_at', { ascending: false })
    }
    return query
}

// ── PRODUCTOS ───────────────────────────────────────────────
export async function getProducts(filters?: {
    category?: string
    difficulty?: string
    minPrice?: number
    maxPrice?: number
    players?: number
    search?: string
    sort?: string
    featured?: boolean
    limit?: number
}): Promise<Product[]> {
    const supabase = createClient()
    let query = supabase
        .from('products_with_stats')   // ← cambiado
        .select('*, category:categories(*)')
        .eq('active', true)
    query = await applyProductFilters(query, filters)
    const { data, error } = await query
    if (error) { console.error('getProducts:', error); return [] }
    return data ?? []
}

// ── PRODUCTOS NUEVAS CURIOSIDADES ───────────────────────────────
export async function getProductsNewCuriosities(filters?: {
    category?: string
    difficulty?: string
    minPrice?: number
    maxPrice?: number
    players?: number
    search?: string
    sort?: string
    featured?: boolean
    limit?: number
}): Promise<Product[]> {
    const supabase = createClient()
    let query = supabase
        .from('products_with_stats')   // ← cambiado
        .select('*, category:categories(*)')
        .eq('active', true)
        .gt('stock', 0)
    query = await applyProductFilters(query, filters)
    const { data, error } = await query
    if (error) { console.error('getProducts:', error); return [] }
    return data ?? []
}

// ── PRODUCTO POR SLUG ───────────────────────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('products_with_stats')   // ← cambiado
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('active', true)
        .single()

    if (error) { console.error('getProductBySlug:', error); return null }
    return data
}

// ── PRODUCTOS DESTACADOS ────────────────────────────────────
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
    return getProducts({ featured: true, limit })  // hereda products_with_stats
}

// ── PRODUCTOS RELACIONADOS ──────────────────────────────────
export async function getRelatedProducts(
    categoryId: string,
    excludeId: string,
    limit = 4
): Promise<Product[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('products_with_stats')   // ← cambiado
        .select('*, category:categories(*)')
        .eq('active', true)
        .eq('category_id', categoryId)
        .neq('id', excludeId)
        .limit(limit)

    if (error) { console.error('getRelatedProducts:', error); return [] }
    return data ?? []
}

// ── PRODUCTO POR CATEGORÍA ──────────────────────────────────
// Esta NO necesita stats (no se usa en cards), se deja igual
export async function getProductsByCategory(
    categorySlug: string,
    limit?: number
): Promise<Product[]> {
    const supabase = createClient()

    let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('active', true)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false })

    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) { console.error('getProductsByCategory:', error); return [] }
    return data ?? []
}

// ============================================================
// FAVORITOS
// ============================================================

export async function getFavorites(userId: string): Promise<Favorite[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      product_id,
      created_at,
      product:products (
        id, name, slug, price, compare_price, images, badge, stock
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) { console.error('getFavorites:', error); return [] }
  return (data ?? []) as unknown as Favorite[]
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)

  if (error) { console.error('getFavoriteIds:', error); return [] }
  return (data ?? []).map(f => f.product_id)
}

export async function addFavorite(userId: string, productId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId })

  if (error) { console.error('addFavorite:', error); return false }
  return true
}

export async function removeFavorite(userId: string, productId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) { console.error('removeFavorite:', error); return false }
  return true
}

// ============================================================
// RESEÑAS
// ============================================================

export async function getUserReviews(userId: string): Promise<Review[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      product:products (id, name, slug, images)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) { console.error('getUserReviews:', error); return [] }
  return (data ?? []) as unknown as Review[]
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) { console.error('getProductReviews:', error); return [] }
  return (data ?? []) as unknown as Review[]
}

export async function upsertReview(review: {
  user_id: string
  product_id: string
  rating: number
  titulo?: string
  contenido?: string
}): Promise<Review | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .upsert(review, { onConflict: 'user_id,product_id' })
    .select()
    .single()

  if (error) { console.error('upsertReview:', error); return null }
  return data as Review
}

export async function deleteReview(userId: string, reviewId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId)

  if (error) { console.error('deleteReview:', error); return false }
  return true
}

export async function hasPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('order_items')
    .select('id, order:orders!inner(user_id, status)')
    .eq('product_id', productId)
    .eq('order.user_id', userId)
    .in('order.status', ['entregado', 'enviado'])
    .limit(1)

  if (error) { console.error('hasPurchasedProduct:', error); return false }
  return (data ?? []).length > 0
}