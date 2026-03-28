'use client'

import { CldImage } from 'next-cloudinary'
import HighlightGold from '@/components/shared/HighlightGold'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type HeroSectionProps = {
  image: string
}

export default function HeroSection({ image }: HeroSectionProps) {
  const t = useTranslations('home')
  
  return (
    <section className="relative min-h-[90dvh] md:min-h-screen flex items-center overflow-hidden bg-[var(--color-primary-container)]" aria-label={t('hero_title_others')}>
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <CldImage
          src={image}
          alt="Imagen de fondo del hero"
          width={2560}
          height={1440}
          className="w-full h-full object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#002108]/95 via-[#004317]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002108]/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto w-full pt-24 pb-16">
        <div className="max-w-xl">
          <p className="font-mono text-[var(--color-gold)]/80 text-xs uppercase tracking-[0.3em] mb-5">Granada · Est. 2024</p>
          <h1 className="font-headline text-5xl md:text-7xl text-white leading-[1.05] tracking-tight mb-6 whitespace-pre-line">
            {t.rich('hero_title', {
              highlight: (chunks) => <HighlightGold>{chunks}</HighlightGold>
            })}
          </h1>
          <p className="font-body italic text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-md">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalogo" className="btn-gold text-sm">
              {t('hero_cta')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/historia" className="btn-outline border-[var(--color-gold)]/50 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] text-sm not-italic">
              {t('hero_secondary')}
            </Link>
          </div>

          {/* Accesos rápidos */}
          <div className="flex flex-wrap gap-2 mt-6" aria-label="Accesos rápidos a secciones">
            <a
              href="#curiosidades"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]/75 border border-[var(--color-gold)]/25 bg-[#002108]/50 hover:bg-[#002108]/80 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Curiosidades
            </a>
            <a
              href="#favoritos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]/75 border border-[var(--color-gold)]/25 bg-[#002108]/50 hover:bg-[#002108]/80 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
              style={{ borderRadius: '2px' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Favoritos de la casa
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-gold)]/50 z-10" aria-hidden="true">
        <div className="w-px h-8 bg-[var(--color-gold)]/30 animate-pulse" />
        <span className="font-mono text-[9px] uppercase tracking-widest">{t('hero_cta')}</span>
      </div>
    </section>
  )
}