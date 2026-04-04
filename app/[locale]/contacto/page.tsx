// app/[locale]/contacto/page.tsx

import { ContactForm } from '@/components/contacto/ContactForm'
import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lacasadelosjuegos.com'

export const metadata: Metadata = {
  title: 'Contacto | La Casa de los Juegos',
  description: 'Ponte en contacto con La Casa de los Juegos. Respondemos en menos de 48 horas hábiles.',
  openGraph: {
    title: 'Contacto | La Casa de los Juegos',
    description: 'Ponte en contacto con La Casa de los Juegos. Respondemos en menos de 48 horas hábiles.',
    url: `${siteUrl}/es/contacto`,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Contacto La Casa de los Juegos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto | La Casa de los Juegos',
    description: 'Ponte en contacto con La Casa de los Juegos. Respondemos en menos de 48 horas hábiles.',
    images: [`${siteUrl}/og-image.jpg`],
  },
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#fff8f6] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <span className="section-label">¿Hablamos?</span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#2c1810] mt-3 mb-2">
            Contacto
          </h1>
          <div className="gold-rule mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl text-[#2c1810] mb-3">
                La Casa de los Juegos
              </h2>
              <p className="text-[#2c1810]/70 leading-relaxed">
                Tienda especializada en juegos de mesa, puzzles, ajedrez y curiosidades
                lúdicas con raíces en Granada.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-[#c9a84c] text-xl">✉</span>
                <div>
                  <p className="font-medium text-[#2c1810] text-sm uppercase tracking-wider">Email</p>
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    className="text-[#1a5c2a] hover:underline"
                  >
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#c9a84c] text-xl">📍</span>
                <div>
                  <p className="font-medium text-[#2c1810] text-sm uppercase tracking-wider">Ubicación</p>
                  <p className="text-[#2c1810]/70">Granada, Andalucía, España</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#c9a84c] text-xl">🕐</span>
                <div>
                  <p className="font-medium text-[#2c1810] text-sm uppercase tracking-wider">
                    Tiempo de respuesta
                  </p>
                  <p className="text-[#2c1810]/70">En menos de 48 horas hábiles</p>
                </div>
              </div>
            </div>

            <div className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 p-4 rounded-[2px]">
              <p className="text-sm text-[#2c1810]/70">
                <strong className="text-[#2c1810]">¿Tienes un pedido?</strong>{' '}
                Incluye tu número de pedido en el asunto del email para que podamos
                ayudarte más rápido.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <ContactForm />
        </div>
      </div>
    </main>
  )
}