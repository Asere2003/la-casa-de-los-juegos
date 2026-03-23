'use client'

import { cambiarEmail, cambiarPassword } from '@/actions/cuenta'
import { useState, useTransition } from 'react'

import type { User } from '@supabase/supabase-js'

interface Props {
  user: User
}

export default function SeguridadForm({ user }: Props) {
  return (
    <div className="space-y-6 mt-4">
      <CambiarEmailSection user={user} />
      <div className="border-t border-[#c0c9bc]/30" />
      <CambiarPasswordSection />
    </div>
  )
}

// ── Cambiar Email ──────────────────────────────────
function CambiarEmailSection({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await cambiarEmail(formData)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest
                    text-[#805533] mb-3">
        Cambiar email
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email actual — solo lectura */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            Email actual
          </label>
          <input
            type="email"
            value={user.email ?? ''}
            disabled
            className="input-base opacity-50 cursor-not-allowed bg-[#fff1ec]"
          />
        </div>

        {/* Nuevo email */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            Nuevo email
          </label>
          <input
            name="email"
            type="email"
            required
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder="nuevo@email.com"
          />
        </div>

        {error && (
          <p className="text-xs text-[#ba1a1a] font-mono">{error}</p>
        )}
        {success && (
          <p className="text-xs text-[#1a5c2a] font-mono">
            ✓ Te hemos enviado un enlace de confirmación al nuevo email
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full justify-center disabled:opacity-60
                     disabled:hover:rotate-0 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30
                               border-t-white rounded-full animate-spin" />
              Enviando…
            </>
          ) : (
            'Cambiar email →'
          )}
        </button>
      </form>
    </div>
  )
}

// ── Cambiar Contraseña ─────────────────────────────
function CambiarPasswordSection() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    const formData = new FormData(e.currentTarget)

    const nueva    = formData.get('password') as string
    const confirmar = formData.get('confirmar') as string

    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (nueva.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    startTransition(async () => {
      const result = await cambiarPassword(formData)
      if (result?.error) setError(result.error)
      else {
        setSuccess(true)
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest
                    text-[#805533] mb-3">
        Cambiar contraseña
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            Nueva contraseña
          </label>
          <input
            name="password"
            type="password"
            required
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            Confirmar contraseña
          </label>
          <input
            name="confirmar"
            type="password"
            required
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-xs text-[#ba1a1a] font-mono">{error}</p>
        )}
        {success && (
          <p className="text-xs text-[#1a5c2a] font-mono">
            ✓ Contraseña actualizada correctamente
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full justify-center disabled:opacity-60
                     disabled:hover:rotate-0 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30
                               border-t-white rounded-full animate-spin" />
              Guardando…
            </>
          ) : (
            'Cambiar contraseña →'
          )}
        </button>
      </form>
    </div>
  )
}