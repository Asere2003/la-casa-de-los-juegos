import { createClient } from '@/lib/supabase/client'
import useSWR from 'swr'

export function useReviewedProductIds(userId: string) {
  return useSWR(['reviewed-ids', userId], async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('user_id', userId)
    return (data ?? []).map(r => r.product_id) as string[]
  })
}