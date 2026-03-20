import Image from 'next/image'
import Link from 'next/link'

type EditorialBannerProps = {
  image: string
}

export default function EditorialBanner({ image }: EditorialBannerProps) {
  return (
    <section className="bg-[#002108] overflow-hidden" aria-label="Nuestra historia">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        <div className="md:col-span-6 relative overflow-hidden min-h-[280px]">
          <Image
            src={image}
            alt="Tienda histórica de juegos en Granada"
            fill
            className="object-cover opacity-60 sepia-[20%]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#002108] hidden md:block" aria-hidden="true" />
        </div>

        <div className="md:col-span-6 flex flex-col justify-center px-10 md:px-14 py-16 text-[var(--color-surface)] relative z-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-gold)]/70 mb-4">Nuestra Historia</p>
          <h2 className="font-headline text-3xl md:text-4xl text-[var(--color-surface)] leading-tight mb-6 italic">
            Granada siempre tuvo un rincón para jugar
          </h2>
          <p className="font-body text-[var(--color-surface)]/65 text-lg leading-relaxed mb-8">
            Durante décadas, en las callejuelas cercanas a la Catedral, una tienda custodió los secretos de los juegos más antiguos del mundo. Hoy revivimos ese legado.
          </p>
          <blockquote className="border-l-2 border-[var(--color-gold)] pl-5 mb-8">
            <p className="font-headline italic text-xl text-[var(--color-gold)] leading-relaxed">
              "El juego es la forma más elevada de investigación."
            </p>
            <footer className="font-mono text-xs text-[var(--color-surface)]/40 mt-2">— Albert Einstein</footer>
          </blockquote>
          <Link href="/historia" className="inline-flex items-center gap-2 text-[var(--color-gold)] font-headline font-bold text-sm hover:gap-4 transition-all border-b border-[var(--color-gold)]/30 pb-1 w-fit focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded">
            Leer el relato completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}