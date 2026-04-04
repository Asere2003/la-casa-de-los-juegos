'use client'

import { useState, useTransition } from 'react'

import { actualizarDireccion } from '@/actions/cuenta'
import { useTranslations } from 'next-intl'

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
  profile: Profile | null
}

const paises = [
  { code: 'ES', label: 'España' },
  { code: 'PT', label: 'Portugal' },
  { code: 'FR', label: 'Francia' },
  { code: 'DE', label: 'Alemania' },
  { code: 'IT', label: 'Italia' },
  { code: 'GB', label: 'Reino Unido' },
  { code: 'US', label: 'Estados Unidos' },
  { code: 'MX', label: 'México' },
  { code: 'AR', label: 'Argentina' },
  { code: 'CO', label: 'Colombia' },
]

export default function DireccionForm({ profile }: Props) {
  const t = useTranslations('direccion')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess]        = useState(false)
  const [error, setError]            = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await actualizarDireccion(formData)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">

      {/* Dirección */}
      <div>
        <label htmlFor="dir-direccion" className="block text-xs font-mono uppercase tracking-wider
                          text-[#2a170f] mb-1.5">
          {t('address_label')}
        </label>
        <input
          id="dir-direccion"
          name="direccion"
          type="text"
          defaultValue={profile?.direccion ?? ''}
          disabled={isPending}
          className="input-base disabled:opacity-50"
          placeholder={t('address_placeholder')}
        />
      </div>

      {/* Ciudad y CP en fila */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dir-ciudad" className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            {t('city_label')}
          </label>
          <input
            id="dir-ciudad"
            name="ciudad"
            type="text"
            defaultValue={profile?.ciudad ?? ''}
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder={t('city_placeholder')}
          />
        </div>
        <div>
          <label htmlFor="dir-cp" className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            {t('postal_code_label')}
          </label>
          <input
            id="dir-cp"
            name="codigo_postal"
            type="text"
            defaultValue={profile?.codigo_postal ?? ''}
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder={t('postal_code_placeholder')}
          />
        </div>
      </div>

      {/* País */}
      <div>
        <label htmlFor="dir-pais" className="block text-xs font-mono uppercase tracking-wider
                          text-[#2a170f] mb-1.5">
          {t('country_label')}
        </label>
        <select
          id="dir-pais"
          name="pais"
          defaultValue={profile?.pais ?? 'ES'}
          disabled={isPending}
          className="input-base disabled:opacity-50"
        >
          {paises.map(p => (
            <option key={p.code} value={p.code}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-xs text-[#ba1a1a] font-mono">{error}</p>
      )}
      {success && (
        <p className="text-xs text-[#1a5c2a] font-mono">
          {t('success')}
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
            {t('saving')}
          </>
        ) : (
          t('save_btn')
        )}
      </button>
    </form>
  )
}