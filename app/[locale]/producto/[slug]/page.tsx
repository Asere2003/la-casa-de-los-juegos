import { getProductBySlug, getRelatedProducts } from '@/lib/supabase/queries'

import type { Metadata } from 'next'
import ProductActions from '@/components/producto/ProductActions'
import ProductBadges from '@/components/producto/ProductBadges'
import ProductDescription from '@/components/producto/ProductDescription'
import ProductGallery from '@/components/producto/ProductGallery'
import ProductInfo from '@/components/producto/ProductInfo'
import ProductMeta from '@/components/producto/ProductMeta'
import RelatedProducts from '@/components/producto/RelatedProducts'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const t = await getTranslations('common')
  if (!product) return { title: t('error') }
  return {
    title: product.name,
    description: product.description?.split('\n')[0] || '',
    openGraph: {
      title: product.name,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

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
            <ProductInfo product={product} />
            <ProductBadges product={product} />
            <ProductDescription description={product.description} />
            <ProductActions product={product} />
          </div>
        </div>
        <RelatedProducts products={related} currentSlug={slug} />
      </div>
      <div className="h-20 md:h-0" aria-hidden="true" />
    </div>
  )
}