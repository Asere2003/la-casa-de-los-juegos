import AdminMobileNav from '@/components/admin/AdminMobileNav'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect(`/${locale}/`)

  return (
    <div className="min-h-screen bg-[#fff8f6] pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AdminMobileNav locale={locale} />
        <div className="flex gap-8">
          <AdminSidebar locale={locale} />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}