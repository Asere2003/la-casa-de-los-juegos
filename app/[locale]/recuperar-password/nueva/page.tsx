import NuevaPasswordForm from '@/components/auth/NuevaPasswordForm'
import { actualizarPassword } from '@/actions/recuperar-password'

export default async function NuevaPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-20">
      <NuevaPasswordForm action={actualizarPassword} locale={locale} />
    </main>
  )
}