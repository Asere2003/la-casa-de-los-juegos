import SolicitarForm from '@/components/auth/SolicitarRecuperacionForm'
import { solicitarRecuperacion } from '@/actions/recuperar-password'

export default async function RecuperarPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-20">
      <SolicitarForm action={solicitarRecuperacion} locale={locale} />
    </main>
  )
}