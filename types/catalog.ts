export type CatalogSearchParams = {
  category?: string
  age?: string
  sort?: string
}

export interface CatalogFilters {
  category:   string
  minPrice:   number
  maxPrice:   number
  difficulty: string
  players:    string
  search:     string
  sort:       string
}

export type CatalogProduct = {
  id: string
  name: string
  slug: string
  price: number
  description: string
  image: string
  category: string
  categorySlug: string
  badgeBg?: string
  ageTags?: string[]
  featured?: boolean
  inStock?: boolean
  isNew?: boolean
}