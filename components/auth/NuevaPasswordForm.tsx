'use client'

import { useState, useTransition } from 'react'

import { useRouter } from '@/i18n/navigation'

interface Props {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string; locale?: string }>
  locale: string
}

export default function NuevaPasswordForm({ action, locale }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    formData.append('locale', locale)

    startTransition(async () => {
      const result = await action(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/cuenta')
      }
    })
  }

  return (
    <div className="w-full max-w-md">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <span className="font-headline italic text-2xl text-[#004317]">
          La Casa de los Juegos
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533] mt-1">
          Granada · Est. 2024
        </span>
        <span className="block w-10 h-0.5 bg-[#c9a84c] mt-3" />
      </div>

      <div
        className="px-5 md:px-10 py-8 bg-white"
        style={{ boxShadow: '0 4px 32px rgba(42,23,15,.10)', borderRadius: '2px' }}
      >
        <div className="mb-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
            Mi cuenta
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4" />
          <h1 className="font-headline text-2xl text-[#2a170f]">
            Nueva contraseña
          </h1>
          <p className="mt-2 text-sm text-[#717a6f] font-body italic">
            Elige una contraseña segura para tu cuenta.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 px-4 py-3 text-sm text-[#ba1a1a] bg-[#ba1a1a]/8 border border-[#ba1a1a]/20"
            style={{ borderRadius: '2px' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-primary justify-center disabled:opacity-60"
          >
            {isPending ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar contraseña →'
            )}
          </button>

        </form>
      </div>
    </div>
  )
}