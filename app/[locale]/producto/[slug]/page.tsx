import { getProductBySlug, getRelatedProducts } from '@/lib/supabase/queries'

import type { Metadata } from 'next'
import ProductActions from '@/components/producto/ProductActions'
import ProductBadges from '@/components/producto/ProductBadges'
import ProductDescription from '@/components/producto/ProductDescription'
import ProductGallery from '@/components/producto/ProductGallery'
import ProductInfo from '@/components/producto/ProductInfo'
import ProductMeta from '@/components/producto/ProductMeta'
import ProductReviews from '@/components/producto/ProductReviews'
import RelatedProducts from '@/components/producto/RelatedProducts'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug)
  const t = await getTranslations('common')

  if (!product) return { title: t('error') }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lacasadelosjuegos.com'
  const canonical = `${siteUrl}/${locale}/producto/${slug}`
  const title = `${product.name} | La Casa de los Juegos`
  const description = product.description?.slice(0, 160) ||
    `Compra ${product.name} en La Casa de los Juegos. Envío rápido a España.`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'es': `${siteUrl}/es/producto/${slug}`,
        'en': `${siteUrl}/en/producto/${slug}`,
        'ca': `${siteUrl}/cat/producto/${slug}`,
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'La Casa de los Juegos',
      images: product.images?.[0] ? [{
        url: product.images[0],
        width: 800,
        height: 800,
        alt: product.name,
      }] : [],
      type: 'website',
      locale: locale === 'cat' ? 'ca_ES' : locale === 'en' ? 'en_GB' : 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  // ← Obtener usuario y favorito
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isFavorite = false
  if (user) {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()
    console.log('favorites query:', data, 'user:', user.id, 'product:', product.id) // ← añade esto
    isFavorite = !!data

  }


  const related = product.category_id
    ? await getRelatedProducts(product.category_id, product.id, 4)
    : []

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <ProductMeta product={product} />
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ProductInfo
              product={product}
              userId={user?.id ?? null}
              isFavorite={isFavorite}
            />
            <ProductBadges product={product} />
            <ProductDescription description={product.description} />
            <ProductActions product={product} />
          </div>
        </div>
        <RelatedProducts products={related} currentSlug={slug} />
        <ProductReviews productId={product.id} />
      </div>
      <div className="h-20 md:h-0" aria-hidden="true" />
    </div>
  )
}