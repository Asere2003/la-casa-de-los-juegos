'use client'

import { useState, useTransition } from 'react'

import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface Props {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string; locale?: string }>
  locale: string
}

function getNuevaPasswordErrorKey(error: string): string {
  switch (error) {
    case 'New password should be different from the old password.':
      return 'error_same_password'
    case 'Password should be at least 6 characters.':
      return 'error_password_min_6'
    case 'Too many requests':
      return 'error_too_many_requests'
    case 'Auth session missing!':
      return 'error_session_missing'
    default:
      return 'error_generic'
  }
}

export default function NuevaPasswordForm({ action, locale }: Props) {
  const router = useRouter()
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('error_passwords_mismatch')
      return
    }

    if (password.length < 6) {
      setError('error_password_min_6')
      return
    }

    formData.append('locale', locale)

    startTransition(async () => {
      const result = await action(formData)
      if (result.error) {
        setError(getNuevaPasswordErrorKey(result.error))
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
            {tNav('account')}
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4" />
          <h1 className="font-headline text-2xl text-[#2a170f]">
            {t('new_password_title')}
          </h1>
          <p className="mt-2 text-sm text-[#717a6f] font-body italic">
            {t('new_password_subtitle')}
          </p>
        </div>

        {error && (
          <div
            className="mb-6 px-4 py-3 text-sm text-[#ba1a1a] bg-[#ba1a1a]/8 border border-[#ba1a1a]/20"
            style={{ borderRadius: '2px' }}
          >
            {t(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono uppercase tracking-wider text-[#2a170f] mb-1.5"
            >
              {t('new_password_title')}
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
              {t('confirm_password')}
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
                {t('saving')}
              </>
            ) : (
              t('submit_new_password')
            )}
          </button>

        </form>
      </div>
    </div>
  )
}
