import HeroHistoria from '@/components/historia/HeroHistoria'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import Timeline from '@/components/historia/Timeline'
import VintagePhoto from '@/components/historia/VintagePhoto'

export const metadata: Metadata = {
  title: 'Nuestra Historia — La Casa de los Juegos',
  description: 'Desde 1892 en Granada, custodios de juegos de mesa, puzzles y curiosidades lúdicas de todo el mundo. Conoce la historia de la familia Valdivia.',
}

export default function HistoriaPage() {
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
                En el corazón de la Alcaicería de Granada, donde el aroma a sándalo y especias aún danza en las corrientes de aire fresco, nació hace más de un siglo un santuario para el intelecto y el ocio.
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                La Casa de los Juegos no fue concebida meramente como una tienda, sino como un puente entre civilizaciones, tallado en madera de nogal y marcado por el paso del tiempo. Cada tablero, cada pieza, cada carta que cruzaba nuestro umbral era tratada como un artefacto sagrado.
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                Durante tres generaciones, la familia Valdivia custodió los secretos de los juegos antiguos. Desde el Senet egipcio hasta los intrincados puzzles de la dinastía Qing, el taller situado en la trastienda era testigo del crujir constante de las gubias y el pulido meticuloso de los dados de hueso.
              </p>
            </div>

            {/* Foto vintage 1 */}
            <div className="md:col-span-5">
              <VintagePhoto
                src="historia/hero-taller-original"
                alt="Taller artesanal con herramientas de carpintería vintage"
                caption="El taller original, circa 1924"
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
              El juego es la forma más elevada de investigación
            </p>

            <footer className="mt-6">
              <cite className="font-body text-xl text-on-surface not-italic">
                — Albert Einstein
              </cite>
              <p className="font-body text-sm text-on-surface/70 mt-2 italic">
                Citado frecuentemente por nuestro fundador, Don Aurelio Valdivia
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
                caption="Don Aurelio en su último día de taller, 2023"
                rotate="left"
                width={800}
                height={600}
              />
            </div>

            {/* Texto */}
            <div className="md:col-span-7 space-y-6 order-1 md:order-2">
              <h2 className="font-headline text-4xl text-primary italic font-normal">
                El Retiro de Don Aurelio
              </h2>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                Tras cincuenta años de servicio ininterrumpido, Don Aurelio Valdivia III decidió que sus manos, sabias pero cansadas, necesitaban reposo. El cierre de la tienda física en 2023 marcó el fin de una era para Granada, pero no para el espíritu de la marca.
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                <span className="font-semibold text-primary italic">"Un juego no termina cuando se cierra la caja"</span>, decía siempre, <span className="font-semibold text-primary italic">"solo se guarda para la próxima sesión"</span>.
              </p>

              <p className="font-body text-xl leading-relaxed text-on-surface">
                La transición al mundo digital fue nuestra partida más desafiante. No buscábamos convertirnos en una corporación sin rostro, sino en un <strong className="text-primary">Archivo Digital</strong>. Cada píxel de este nuevo hogar ha sido diseñado con la misma reverencia con la que Aurelio tallaba un alfil de boj.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Línea Temporal */}
      <Timeline />

      {/* Galería de momentos */}
      <section className="py-20 px-6 md:px-12 bg-surface" aria-labelledby="gallery-heading">
        <div className="max-w-6xl mx-auto">
          <h2 
            id="gallery-heading"
            className="font-headline text-4xl text-center text-primary mb-16 italic font-normal"
          >
            Momentos que nos Definen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <VintagePhoto
              src="historia/hero-estanteria"
              alt="Estantería llena de juegos de mesa clásicos"
              caption="La colección de clásicos, 1985"
              rotate="left"
              size="small"
              width={600}
              height={800}
            />

            <VintagePhoto
              src="historia/hero-piezas-talladas"
              alt="Ajedrez artesanal con piezas talladas"
              caption="Piezas únicas talladas a mano"
              rotate="right"
              size="small"
              width={600}
              height={800}
            />

            <VintagePhoto
              src="historia/puzzle-artesanal"
              alt="Puzzle artístico en proceso"
              caption="Puzzles de arte, nuestra especialidad"
              rotate="none"
              size="small"
              width={600}
              height={800}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-primary to-primary-container text-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline text-4xl md:text-6xl mb-6 italic font-normal text-tertiary-container">
            La Historia Continúa Contigo
          </h2>

          <p className="font-body text-xl md:text-2xl mb-12 text-surface leading-relaxed">
            Cada juego que encuentras en nuestra tienda lleva consigo más de un siglo de pasión, tradición y dedicación artesanal. Forma parte de esta historia.
          </p>

          <Link
            href="/catalogo"
            className="
              inline-flex items-center gap-3 
              bg-tertiary-container text-on-tertiary-container 
              px-10 py-5 rounded-lg 
              font-headline text-lg font-semibold
              hover:rotate-[-1deg] hover:scale-105
              transition-all duration-300
              shadow-2xl shadow-black/30
              focus:outline-none focus:ring-4 focus:ring-tertiary-container/50
            "
          >
            <span>Explorar el Catálogo</span>
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

          <p className="font-body text-sm text-surface/80 mt-8 italic">
            Envío gratuito en pedidos superiores a 50€
          </p>
        </div>
      </section>
    </div>
  )
}
