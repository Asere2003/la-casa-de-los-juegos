import SolicitarForm from '@/components/auth/SolicitarRecuperacionForm'
import { solicitarRecuperacion } from '@/actions/recuperar-password'

export const metadata = {
  title: 'Recuperar contraseña — La Casa de los Juegos',
  description: 'Recupera el acceso a tu cuenta.',
  robots: { index: false, follow: false },
}

export default async function RecuperarPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-16">
      <SolicitarForm action={solicitarRecuperacion} locale={locale} />
    </main>
  )
}