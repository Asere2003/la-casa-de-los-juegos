# SEO Report — La Casa de los Juegos
Fecha: 2026-04-04

## 1. METADATA

### `app/[locale]/layout.tsx`
- Añadidas Twitter cards por defecto (`summary_large_image`) con imagen OG
- Añadida imagen OG por defecto al bloque `openGraph`

### `app/[locale]/page.tsx` (Home)
- Añadidas Twitter cards y OG images con imagen genérica del sitio

### `app/[locale]/catalogo/page.tsx`
- Añadida `generateMetadata` con title, description completos
- Canonical apunta a la URL limpia (sin query params `?category=&search=`)
- Alternates hreflang para es/en/ca
- OpenGraph y Twitter cards

### `app/[locale]/contacto/page.tsx`
- Mejorada description (demasiado corta antes)
- Añadidas OpenGraph y Twitter cards

### `app/[locale]/historia/page.tsx`
- Añadidas OpenGraph y Twitter cards

### `app/[locale]/login/page.tsx`
- Añadido `robots: { index: false, follow: false }` (página privada)

### `app/[locale]/registro/page.tsx`
- Añadido `robots: { index: false, follow: false }` (página privada)

### `app/[locale]/recuperar-password/page.tsx`
- Añadida `export const metadata` con title, description y noindex

### `app/[locale]/pedido/confirmacion/page.tsx`
- Añadida `export const metadata` con title, description y noindex

---

## 2. HEADINGS
- Estructura h1→h2→h3 revisada: correcta en todas las páginas.
- `historia`: h1 en `HeroHistoria`, h2 en secciones ✅
- `contacto`: h1 visible ✅
- `producto/[slug]`: h1 en `ProductInfo` ✅

---

## 3. ALT TEXTS
- Sin `<img>` nativas encontradas en el codebase.
- Todos los componentes de imagen usan `CldImage` o `next/image` con alt explícito.
- Imágenes en `historia/page.tsx`: alt texts descriptivos ✅

---

## 4. SCHEMA MARKUP (JSON-LD)

### `app/[locale]/layout.tsx` — Organization
```json
{
  "@type": "Organization",
  "name": "La Casa de los Juegos",
  "foundingDate": "1892",
  "address": { "addressLocality": "Granada", "addressCountry": "ES" }
}
```

### `app/[locale]/producto/[slug]/page.tsx` — Product
```json
{
  "@type": "Product",
  "offers": { "priceCurrency": "EUR", "availability": "InStock/OutOfStock" },
  "aggregateRating": { ... }  // si hay reseñas
}
```

### `app/[locale]/catalogo/page.tsx` — BreadcrumbList
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [{ "name": "Inicio" }, { "name": "Catálogo" }]
}
```

---

## 5. SITEMAP
Añadidas rutas estáticas faltantes en `app/sitemap.ts`:
- `/contacto` — priority 0.5, yearly
- `/devoluciones` — priority 0.3, yearly
- `/legal` — priority 0.2, yearly
- `/privacidad` — priority 0.2, yearly
- `/terminos` — priority 0.2, yearly
- `/cookies` — priority 0.2, yearly

---

## 6. ROBOTS.TXT
- `app/robots.ts` ya estaba correcto y completo. Sin cambios.
- Rutas privadas bloqueadas: cuenta, carrito, login, registro, recuperar-password, admin, pedido, api, auth.

---

## 7. CANONICAL URLS
- `catalogo/page.tsx`: canonical apunta a `/{locale}/catalogo` sin query params (fix para ?search=&category=)
- `producto/[slug]/page.tsx`: canonical ya existía con URL limpia ✅
- `layout.tsx`: canonical base por locale ✅

---

## 8. PERFORMANCE
- No se encontraron `<img>` nativas en ningún componente.
- `HeroSection` usa `CldImage` con `loading="eager"` (correcto para LCP).
- Sin cambios necesarios.

---

## Estado final
- `npx tsc --noEmit`: 0 errores ✅
- Todas las páginas públicas tienen metadata completa con OG y Twitter cards
- Páginas privadas marcadas con noindex
- JSON-LD en layout (Organization), ficha de producto (Product) y catálogo (BreadcrumbList)
- Sitemap completo con todas las rutas públicas
