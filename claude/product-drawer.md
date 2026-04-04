# Product Drawer — Ficha de producto como panel lateral

## Contexto del proyecto
- Next.js 15 + TypeScript + Tailwind CSS v4
- next-intl para i18n (es/en/cat)
- Zustand para estado global (ver cartStore como referencia)
- El carrito ya funciona como drawer lateral — seguir EXACTAMENTE el mismo patrón

## Objetivo
Actualmente al hacer click en un producto navega a `/producto/[slug]`.
El problema: al volver atrás el scroll del catálogo/home se pierde.

La solución: abrir la ficha del producto en un panel lateral (drawer) igual que el carrito,
sin cambiar de página. El scroll queda intacto.

## Archivos de referencia obligatoria
Antes de escribir código lee y entiende estos archivos:
- `store/cartStore.ts` — patrón del store Zustand
- `components/carrito/CartDrawer.tsx` — patrón del drawer (overlay + panel + animación)
- `components/shared/ProductCard.tsx` — donde está el Link que hay que interceptar
- `app/[locale]/producto/[slug]/page.tsx` — contenido que hay que mostrar en el drawer

## Plan de implementación

### PASO 1 — Crear el store del producto
Crea `store/productDrawerStore.ts` siguiendo el mismo patrón que `cartStore.ts`:
- Estado: `isOpen: boolean`, `slug: string | null`
- Acciones: `openProduct(slug: string)`, `closeProduct()`

### PASO 2 — Crear el ProductDrawer
Crea `components/producto/ProductDrawer.tsx` siguiendo EXACTAMENTE el patrón de `CartDrawer.tsx`:
- Overlay con backdrop-blur
- Panel desde la derecha: `w-full max-w-2xl` (más ancho que el carrito para mostrar el producto)
- Animación `translate-x-full` → `translate-x-0`
- Escape para cerrar
- Trap focus
- `overflow-y-auto` para scroll interno
- Dentro del panel: fetch del producto por slug y mostrar la ficha completa
- Botón X para cerrar arriba a la derecha
- En móvil: panel ocupa pantalla completa (`max-w-full`)

Para cargar el producto usa el mismo fetch que hace `app/[locale]/producto/[slug]/page.tsx`.
Reutiliza los componentes existentes: `ProductGallery`, `ProductInfo`, `ProductReviews`.

### PASO 3 — Adaptar ProductCard
`ProductCard` es actualmente un Server Component async.
Divídelo en dos partes:
- `ProductCard.tsx` — mantenerlo como Server Component para el render
- Sustituye los `<Link href="/producto/slug">` por un botón/div con `onClick` que llame a `openProduct(slug)` del store
- Usa un Client Component wrapper pequeño para el comportamiento del click

### PASO 4 — Registrar el ProductDrawer en el layout
Añade `<ProductDrawer />` en `app/[locale]/layout.tsx` justo después de `<CartDrawer />`.

### PASO 5 — Verificar todos los puntos de entrada
El drawer debe abrirse desde:
- `components/shared/ProductCard.tsx` — catálogo y home
- `components/producto/RelatedProducts.tsx` — productos relacionados en la ficha
- `components/carrito/CartDrawer.tsx` — links al producto dentro del carrito (ya tienen onClick={closeCart}, añadir openProduct)

### PASO 6 — La URL debe cambiar (shallow routing)
Cuando se abre el drawer, actualiza la URL a `/producto/[slug]` sin navegar:
```ts
window.history.pushState(null, '', `/${locale}/producto/${slug}`)
```
Y al cerrar restaura la URL anterior:
```ts
window.history.back()
```
Esto permite compartir la URL y que Google indexe el producto.

### PASO 7 — Manejar navegación directa
Si alguien llega directamente a `/producto/[slug]` (desde Google, compartir enlace),
la página `app/[locale]/producto/[slug]/page.tsx` debe seguir funcionando normalmente.
No la elimines — mantenla tal como está.

## Reglas críticas
- Sigue EXACTAMENTE el patrón visual y de código de CartDrawer.tsx
- NO uses Intercepting Routes de Next.js — solución pura con Zustand + drawer
- NO elimines la página /producto/[slug] — debe seguir funcionando
- NO cambies la lógica de negocio ni los queries de Supabase
- NO toques: middleware.ts, lib/supabase/queries.ts, stripe webhook
- Usa los mismos colores, border-radius 2px, tipografías del proyecto
- El drawer debe funcionar igual en móvil y desktop
- Comprueba que compila antes de pasar al siguiente paso

## Al terminar
Genera `.claude/DRAWER-REPORT.md` con:
- Archivos creados
- Archivos modificados
- Cualquier decisión técnica tomada
- Posibles puntos a revisar