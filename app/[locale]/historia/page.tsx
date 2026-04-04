import HeroHistoria from '@/components/historia/HeroHistoria'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import Timeline from '@/components/historia/Timeline'
import VintagePhoto from '@/components/historia/VintagePhoto'
import { useTranslations } from 'next-intl'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lacasadelosjuegos.com'

export const metadata: Metadata = {
  title: 'Nuestra Historia — La Casa de los Juegos',
  description: 'Desde 1892 en Granada, custodios de juegos de mesa, puzzles y curiosidades lúdicas de todo el mundo. Conoce la historia de la familia Valdivia.',
  openGraph: {
    title: 'Nuestra Historia — La Casa de los Juegos',
    description: 'Desde 1892 en Granada, custodios de juegos de mesa, puzzles y curiosidades lúdicas de todo el mundo. Conoce la historia de la familia Valdivia.',
    url: `${siteUrl}/es/historia`,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Historia de La Casa de los Juegos desde 1892' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuestra Historia — La Casa de los Juegos',
    description: 'Desde 1892 en Granada, custodios de juegos de mesa, puzzles y curiosidades lúdicas de todo el mundo.',
    images: [`${siteUrl}/og-image.jpg`],
  },
}

export default function HistoriaPage() {
  const t = useTranslations('history')
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroHistoria />

      {/* Introducción Editorial */}
      <section className="py-20 px-6 md:px-12 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Columna de texto principal */}
            <div className="md:col-span-7 space-y-8">
              <p className="font-body text-2xl md:text-3xl leading-relaxed first-letter:text-7xl first-letter:font-headline first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:font-normal text-on-surface">
                {t('intro_1')}
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                {t('intro_2')}
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                {t('intro_3')}
              </p>
            </div>

            {/* Foto vintage 1 */}
            <div className="md:col-span-5">
              <VintagePhoto
                src="historia/hero-taller-original"
                alt="Taller artesanal con herramientas de carpintería vintage"
                caption={t('photo1_caption')}
                rotate="right"
                width={800}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blockquote destacado */}
      <section className="py-16 px-6 md:px-12 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote>
            <svg
              className="w-16 h-16 text-tertiary-container mx-auto mb-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="font-headline italic text-3xl md:text-5xl text-primary leading-tight font-normal">
              {t('blockquote')}
            </p>

            <footer className="mt-6">
              <cite className="font-body text-xl text-on-surface not-italic">
                — Albert Einstein
              </cite>
              <p className="font-body text-sm text-on-surface/70 mt-2 italic">
                {t('blockquote_cite')}
              </p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* La Transición - Grid de texto e imagen */}
      <section className="py-20 px-6 md:px-12 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Foto vintage 2 */}
            <div className="md:col-span-5 order-2 md:order-1">
              <VintagePhoto
                src="historia/hero-manos-tallando"
                alt="Manos artesanas tallando pieza de madera"
                caption={t('photo2_caption')}
                rotate="left"
                width={800}
                height={600}
              />
            </div>

            {/* Texto */}
            <div className="md:col-span-7 space-y-6 order-1 md:order-2">
              <h2 className="font-headline text-4xl text-primary italic font-normal">
                {t('section2_title')}
              </h2>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                {t('section2_p1')}
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                <span className="font-semibold text-primary italic">
                  {t('section2_p2a')}</span>, 
                    {t('section2_p2b')} <span className="font-semibold text-primary italic">
                  {t('section2_p2c')}</span>.
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                {t('section2_p3')}
                <strong className="text-primary">{t('section2_p4')}</strong> 
                {t('section2_p5')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Línea Temporal */}
      <Timeline />

      {/* Galería de momentos */}
      <section className="pb-10 px-6 md:px-12 bg-surface" aria-labelledby="gallery-heading">
        <div className="max-w-6xl mx-auto">
          <h2
            id="gallery-heading"
            className="font-headline text-4xl text-center text-primary mb-16 italic font-normal"
          >
            {t('gallery_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <VintagePhoto
              src="historia/hero-estanteria"
              alt="Estantería llena de juegos de mesa clásicos"
              caption={t('gallery1_caption')}
              rotate="left"
              size="small"
              width={600}
              height={800}
            />

            <VintagePhoto
              src="historia/hero-piezas-talladas"
              alt="Ajedrez artesanal con piezas talladas"
              caption={t('gallery2_caption')}
              rotate="right"
              size="small"
              width={600}
              height={800}
            />

            <VintagePhoto
              src="historia/puzzle-artesanal"
              alt="Puzzle artístico en proceso"
              caption={t('gallery3_caption')}
              rotate="none"
              size="small"
              width={600}
              height={800}
            />
          </div>
                  <div className="mt-8 text-center md:hidden">
          <Link href="/catalogo" className="inline-flex items-center gap-2 font-body italic text-sm text-[var(--color-primary)] border-b border-[var(--color-primary)]/30 pb-0.5">
            {t('new_arrivals_link')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#002108] overflow-hidden">
        <div className="md:col-span-6 flex flex-col justify-center px-10 md:px-14 py-16 text-[var(--color-surface)] relative z-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-gold)]/70 mb-4">{t('editorial_label')}</p>
          <h2 className="font-headline text-3xl md:text-4xl text-[var(--color-surface)] leading-tight mb-6 italic">
            {t('final_cta')}
          </h2>

          <p className="font-body text-[var(--color-surface)]/65 text-lg leading-relaxed mb-8">
            {t('final_p')}
          </p>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-[var(--color-gold)] font-headline font-bold text-sm hover:gap-4 transition-all border-b border-[var(--color-gold)]/30 pb-1 w-fit focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded"
          >
            <span>{t('final_cta')}</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <p className="font-body text-sm text-[var(--color-surface)]/65 mt-8 italic">
            {t('final_note')}
          </p>
        </div>
      </section>
    </div>
  )
}
