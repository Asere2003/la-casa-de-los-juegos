'use client'

import { cambiarEmail, cambiarPassword } from '@/actions/cuenta'
import { useState, useTransition } from 'react'

import type { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('seguridad')
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
        {t('change_email_title')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email actual — solo lectura */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            {t('current_email_label')}
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
            {t('new_email_label')}
          </label>
          <input
            name="email"
            type="email"
            required
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder={t('new_email_placeholder')}
          />
        </div>

        {error && (
          <p className="text-xs text-[#ba1a1a] font-mono">{error}</p>
        )}
        {success && (
          <p className="text-xs text-[#1a5c2a] font-mono">
            {t('email_success')}
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
              {t('sending')}
            </>
          ) : (
            t('change_email_button')
          )}
        </button>
      </form>
    </div>
  )
}

// ── Cambiar Contraseña ─────────────────────────────
function CambiarPasswordSection() {
  const t = useTranslations('seguridad')
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
      setError(t('error_passwords_mismatch'))
      return
    }
    if (nueva.length < 8) {
      setError(t('error_password_too_short'))
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
        {t('change_password_title')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            {t('new_password_label')}
          </label>
          <input
            name="password"
            type="password"
            required
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder={t('password_placeholder')}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider
                            text-[#2a170f] mb-1.5">
            {t('confirm_password_label')}
          </label>
          <input
            name="confirmar"
            type="password"
            required
            disabled={isPending}
            className="input-base disabled:opacity-50"
            placeholder={t('confirm_password_placeholder')}
          />
        </div>

        {error && (
          <p className="text-xs text-[#ba1a1a] font-mono">{error}</p>
        )}
        {success && (
          <p className="text-xs text-[#1a5c2a] font-mono">
            {t('password_success')}
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
            t('change_password_button')
          )}
        </button>
      </form>
    </div>
  )
}
