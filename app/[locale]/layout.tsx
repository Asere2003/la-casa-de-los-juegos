import './globals.css'

import { Newsreader, Noto_Serif } from 'next/font/google'
import { getMessages, getTranslations } from 'next-intl/server'

import BottomNav from '@/components/layout/BottomNav'
import CartDrawer from '@/components/carrito/CartDrawer'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-headline',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'accessibility' })
  return {
    title: {
      default: 'La Casa de los Juegos — Granada',
      template: '%s | La Casa de los Juegos',
    },
    description: 'Juegos de mesa, puzzles, ajedrez y curiosidades lúdicas de todo el mundo. La tienda más especial de Granada, ahora en tu hogar.',
    keywords: ['juegos de mesa', 'puzzles', 'ajedrez', 'juegos del mundo', 'Granada'],
    other: { 'skip-label': t('skip_to_content') },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'es' | 'en' | 'cat')) {
    notFound()
  }

  const messages = await getMessages()
  const t = await getTranslations('accessibility')

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${notoSerif.variable} ${newsreader.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
          suppressHydrationWarning 
          className="bg-[#fff8f6] text-[#2a170f] font-body antialiased">
        <NextIntlClientProvider messages={messages}>

          {/* Skip link accesibilidad */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#004317] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-bold"
          >
            {t('skip_to_content')}
          </a>

          {/* Grain overlay */}
          <div aria-hidden="true" className="grain-overlay" />

          <Header />
          <CartDrawer />

          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>

          <Footer />
          <BottomNav />

        </NextIntlClientProvider>
      </body>
    </html>
  )
}
