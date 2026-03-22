import { useTranslations } from "next-intl"

interface TimelineEvent {
  year: string
  title: string
  description: string
  highlight?: boolean
}



export default function Timeline() {

const t = useTranslations('timeline')

const events: TimelineEvent[] = [
  {
    year: '1892',
    title: t('card_1_title'),
    description: t('card_1_description'),
    highlight: true
  },
  {
    year: '1924',
    title: t('card_2_title'),
    description: t('card_2_description')
  },
  {
    year: '1958',
    title: t('card_3_title'),
    description: t('card_3_description')
  },
  {
    year: '1980',
    title: t('card_4_title'),
    description: t('card_4_description')
  },
  {
    year: '2010',
    title: t('card_5_title'),
    description: t('card_5_description')
  },
  {
    year: '2023',
    title: t('card_6_title'),
    description: t('card_6_description')
  },
  {
    year: '2024',
    title: t('card_7_title'),
    description: t('card_7_description'),
    highlight: true
  }
]

  return (
    <section className="py-20 bg-surface-container-low" aria-labelledby="timeline-heading">
      <div className="container mx-auto px-6 md:px-12">
        <h2 
          id="timeline-heading"
          className="font-headline text-4xl md:text-5xl text-center text-primary mb-16 italic font-normal"
        >
          {t('title')}
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Línea vertical central */}
          <div 
            className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 top-0 bottom-0 bg-primary/30"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={event.year}
                className={`relative flex items-center justify-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Contenedor del evento */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div 
                    className={`
                      bg-surface p-6 rounded-lg shadow-lg 
                      ${event.highlight ? 'border-2 border-primary' : 'border border-outline-variant/20'}
                      hover:shadow-xl transition-shadow
                    `}
                  >
                    <div className="font-mono text-3xl text-tertiary-container font-bold mb-2">
                      {event.year}
                    </div>
                    <h3 className="font-headline text-2xl text-on-surface mb-3 italic font-normal">
                      {event.title}
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Punto central en la línea */}
                <div 
                  className={`
                    hidden md:block
                    absolute left-1/2 transform -translate-x-1/2 
                    w-6 h-6 rounded-full 
                    ${event.highlight ? 'bg-primary scale-125 ring-4 ring-primary/20' : 'bg-tertiary-container bg-primary'}
                    z-10
                  `}
                  aria-hidden="true"
                />

                {/* Espacio vacío en el otro lado */}
                <div className="hidden md:block w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
