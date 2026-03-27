import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const legalPages = ['privacidad', 'terminos', 'devoluciones', 'legal', 'cookies']
const locales = ['en', 'cat']

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
  async redirects() {
    const legalRedirects = legalPages.flatMap(page =>
      locales.map(locale => ({
        source: `/${locale}/${page}`,
        destination: `/es/${page}`,
        permanent: false,
      }))
    )

    return [
      {
        source: '/',
        destination: '/es',
        permanent: false,
      },
      ...legalRedirects,
    ]
  },
}

export default withNextIntl(nextConfig)