'use client'

import { useActionState } from 'react'
import { suscribirNewsletter } from '@/app/actions/newsletter'
import { useTranslations } from 'next-intl'

const initialState = { success: false, error: null }

export default function FooterNewsletter() {
  const t = useTranslations('footer')
  const [state, formAction, isPending] = useActionState(suscribirNewsletter, initialState)

  return (
    <div>
      <h2 className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] mb-3">
        {t('newsletter_title')}
      </h2>
      <p className="text-[#c9a84c]/45 font-body italic text-sm mb-4">
        {t('newsletter_desc')}
      </p>

      {state.success ? (
        <p className="text-[#c9a84c] font-body italic text-sm" role="status" aria-live="polite">
          ✓ ¡Suscrito! Gracias.
        </p>
      ) : (
        <form action={formAction} noValidate>
          <div className="relative">
            <label htmlFor="newsletter-email" className="sr-only">
              Suscribirse al newsletter
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t('newsletter_placeholder')}
              className="w-full bg-transparent border-b border-[#c9a84c]/25 py-2 font-body italic text-[#fff1ec] placeholder:text-[#c9a84c]/25 focus:outline-none focus:border-[#c9a84c] text-sm"
            />
            <button
              type="submit"
              disabled={isPending}
              aria-label="Suscribirse"
              className="absolute right-2 bottom-2 text-[#c9a84c] hover:text-[#fff1ec] transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {state.error && (
            <p className="text-red-400 text-[11px] font-mono mt-2" role="alert">
              {state.error}
            </p>
          )}

          <p className="text-[9px] text-[#c9a84c]/25 mt-2 italic font-body">
            {t('newsletter_note')}
          </p>
        </form>
      )}
    </div>
  )
}