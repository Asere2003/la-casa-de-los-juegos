'use client'

import { useState, useTransition } from 'react'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface Props {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  locale: string
}

export default function SolicitarRecuperacionForm({ action, locale }: Props) {
  const t = useTranslations('auth')
  const tNav = useTranslations('nav')

  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('locale', locale)

    startTransition(async () => {
      await action(formData)
      setSent(true)
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
            {t('recover_password_title')}
          </h1>
          <p className="mt-2 text-sm text-[#717a6f] font-body italic">
            {t('recover_password_subtitle')}
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✉️</div>
            <p className="font-body italic text-[#2a170f] mb-2">
              {t('recover_password_sent')}
            </p>
            <p className="text-sm text-[#717a6f] font-body italic mb-6">
              {t('recover_password_spam')}
            </p>
            <Link
              href="/login"
              className="text-sm text-[#1a5c2a] hover:text-[#c9a84c] transition-colors font-body italic"
            >
              {t('back_to_login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                required
                disabled={isPending}
                className="input-base disabled:opacity-50"
                placeholder={t('email_placeholder')}
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
                  {t('sending')}
                </>
              ) : (
                t('submit_recover')
              )}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-[#1a5c2a] hover:text-[#c9a84c] transition-colors font-body italic"
              >
                {t('back_to_login')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
