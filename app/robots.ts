import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Rutas privadas — wildcard cubre los 3 locales (es/en/cat)
        '/*/cuenta',
        '/*/carrito',
        '/*/login',
        '/*/registro',
        '/*/recuperar-password',
        '/*/admin/',
        '/*/pedido/',
        // API interna
        '/api/',
        // Callbacks de autenticación
        '/auth/',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
