'use client'

import { useState, useTransition } from 'react'

import type { User } from '@supabase/supabase-js'
import { actualizarPerfil } from '@/actions/cuenta'

interface Profile {
  id: string
  nombre: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  codigo_postal: string | null
  pais: string | null
}

interface Props {
  user: User
  profile: Profile | null
}

export default function DatosPersonalesForm({ user, profile }: Props) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await actualizarPerfil(formData)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">

      {/* Nombre */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider
                          text-[#2a170f] mb-1.5">
          Nombre completo
        </label>
        <input
          name="nombre"
          type="text"
          defaultValue={profile?.nombre ?? ''}
          disabled={isPending}
          className="input-base disabled:opacity-50"
          placeholder="Tu nombre completo"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider
                          text-[#2a170f] mb-1.5">
          Teléfono
        </label>
        <input
          name="telefono"
          type="tel"
          defaultValue={profile?.telefono ?? ''}
          disabled={isPending}
          className="input-base disabled:opacity-50"
          placeholder="+34 600 000 000"
        />
      </div>

      {/* Email — solo lectura */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider
                          text-[#2a170f] mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={user.email ?? ''}
          disabled
          className="input-base opacity-50 cursor-not-allowed bg-[#fff1ec]"
        />
        <p className="text-[10px] text-[#717a6f] mt-1 font-mono">
          El email se cambia en la sección Seguridad
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-xs text-[#ba1a1a] font-mono">{error}</p>
      )}
      {success && (
        <p className="text-xs text-[#1a5c2a] font-mono">
          ✓ Datos actualizados correctamente
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
          'Guardar cambios →'
        )}
      </button>
    </form>
  )
}