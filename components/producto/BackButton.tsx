'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function BackButton() {
  const router = useRouter()
  const t = useTranslations('back_button')

  return (
    <div className="sticky top-20 z-10 mb-4 pointer-events-none">
      <button
        onClick={() => router.back()}
        className="pointer-events-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#717a6f] hover:text-[#004317] transition-colors bg-[#fff8f6]/80 backdrop-blur-sm px-3 py-2"
        style={{ borderRadius: '2px' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        {t('back')}
      </button>
    </div>
  )
}