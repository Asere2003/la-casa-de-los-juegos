import { getCategories, getFeaturedProducts, getProductsNewCuriosities } from '@/lib/supabase/queries'

import AudienceGrid from '@/components/home/AudienceGrid'
import BestsellersSection from '@/components/home/BestsellersSection'
import CategoryScroller from '@/components/home/CategoryScroller'
import EditorialBanner from '@/components/home/EditorialBanner'
import HeroSection from '@/components/home/HeroSection'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('home')
  return {
    title: 'La Casa de los Juegos — Granada',
    description: t('hero_subtitle'),
  }
}

export default async function HomePage() {
  const tHome = await getTranslations('home')

  const [newArrivalsRaw, bestsellersRaw, categories] = await Promise.all([
    getProductsNewCuriosities({ sort: 'newest', limit: 4 }),
    getFeaturedProducts(3),
    getCategories(),
  ])

  // Usuario y favoritos
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let favoriteIds: string[] = []
  if (user) {
    const { data } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id)
    favoriteIds = (data ?? []).map(f => f.product_id)
  }

  const newArrivals = newArrivalsRaw.map(p => ({
    id:          p.id,
    name:        p.name,
    slug:        p.slug,
    price:       p.price,
    category:    p.category?.name ?? '',
    badgeBg:     getCategoryColor(p.category?.slug ?? ''),
    tag:         getBadgeLabel(p.badge),
    description: p.description ?? '',
    image:       p.images?.[0] ?? '',
  }))

  const bestsellers = bestsellersRaw.map(p => ({
    id:          p.id,
    name:        p.name,
    slug:        p.slug,
    price:       p.price,
    description: p.description ?? '',
    tag:         getBadgeLabel(p.badge),
    tagBg:       p.badge === 'ultimas-unidades' ? '#ba1a1a' : undefined,
    featured:    p.featured,
    image:       p.images?.[0] ?? '',
  }))

  const audienceGroups = [
    { label: tHome('age_kids'),   sub: tHome('age_kids_sub'),   borderColor: '#755b00', emoji: '👶' },
    { label: tHome('age_family'), sub: tHome('age_family_sub'), borderColor: '#1a5c2a', emoji: '👨‍👩‍👧' },
    { label: tHome('age_adults'), sub: tHome('age_adults_sub'), borderColor: '#805533', emoji: '🧠' },
    { label: tHome('age_expert'), sub: tHome('age_expert_sub'), borderColor: '#2c1810', emoji: '🏆' },
  ]

  return (
    <>
      <HeroSection image="inicio/hero-fondo-tienda-1" />
      <CategoryScroller items={categories} />
      <NewArrivalsSection
        items={newArrivals}
        userId={user?.id ?? null}
        favoriteIds={favoriteIds}
      />
      <EditorialBanner image="inicio/hero-tienda" />
      <BestsellersSection
        items={bestsellers}
        userId={user?.id ?? null}
        favoriteIds={favoriteIds}
      />
      <AudienceGrid items={audienceGroups} />
    </>
  )
}

function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    'ajedrez':     '#1c1c1c',
    'puzzles':     '#1a3a5c',
    'juegos-mesa': '#1a5c2a',
    'rol':         '#3d1a5c',
    'clasicos':    '#5c3d1a',
    'del-mundo':   '#1a4a5c',
    'cartas':      '#5c1a1a',
    'habilidad':   '#4a5c1a',
  }
  return colors[slug] ?? '#2a170f'
}

function getBadgeLabel(badge?: string | null): string | null {
  const labels: Record<string, string> = {
    'nuevo':            'Nuevo',
    'agotandose':       'Agotándose',
    'ultimas-unidades': 'Últimas Unidades',
    'oferta':           'Oferta',
  }
  return badge ? (labels[badge] ?? null) : null
}