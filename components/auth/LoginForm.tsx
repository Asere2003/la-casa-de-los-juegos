'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { useState, useTransition } from 'react'

import { useTranslations } from 'next-intl'

interface LoginFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>
  redirectTo?: string
}

function getErrorKey(error: string): string {
  const errorKeys: Record<string, string> = {
    'Invalid login credentials': 'error_invalid_credentials',
    'Email not confirmed': 'error_email_not_confirmed',
    'Too many requests': 'error_too_many_requests',
    'User not found': 'error_user_not_found',
  }
  return errorKeys[error] ?? 'error_generic'
}

export default function LoginForm({ action, redirectTo }: LoginFormProps) {
  const router = useRouter()
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push(redirectTo ?? '/cuenta')
        router.refresh()
      }
    })
  }

  return (
    <div className="w-full max-w-md">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
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
            {tNav('account')}
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4" />
          <h1
            className="text-2xl text-[#2a170f]"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {t('login')}
          </h1>
          <p
            className="mt-2 text-sm text-[#717a6f]"
            style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            {t('login_subtitle')}
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div
            className="mb-6 px-4 py-3 text-sm text-[#ba1a1a] bg-[#ba1a1a]/8 border border-[#ba1a1a]/20"
            style={{ borderRadius: '2px' }}
          >
            {t(getErrorKey(error))}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

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
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-[#2a170f]"
              >
                {t('password')}
              </label>
              <Link
                href="/recuperar-password"
                className="text-xs text-[#1a5c2a] hover:text-[#c9a84c] transition-colors"
                style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
              >
                {t('forgot_password')}
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
                {t('logging_in')}
              </>
            ) : (
              t('submit_login')
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#c0c9bc]/40" />
          </div>
          <div className="relative flex justify-center">
            <span
              className="px-3 bg-white text-xs text-[#717a6f]"
              style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
            >
              {t('no_account')}
            </span>
          </div>
        </div>

        {/* Link registro */}
        <Link
          href="/registro"
          className="w-full btn-outline justify-center block text-center"
        >
          {t('register')}
        </Link>
      </div>
    </div>
  )
}
