import CatalogoContent from './CatalogoContent'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    difficulty?: string
    players?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lacasadelosjuegos.com'
  const canonical = `${siteUrl}/${locale}/catalogo`
  const title = 'Catálogo de juegos de mesa, puzzles y ajedrez'
  const description = 'Descubre nuestra selección de juegos de mesa, puzzles, ajedrez y curiosidades lúdicas de todo el mundo. Envío rápido a España.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: `${siteUrl}/es/catalogo`,
        en: `${siteUrl}/en/catalogo`,
        ca: `${siteUrl}/cat/catalogo`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Catálogo La Casa de los Juegos' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
    },
  }
}

export default async function CatalogoPage({ params: routeParams, searchParams }: Props) {
  const { locale } = await routeParams
  const params = await searchParams
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lacasadelosjuegos.com'
  const t = await getTranslations('common')

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogo',
        item: `${siteUrl}/${locale}/catalogo`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen bg-[#fff8f6] flex items-center justify-center">
          <p className="font-headline italic text-[#717a6f] text-xl">{t('loading')}</p>
        </div>
      }>
        <CatalogoContent
          initialSearchParams={params}
          userId={user?.id ?? null}
          favoriteIds={favoriteIds}
        />
      </Suspense>
    </>
  )
}