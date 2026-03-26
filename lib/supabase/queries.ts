import type { Category, Product } from '@/types'

import { createClient } from '@/lib/supabase/client'

// ── CATEGORÍAS ──────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('categories')
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

    // Ordenación
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
        .from('products')
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
        .from('products')
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
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('active', true)
        .single()

    if (error) { console.error('getProductBySlug:', error); return null }
    return data
}

// ── PRODUCTOS DESTACADOS ────────────────────────────────────
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
    return getProducts({ featured: true, limit })
}

// ── PRODUCTOS RELACIONADOS ──────────────────────────────────
export async function getRelatedProducts(
    categoryId: string,
    excludeId: string,
    limit = 4
): Promise<Product[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('active', true)
        .eq('category_id', categoryId)
        .neq('id', excludeId)
        .limit(limit)

    if (error) { console.error('getRelatedProducts:', error); return [] }
    return data ?? []
}

// ── PRODUCTO POR CATEGORÍA ──────────────────────────────────
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