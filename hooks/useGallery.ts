// hooks/useGallery.ts
// Hook SWR para la galería pública — con paginación y filtros

import type { GalleryCategory, GalleryResponse } from '@/types/gallery'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useGallery(category?: GalleryCategory | 'all', page = 1, pageSize = 24) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))

  const { data, error, isLoading, mutate } = useSWR<GalleryResponse>(
    `/api/gallery?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    photos: data?.photos ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    isError: !!error,
    mutate,
  }
}