'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { useState, useTransition } from 'react'

interface LoginFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>
  redirectTo?: string
}

export default function LoginForm({ action, redirectTo }: LoginFormProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setError(null)
  const formData = new FormData(e.currentTarget)

  startTransition(async () => {
    const result = await action(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/cuenta') // ← redirección desde el cliente
      router.refresh()       // ← fuerza refresco del Server Component
    }
  })
}

  return (
    <div className="w-full max-w-md">

{/* Logo */}
<div className="flex flex-col items-center mb-8">
  <span
    className="font-headline italic text-2xl text-[#004317]"
    style={{ fontFamily: 'Noto Serif, serif' }}
  >
    La Casa de los Juegos
  </span>
  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mt-1">
    Granada · Est. 2024
  </span>
  <span className="block w-10 h-0.5 bg-[#c9a84c] mt-3" />
</div>

      {/* Tarjeta */}
      <div
        className="max-w-7xl mx-auto px-5 md:px-10 py-8"
        style={{ boxShadow: '0 4px 32px rgba(42,23,15,.10)', borderRadius: '2px' }}
      >
        {/* Cabecera */}
        <div className="mb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
            Mi cuenta
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4" />
          <h1
            className="text-2xl text-[#2a170f]"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Iniciar sesión
          </h1>
          <p
            className="mt-2 text-sm text-[#717a6f]"
            style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
          >
            Accede a tu cuenta para gestionar tus pedidos.
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div
            className="mb-6 px-4 py-3 text-sm text-[#ba1a1a] bg-[#ba1a1a]/8 border border-[#ba1a1a]/20"
            style={{ borderRadius: '2px' }}
          >
            {traducirError(error)}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="tu@email.com"
            />
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-[#2a170f]"
              >
                Contraseña
              </label>
              <Link
                href="/recuperar-password"
                className="text-xs text-[#1a5c2a] hover:text-[#c9a84c] transition-colors"
                style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
              >
                ¿La olvidaste?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:rotate-0"
          >
            {isPending ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando…
              </>
            ) : (
              'Entrar →'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mb-5 mt-5 relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#c0c9bc]/40" />
          </div>
          <div className="relative flex justify-center">
            <span
              className="px-3 bg-white text-xs text-[#717a6f]"
              style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
            >
              ¿aún no tienes cuenta?
            </span>
          </div>
        </div>

        {/* Link registro */}
        <Link
          href="/registro"
          className="w-full btn-outline justify-center block text-center"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}

// Traduce los errores de Supabase al español
function traducirError(error: string): string {
  const errores: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos.',
    'Email not confirmed': 'Confirma tu email antes de entrar. Revisa tu bandeja de entrada.',
    'Too many requests': 'Demasiados intentos. Espera unos minutos.',
    'User not found': 'No existe ninguna cuenta con ese email.',
  }
  return errores[error] ?? 'Ha ocurrido un error. Inténtalo de nuevo.'
}