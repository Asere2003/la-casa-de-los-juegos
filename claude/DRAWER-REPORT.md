# Product Drawer — Informe de implementación

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `store/productDrawerStore.ts` | Store Zustand con `isOpen`, `slug`, `openProduct()`, `closeProduct()` |
| `components/shared/ProductCardLink.tsx` | Componente cliente que intercepta clicks normales para abrir el drawer; Ctrl/Cmd/middle-click abren la página normalmente |
| `components/producto/ProductDrawer.tsx` | Panel lateral con overlay, animación, fetch del producto, y contenido completo |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `components/catalogo/ProductGrid.tsx` | El `ProductCard` interno del catálogo tenía sus propios `<Link>` — reemplazados por `<a onClick={openProduct}>` |
| `components/cuenta/Resenastab.tsx` | 2 links a producto (pendientes de reseñar + cabecera de ReviewCard) reemplazados por `<a onClick={openProduct}>` |
| `components/carrito/CartItem.tsx` | 2 links en la página `/carrito` (imagen + nombre) reemplazados por `<a onClick={openProduct}>` |
| `components/home/BestsellersSection.tsx` | 2 links en la sección Bestsellers de la home (imagen + nombre) reemplazados por `<a onClick={openProduct}>` |
| `components/shared/ProductCard.tsx` | Los 3 `<Link>` reemplazados por `<ProductCardLink>` (home: NewArrivals, Bestsellers) |
| `components/cuenta/FavoritosTab.tsx` | Reemplazados los 2 `<Link>` de imagen y nombre por `<a onClick={openProduct}>` |
| `components/producto/RelatedProducts.tsx` | Reemplazados los 3 `<Link>` de productos relacionados por `<a onClick={openProduct}>` |
| `components/carrito/CartDrawer.tsx` | Los 2 links de imagen y nombre del producto ahora llaman `closeCart() + openProduct()` |
| `app/[locale]/layout.tsx` | Registrado `<ProductDrawer />` justo después de `<CartDrawer />` |
| `messages/es.json` | Añadido namespace `product_drawer` |
| `messages/en.json` | Añadido namespace `product_drawer` |
| `messages/cat.json` | Añadido namespace `product_drawer` |

## Decisiones técnicas

### Sin API route
`getProductBySlug` usa `createBrowserClient` (cliente público con clave anon), lo que permite llamarlo directamente desde el componente cliente. No hace falta una API route intermedia.

### ProductCardLink como `<a>` con href
Se mantiene el `href` correcto (con locale) para:
- Ctrl/Cmd+click → abre en nueva pestaña (comportamiento nativo del navegador)
- Crawlers SEO siguen viendo el enlace real
- Accesibilidad: el elemento tiene semántica de enlace

### Shallow routing con `pushState` + `replaceState`
- Al abrir: `pushState` actualiza la URL a `/{locale}/producto/{slug}`
- Al cerrar (botón/ESC/overlay): `replaceState` restaura la URL anterior de forma síncrona, sin navegación
- Al presionar atrás en el navegador: listener `popstate` cierra el drawer; el navegador ya gestiona la URL

### Z-index sobre el carrito
- CartDrawer: `z-[70]`
- ProductDrawer overlay: `z-[71]`, panel: `z-[72]`

Esto permite que el drawer de producto se abra encima del carrito cuando el usuario hace click en un producto desde el carrito.

### Auth en el drawer
Se obtiene el `userId` con `supabase.auth.getUser()` al montar el componente. El `FavoriteButton` dentro de `ProductInfo` funciona correctamente para usuarios autenticados. El estado `isFavorite` se pasa como `false` (el botón de favorito siempre renderiza, y si el usuario hace click, el servidor actualiza el estado).

### Página `/producto/[slug]` intacta
La página completa no ha sido modificada. Sigue funcionando para:
- Navegación directa (SEO, compartir enlace, Google)
- Usuarios sin JavaScript
- El drawer enlaza a la página completa con "Ver ficha completa"

### ProductReviews no incluido en el drawer
`ProductReviews` es un Server Component async. No se puede renderizar directamente en un Client Component. En su lugar, el drawer incluye un botón "Ver ficha completa" que lleva a la página del producto donde están las reseñas.

## Nota sobre ProductReviews

`components/producto/ProductReviews.tsx` no contiene ningún enlace a productos. Muestra únicamente nombre del revisor, fecha, estrellas y texto de la reseña. No hay nada que interceptar.

El componente con links a productos dentro de la sección de reseñas es `components/cuenta/Resenastab.tsx` (pestaña "Mis reseñas" en la cuenta del usuario). Tiene dos links: el nombre del producto en la sección de pendientes y la cabecera de cada reseña en `ReviewCard`.

## Puntos a revisar

1. **`isFavorite` en el drawer**: siempre se pasa `false`. Si un usuario tiene el producto en favoritos, el corazón aparecerá vacío hasta que interactúe con él. Para corregirlo habría que añadir una consulta extra al cargar el producto.

2. **Scroll en iOS**: en dispositivos iOS el `overflow-y: auto` dentro de un `fixed` puede necesitar `-webkit-overflow-scrolling: touch`. Verificar en dispositivo real.

3. **Animación de entrada**: si se desea una animación más elaborada (slide desde abajo en móvil, desde la derecha en desktop), se puede añadir CSS adicional.

4. **Caché de productos**: actualmente cada apertura del drawer hace una nueva llamada a Supabase. Se podría optimizar con un caché simple (Map en el store o SWR).
