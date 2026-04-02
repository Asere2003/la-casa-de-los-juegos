export type CategoryItem = {
  emoji: string
  label: string
  slug: string
  hoverBg?: string
}

export type ProductCardItem = {
  id: string
  name: string
  slug: string
  price: number
  description: string
  image: string
  category?: string
  badgeBg?: string
  tag?: string | null
  tagBg?: string
  featured?: boolean
  avg_rating?: number
  review_count?: number
}

export type AudienceGroupItem = {
  label: string
  sub: string
  borderColor: string
  emoji: string
}