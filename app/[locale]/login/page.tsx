import LoginForm from '@/components/auth/LoginForm'
import { login } from '@/actions/auth'

export const metadata = {
  title: 'Iniciar sesión — La Casa de los Juegos',
  description: 'Accede a tu cuenta para gestionar tus pedidos y favoritos.',
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string }
}) {
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-16">
      <LoginForm action={login} redirectTo={searchParams.redirectTo} />
    </main>
  )
}