import type { Metadata } from 'next'
import { Noto_Serif, Newsreader } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import CartDrawer from '@/components/cart/CartDrawer'
import './globals.css'

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

export const metadata: Metadata = {
  title: {
    default: 'La Casa de los Juegos — Granada',
    template: '%s | La Casa de los Juegos',
  },
  description: 'Juegos de mesa, puzzles, ajedrez y curiosidades lúdicas de todo el mundo. La tienda más especial de Granada, ahora en tu hogar.',
  keywords: ['juegos de mesa', 'puzzles', 'ajedrez', 'juegos del mundo', 'Granada'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${notoSerif.variable} ${newsreader.variable}`}>
      <body className="bg-[#fff8f6] text-[#2a170f] font-body antialiased">

        {/* Skip link accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#004317] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-bold"
        >
          Saltar al contenido principal
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

      </body>
    </html>
  )
}
