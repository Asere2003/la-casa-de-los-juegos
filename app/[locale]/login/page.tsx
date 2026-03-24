import LoginForm from '@/components/auth/LoginForm'
import { login } from '@/actions/auth'

export const metadata = {
  title: 'Iniciar sesión — La Casa de los Juegos',
  description: 'Accede a tu cuenta para gestionar tus pedidos y favoritos.',
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirectTo?: string; error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-16">
      <LoginForm action={login} redirectTo={params.redirectTo} />
    </main>
  );
}