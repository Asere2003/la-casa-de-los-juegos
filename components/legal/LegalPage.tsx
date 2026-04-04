// components/legal/LegalPage.tsx

import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

interface LegalPageProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export async function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  const t = await getTranslations('legal')

  return (
    <main className="min-h-screen bg-[#fff8f6] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <span className="section-label">{t('label')}</span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#2c1810] mt-3 mb-2">
            {title}
          </h1>
          <p className="text-sm text-[#2c1810]/50">
            {t('last_updated', { date: lastUpdated })}
          </p>
          <div className="gold-rule mt-4" />
        </div>
        <div className="prose prose-stone max-w-none
          prose-headings:font-serif prose-headings:text-[#2c1810]
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
          prose-p:text-[#2c1810]/80 prose-p:leading-relaxed
          prose-li:text-[#2c1810]/80 prose-a:text-[#1a5c2a]
          prose-strong:text-[#2c1810]">
          {children}
        </div>
      </div>
    </main>
  )
}