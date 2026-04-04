'use client'

import { useActionState } from 'react'
import { suscribirNewsletter } from '@/app/actions/newsletter'

const initialState = { success: false, error: null }

export default function ProximamenteForm() {
  const [state, formAction, isPending] = useActionState(suscribirNewsletter, initialState)

  if (state.success) {
    return (
      <div className="text-center">
        <div
          className="w-12 h-12 bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-4"
          style={{ borderRadius: '2px' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p
          className="text-[#c9a84c] text-base mb-1"
          style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic' }}
        >
          ¡Apuntado!
        </p>
        <p className="text-[#fff1ec]/40 text-sm font-body">
          Te avisaremos cuando haya novedades.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="w-full">
      <div className="flex gap-0 w-full">
        <div className="flex-1">
          <label htmlFor="proximamente-email" className="sr-only">
            Tu email
          </label>
          <input
            id="proximamente-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@email.com"
            className="w-full bg-[#fff1ec]/5 border border-[#c9a84c]/20 border-r-0 px-4 py-3 text-[#fff1ec] placeholder:text-[#fff1ec]/20 focus:outline-none focus:border-[#c9a84c]/50 text-sm font-body transition-colors"
            style={{ borderRadius: '2px 0 0 2px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#2c1810] font-mono text-[11px] uppercase tracking-widest px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          style={{ borderRadius: '0 2px 2px 0' }}
        >
          {isPending ? '...' : 'Avisamé'}
        </button>
      </div>

      {state.error && (
        <p className="text-red-400 text-[11px] font-mono mt-3 text-left" role="alert">
          {state.error}
        </p>
      )}
    </form>
  )
}