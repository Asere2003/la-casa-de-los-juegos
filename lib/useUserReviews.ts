import type { Review } from '@/types/cuentas'
import { createClient } from '@/lib/supabase/client'
import useSWR from 'swr'

export function useUserReviews(userId: string) {
  return useSWR(['reviews', userId], async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('reviews')
      .select('* , product:products(id, name, slug, images)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    return (data ?? []) as Review[]
  })
}
