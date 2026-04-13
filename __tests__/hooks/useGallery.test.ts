// __tests__/hooks/useGallery.test.ts

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('swr', () => ({
  default: vi.fn(),
}))

import useSWR from 'swr'
import { useGallery } from '@/hooks/useGallery'

describe('useGallery', () => {
  beforeEach(() => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as any)
  })

  it('calls useSWR with correct URL when category is "all"', () => {
    renderHook(() => useGallery('all', 1, 24))
    expect(useSWR).toHaveBeenCalledWith(
      '/api/gallery?page=1&pageSize=24',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('calls useSWR without category param when category is "all"', () => {
    renderHook(() => useGallery('all', 2, 12))
    expect(useSWR).toHaveBeenCalledWith(
      '/api/gallery?page=2&pageSize=12',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('includes category param when category is specific', () => {
    renderHook(() => useGallery('tienda', 1, 24))
    expect(useSWR).toHaveBeenCalledWith(
      '/api/gallery?category=tienda&page=1&pageSize=24',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('includes category param for all categories', () => {
    const categories = ['general', 'tienda', 'eventos', 'productos'] as const
    categories.forEach(cat => {
      renderHook(() => useGallery(cat, 1, 24))
      expect(useSWR).toHaveBeenCalledWith(
        `/api/gallery?category=${cat}&page=1&pageSize=24`,
        expect.any(Function),
        expect.any(Object)
      )
    })
  })

  it('returns default values when data is undefined', () => {
    const { result } = renderHook(() => useGallery())
    expect(result.current.photos).toEqual([])
    expect(result.current.total).toBe(0)
    expect(result.current.hasMore).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('returns photos from data', () => {
    const mockPhotos = [
      { id: '1', url: 'http://example.com/photo.jpg', category: 'general' },
    ]
    vi.mocked(useSWR).mockReturnValue({
      data: { photos: mockPhotos, total: 1, hasMore: false, page: 1, pageSize: 24 },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as any)

    const { result } = renderHook(() => useGallery())
    expect(result.current.photos).toEqual(mockPhotos)
    expect(result.current.total).toBe(1)
    expect(result.current.hasMore).toBe(false)
  })

  it('returns hasMore true when there are more pages', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { photos: [], total: 100, hasMore: true, page: 1, pageSize: 24 },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as any)

    const { result } = renderHook(() => useGallery())
    expect(result.current.hasMore).toBe(true)
    expect(result.current.total).toBe(100)
  })

  it('returns isError true when there is an error', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: new Error('Network error'),
      isLoading: false,
      mutate: vi.fn(),
    } as any)

    const { result } = renderHook(() => useGallery())
    expect(result.current.isError).toBe(true)
    expect(result.current.photos).toEqual([])
  })

  it('returns isLoading true when fetching', () => {
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
    } as any)

    const { result } = renderHook(() => useGallery())
    expect(result.current.isLoading).toBe(true)
  })

  it('uses default page and pageSize when not provided', () => {
    renderHook(() => useGallery())
    expect(useSWR).toHaveBeenCalledWith(
      '/api/gallery?page=1&pageSize=24',
      expect.any(Function),
      expect.any(Object)
    )
  })
})
