import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { routing } from '@/i18n/routing'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!

type Locale = (typeof routing.locales)[number]

// ISO hreflang codes — 'cat' locale uses the standard code 'ca'
const hreflang: Record<Locale, string> = {
  es: 'es',
  en: 'en',
  cat: 'ca',
}

function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [
        hreflang[locale],
        `${BASE_URL}/${locale}${path}`,
      ])
    ) as Record<string, string>,
  }
}

function staticEntry(
  path: string,
  opts: {
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
    lastModified?: Date
  }
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: buildAlternates(path),
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Rutas estáticas ────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    // Home
    ...staticEntry('', {
      changeFrequency: 'weekly',
      priority: 1,
    }),
    // Catálogo
    ...staticEntry('/catalogo', {
      changeFrequency: 'daily',
      priority: 0.9,
    }),
    // Historia
    ...staticEntry('/historia', {
      changeFrequency: 'monthly',
      priority: 0.6,
    }),
  ]

  // ── Productos dinámicos ────────────────────────────────────
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('active', true)
    .order('updated_at', { ascending: false })

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).flatMap(
    (product) =>
      routing.locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/producto/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: buildAlternates(`/producto/${product.slug}`),
      }))
  )

  return [...staticRoutes, ...productRoutes]
}
