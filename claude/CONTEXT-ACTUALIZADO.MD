# CONTEXTO — LA CASA DE LOS JUEGOS

Soy el desarrollador de LA CASA DE LOS JUEGOS, un ecommerce de juegos de mesa, puzzles, ajedrez y curiosidades lúdicas inspirado en una tienda física de Granada. La tienda está publicada en producción en lacasadelosjuegos.com

## STACK TÉCNICO
- Next.js 15 + TypeScript + Tailwind CSS v4
- Supabase (BD + Auth) con @supabase/ssr
- Stripe (pagos) — modo live activo
- Cloudinary (imágenes) — cloud: db3v04xc1, preset: lacasadelosjuegos
- Resend (emails) — dominio lacasadelosjuegos.com
- Vercel (hosting) — producción activa
- next-intl para i18n (es/en/cat) — COMPLETADO
- Embla Carousel — instalado en ProductGallery
- SWR — usado en useUserReviews y useReviewedProductIds
- Vitest + Testing Library — configurado y funcionando
- Playwright — para E2E

## DISEÑO
- Verde primario: `#004317` / `#1a5c2a`
- Dorado: `#c9a84c`
- Madera oscura: `#2c1810`
- Crema: `#fff8f6`
- Fuentes: Noto Serif (headlines) + Newsreader (body) + JetBrains Mono
- Bordes: border-radius 2px en casi todo
- globals.css: btn-primary, btn-gold, btn-outline, product-card, badge, input-base, section-label, gold-rule

## REGLAS TÉCNICAS CRÍTICAS
- Middleware: solo next-intl, NUNCA mezclar con Supabase
- Login redirige desde CLIENTE (router.push), NO desde Server Action
- getSession() para cliente, getUser() para servidor
- force-dynamic en páginas protegidas
- createAdminClient() SOLO en webhook y registro
- Tailwind v4: NO usar content array en tailwind.config.ts
- Params en Route Handlers son Promise en Next.js 15+
- NEXT_PUBLIC_SITE_URL sin locale al final
- Server Components: getTranslations (async) / Client Components: useTranslations (hook)
- Client Components: NO await en top level — usar useEffect + useState
- Para acceder a todos los profiles usar createServiceClient con SUPABASE_SERVICE_ROLE_KEY

## SUPABASE — TABLAS Y VISTAS
- profiles, products, categories, orders, order_items, favorites, reviews
- Vista: categories_with_count (con key y product_count)
- Vista: products_with_stats (con avg_rating y review_count)
- Unique Constraint: reviews_user_product_unique (user_id, product_id)
- Función SQL: decrementar_stock(producto_id uuid, cantidad integer) SECURITY DEFINER

## LO QUE ESTÁ HECHO
- Home, catálogo, ficha producto conectados a Supabase
- Auth completa: registro, login, logout, verificación email, recuperar contraseña
- Panel cuenta: ajustes + pedidos + favoritos + reseñas (con SWR)
- Panel admin: CRUD productos + pedidos + usuarios + analytics (GA4)
- Checkout completo con Stripe: pago, webhook, confirmación, email
- Reseñas completas en ficha producto, catálogo, home y panel cuenta
- useReviewedProductIds — hook SWR
- ProductGallery con Embla Carousel (swipe táctil)
- Google Analytics G-JNBLGT2K6N
- Vista SQL products_with_stats con avg_rating y review_count
- overflow-x-hidden en body para evitar scroll lateral en móvil
- Panel admin usuarios con cambio de roles (usa service role para saltar RLS)
- Logo en emails Resend (Cloudinary URL: https://res.cloudinary.com/db3v04xc1/image/upload/v1775222426/icons/logo_new.svg)
- Emails Supabase con logo
- Dropdown cerrar sesión desktop en Header
- Banderas en selector de idioma (flag-icons CDN)
- Página de contacto con formulario → Resend → admin
- Footer refactorizado en componentes: FooterBrand, FooterLinks, FooterNewsletter, FooterLegal
- Newsletter conectado a Resend → admin
- Landing /proximamente para Instagram con captura de emails
- i18n completo ES/EN/CAT
- ProductDrawer — ficha de producto como panel lateral igual que CartDrawer
  - store/productDrawerStore.ts (Zustand)
  - components/producto/ProductDrawer.tsx
  - Se abre desde: ProductCard, RelatedProducts, FavoritosTab, CartDrawer
- Agente SEO corriendo en Claude Code (.claude/AGENTS.md)
- Agente i18n completado (.claude/i18n-refactor.md)
- Agente testing configurado (.claude/testing-agent.md) — Bloques 1-3 completados
- Todos los bugs conocidos resueltos — la tienda está estable en producción

## ESTRUCTURA DE EMAILS (Resend)
- lib/emails/sendConfirmacionPedido.ts
- lib/emails/sendEstadoPedido.ts
- lib/emails/sendNuevoPedidoAdmin.ts
- lib/emails/sendContacto.ts
- lib/emails/sendNewsletterAdmin.ts
- app/api/contacto/route.ts
- app/actions/contacto.ts
- app/actions/newsletter.ts

## AGENTES EN .claude/
- AGENTS.md — agente SEO
- i18n-refactor.md — agente i18n (completado)
- testing-agent.md — agente testing (Bloques 1-3 completos, 4-9 pendientes)
- product-drawer.md — agente drawer (completado)
- fix-code-issues.md
- TESTING_PLAN.md — plan completo de testing por fases y bloques

## MODELO DE NEGOCIO — DROPSHIPPING
- Proveedor principal: OcioStock (pendiente de alta)
- Modelo inicial: 100% dropshipping — sin stock físico propio
- OcioStock gestiona almacén, logística y envío al cliente final
- +11.000 referencias disponibles con PVP recomendado
- Envío mismo día si pedido antes de las 12h (días laborables)
- Coste de dropshipping: entre 0,85€ y 2,50€ por pedido según importe
- Sin pedido mínimo ni cuotas
- Sincronización de stock y precios en tiempo real (ficheros pendientes de recibir)
- Pendiente: recibir documentación de API/CSV de OcioStock tras darse de alta
- El sistema de importación se construirá cuando se tenga el formato real de sus ficheros

## GOOGLE ANALYTICS — ESTADO Y PRÓXIMOS PASOS

### Implementado
- GA4 con ID: G-JNBLGT2K6N
- Eventos básicos de pageview automáticos

### Eventos de ecommerce a implementar (GA4 estándar)
Estos son los eventos recomendados por Google para ecommerce. Hay que añadirlos
al código en los puntos exactos del flujo de compra:

| Evento | Dónde dispararlo |
|---|---|
| `view_item_list` | Catálogo — cuando se renderizan productos |
| `view_item` | Ficha de producto / ProductDrawer al abrirse |
| `add_to_cart` | Al añadir al carrito |
| `remove_from_cart` | Al quitar del carrito |
| `begin_checkout` | Al iniciar el checkout |
| `add_payment_info` | Al introducir datos de pago en Stripe |
| `purchase` | En webhook de Stripe tras pago confirmado |
| `view_cart` | Al abrir el CartDrawer |

Cada evento debe incluir: `item_id`, `item_name`, `item_category`, `price`, `quantity`, `currency: 'EUR'`

### Métricas clave a monitorizar en GA4
Una vez implementados los eventos, estas son las métricas más útiles para la tienda:

**Embudo de compra**
- Tasa de conversión: visitas → compra
- Abandono de carrito: cuántos añaden pero no compran
- Abandono de checkout: cuántos inician pago pero no terminan

**Productos**
- Productos más vistos (`view_item`)
- Productos más añadidos al carrito vs. más comprados (ratio conversión por producto)
- Categorías más rentables por ingresos

**Tráfico y adquisición**
- Fuentes de tráfico que más convierten (orgánico, directo, redes sociales)
- Engagement rate por página de destino
- Dispositivo (móvil vs escritorio) y su tasa de conversión

**Negocio**
- Ingresos totales y por transacción
- Ticket medio (AOV = ingresos / transacciones)
- Usuarios nuevos vs. recurrentes
- LTV (valor de vida del cliente)

### Pendiente de implementar
- Añadir los eventos de ecommerce al código (ver tabla arriba)
- Configurar conversiones en GA4 (marcar `purchase` como evento de conversión)
- Implementar User-ID para usuarios logueados (evita contar el mismo usuario dos veces)
- Dashboard admin con métricas GA4 más detalladas (usando GA4 Data API)
- Vincular GA4 con Google Search Console

## PENDIENTE
- Sistema de importación de productos OcioStock (esperar ficheros tras alta)
- Tests Bloques 4-9
- Analytics GA4: implementar eventos de ecommerce (ver sección GA)
- DNS final IONOS
- Sistema de descuentos/cupones
- Bot de WhatsApp
- Teléfono en más sitios de la web
- i18n admin (descartado — solo uso interno)

## PREFERENCIAS DE TRABAJO
- Archivos completos, no diffs parciales
- Explicación antes de código en conceptos nuevos
- Un archivo a la vez, sin reescribir lo que ya funciona
- Pregunta antes de escribir código si no tienes claro algo