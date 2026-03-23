import RegisterForm from '@/components/auth/RegisterForm'
import { registro } from '@/actions/auth'

export const metadata = {
  title: 'Crear cuenta — La Casa de los Juegos',
  description: 'Crea tu cuenta para gestionar pedidos y acceder a ofertas exclusivas.',
}

export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-16">
      <RegisterForm action={registro} />
    </main>
  )
}