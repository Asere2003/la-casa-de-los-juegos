import CatalogoContent from './CatalogoContent'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

interface Props {
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

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams
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

  return (
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
  )
}