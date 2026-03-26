'use client'

import { useState, useTransition } from 'react'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface RegisterFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

function getRegisterErrorKey(error: string): string {
  const errorKeys: Record<string, string> = {
    'User already registered': 'error_user_already_registered',
    'Password should be at least 6 characters': 'error_password_too_short',
    'Unable to validate email address: invalid format': 'error_invalid_email',
    'Too many requests': 'error_too_many_requests',
  }
  return errorKeys[error] ?? 'error_generic'
}

export default function RegisterForm({ action }: RegisterFormProps) {
  const t = useTranslations('auth')

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmar = formData.get('confirmar_password') as string

    if (password !== confirmar) {
      setError('error_passwords_mismatch')
      return
    }

    if (password.length < 8) {
      setError('error_password_too_short')
      return
    }

    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) setError(getRegisterErrorKey(result.error))
    })
  }

  return (
    <div className="w-full max-w-md">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8" style={{ marginTop: '60px' }}>
        <span
          className="font-headline italic text-2xl text-[#004317]"
          style={{ fontFamily: 'var(--font-headline)' }}
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
            {t('register_label')}
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4" />
          <h1
            className="text-2xl text-[#2a170f]"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {t('register')}
          </h1>
          <p
            className="mt-2 text-sm text-[#717a6f]"
            style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            {t('register_subtitle')}
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div
            className="mb-6 px-4 py-3 text-sm text-[#ba1a1a] bg-[#ba1a1a]/8 border border-[#ba1a1a]/20"
            style={{ borderRadius: '2px' }}
          >
            {t(error)}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 space-y-5">

          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              {t('name')}
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('name_placeholder')}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              {t('email_label')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('email_placeholder')}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('password_placeholder')}
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label
              htmlFor="confirmar_password"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              {t('confirm_password')}
            </label>
            <input
              id="confirmar_password"
              name="confirmar_password"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {/* Aviso legal */}
          <p
            className="text-xs text-[#717a6f]"
            style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            {t('privacy_notice_before')}{' '}
            <Link href="/privacidad" className="text-[#1a5c2a] hover:text-[#c9a84c] transition-colors">
              {t('privacy_link')}
            </Link>
            .
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:rotate-0"
          >
            {isPending ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('creating_account')}
              </>
            ) : (
              t('submit_register')
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
              style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
            >
              {t('has_account')}
            </span>
          </div>
        </div>

        {/* Link login */}
        <Link
          href="/login"
          className="w-full btn-outline justify-center block text-center"
        >
          {t('login')}
        </Link>
      </div>
    </div>
  )
}
