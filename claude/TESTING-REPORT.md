# Testing Report — LA CASA DE LOS JUEGOS

**Fecha:** 2026-04-05  
**Resultado final:** 9 archivos · 126 tests · 0 fallos

---

## Infraestructura de testing (preexistente)

| Herramienta | Versión | Uso |
|---|---|---|
| Vitest | ^4.1.2 | Runner principal |
| @testing-library/react | ^16.3.2 | Tests de componentes |
| @testing-library/user-event | ^14.6.1 | Simulación de interacciones |
| @testing-library/jest-dom | ^6.9.1 | Matchers adicionales |
| jsdom | ^29.0.1 | Entorno DOM para Vitest |

Configuración en `vitest.config.ts`: entorno `jsdom`, setup en `vitest.setup.ts`, alias `@/` resuelto a raíz del proyecto.

---

## Archivos de test preexistentes (no modificados)

| Archivo | Tests | Estado |
|---|---|---|
| `store/__tests__/cartStore.test.ts` | 23 | ✓ todos pasan |
| `components/admin/__tests__/AdminMobileNav.test.tsx` | 9 | ✓ todos pasan |
| `components/admin/__tests__/AdminSidebar.test.tsx` | 10 | ✓ todos pasan |

---

## Bloque 1 — Carrito y limpieza

### `store/__tests__/cartStore.test.ts` (preexistente)

23 tests ya existían y cubren el store completamente. No se tocó.

Cubre: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, drawer (`openCart`/`closeCart`/`toggleCart`), `totalItems()`, `totalPrice()`, `_hasHydrated`/`setHasHydrated`, storage corrupto, producto sin imagen.

---

### `components/pedido/__tests__/ClearCart.test.tsx` ✨ nuevo

**3 tests**

| Test | Verifica |
|---|---|
| llama a clearCart al montarse | El `useEffect` dispara `clearCart()` exactamente una vez |
| no renderiza contenido visible | El componente devuelve `null` |
| no llama a clearCart más de una vez | Idempotencia del montaje |

**Mocks:** `@/store/cartStore` → `useCartStore` con `clearCart` como `vi.fn()`

---

## Bloque 2 — Autenticación

### `actions/__tests__/auth.test.ts` ✨ nuevo

**20 tests**

#### `login()`
| Test | Verifica |
|---|---|
| devuelve `{ error }` con credenciales inválidas | Propagación del error de Supabase |
| devuelve `{ error }` con email no confirmado | Otro tipo de error de auth |
| llama a `revalidatePath` tras login correcto | Side effect de revalidación |
| devuelve `undefined` (éxito implícito) | Retorno vacío en happy path |
| asocia pedidos de invitado al usuario | Llama a `orders.update({ user_id })` con el id correcto |
| no intenta asociar pedidos si el login falla | Guarda condicional |
| no lanza aunque la asociación falle | Resiliencia: el `try/catch` interno absorbe el error |

#### `registro()`
| Test | Verifica |
|---|---|
| devuelve `{ error }` si el email ya existe | Error de Supabase Auth |
| devuelve `{ error }` si la contraseña es corta | Otro error de validación de Supabase |
| redirige a `verificar-email` con locale correcto | `redirect('/es/cuenta/verificar-email')` |
| usa `"es"` como locale por defecto | Valor por defecto cuando no se pasa locale |
| redirige con locale `"en"` | Multi-locale correcto |
| llama a `revalidatePath` antes de redirigir | Orden de operaciones |
| asocia pedidos si encuentra al usuario recién registrado | Admin `listUsers` + `update` |
| no asocia pedidos si `listUsers` no encuentra el email | Sin match → sin update |
| sigue redirigiendo aunque la asociación falle | Resiliencia |

#### `logout()`
| Test | Verifica |
|---|---|
| llama a `signOut` | Cierre de sesión |
| redirige al inicio con locale correcto | `redirect('/es/')` |
| redirige con locale `"en"` | Multi-locale |
| llama a `revalidatePath` antes de redirigir | Orden de operaciones |

**Mocks:**
- `@/lib/supabase/server` → cliente con `auth.signInWithPassword`, `signUp`, `signOut`
- `@/lib/supabase/admin` → `createAdminClient` con `from('orders').update(...)` y `auth.admin.listUsers`
- `next/navigation` → `redirect` lanza `Error('NEXT_REDIRECT:/...')` para simular comportamiento real de Next.js
- `next/cache` → `revalidatePath` como `vi.fn()`

**Patrón clave para `redirect`:** en Next.js App Router, `redirect()` lanza internamente. Los tests usan `.rejects.toThrow('NEXT_REDIRECT:/...')` para capturarlo.

---

### `components/auth/__tests__/LoginForm.test.tsx` ✨ nuevo

**10 tests**

| Test | Verifica |
|---|---|
| renderiza los campos de email y contraseña | Renderizado base |
| renderiza el botón de submit | Renderizado base |
| renderiza el enlace a recuperar contraseña | Renderizado base |
| renderiza el enlace al registro | Renderizado base |
| redirige a `/cuenta` tras login exitoso | `router.push('/cuenta')` |
| redirige a `redirectTo` personalizado | Prop opcional honrada |
| llama a la action con los datos del formulario | `FormData` con email y password correctos |
| muestra error de credenciales inválidas | Clave `error_invalid_credentials` |
| muestra error genérico para errores desconocidos | Clave `error_generic` |
| no redirige si la action devuelve error | `router.push` no se llama |
| deshabilita el botón durante la carga | `disabled` mientras `isPending` |

**Mocks:**
- `@/i18n/navigation` → `Link` como `<a>`, `useRouter` con `push`/`refresh` como `vi.fn()`
- `next-intl` → `useTranslations` devuelve el key tal cual

---

### `components/auth/__tests__/RegisterForm.test.tsx` ✨ nuevo

**11 tests**

| Test | Verifica |
|---|---|
| renderiza los cuatro campos | Nombre, email, password, confirmar |
| renderiza el botón de submit | Renderizado base |
| renderiza el enlace al login | Renderizado base |
| muestra error si las contraseñas no coinciden | Validación client-side |
| no llama a la action si las contraseñas no coinciden | Guard correcto |
| muestra error si la contraseña tiene < 8 caracteres | Validación client-side |
| no llama a la action si la contraseña es corta | Guard correcto |
| llama a la action si los datos son válidos | Happy path |
| no muestra error si el formulario es válido | Sin falsos positivos |
| muestra `error_user_already_registered` del servidor | Mapeo de errores de servidor |
| muestra `error_generic` para errores desconocidos | Fallback del mapeo |
| deshabilita el botón durante la carga | `disabled` mientras `isPending` |

---

## Bloque 3 — Checkout

### `app/api/checkout/__tests__/route.test.ts` ✨ nuevo

**15 tests**

| Test | Verifica |
|---|---|
| devuelve 400 si el carrito está vacío | Guard de items vacíos |
| devuelve 400 si items no existe | Guard de body incompleto |
| crea la sesión con line_items correctos | `unit_amount` en centavos, `currency: 'eur'`, nombre correcto |
| devuelve la URL de Stripe al frontend | `{ url }` en la respuesta |
| usa modo `"payment"` | Configuración básica de la sesión |
| success_url y cancel_url con locale correcto | Rutas internacionalizadas |
| solicita dirección para usuario invitado | `shipping_address_collection` presente |
| no solicita dirección si el perfil tiene dirección | `shipping_address_collection` ausente |
| solicita dirección si al perfil le falta ciudad | Validación de completitud de dirección |
| incluye email del usuario en la sesión | `customer_email` |
| incluye `user_id` en metadata | Trazabilidad del pedido |
| añade línea de envío si `shippingCost > 0` | `unit_amount: 495` para 4,95€ |
| no añade línea de envío si es 0 | Sin línea innecesaria |
| añade línea de descuento negativa | `unit_amount: -500` para 5€ |
| devuelve 500 si Stripe lanza un error | Manejo de error de red/Stripe |

**Mocks:**
- `stripe` → clase `MockStripe` con `checkout.sessions.create` como mock, usando `vi.hoisted()` para evitar problemas de hoisting con `vi.mock()`
- `@/lib/supabase/server` → `createClient` con `auth.getUser` y `from().select().eq().single()`

---

### `components/carrito/__tests__/CartSummary.test.tsx` ✨ nuevo

**16 tests**

#### Cálculo de totales
| Test | Verifica |
|---|---|
| muestra subtotal correcto | Valor del subtotal (React genera 2 nodos de texto: `"60,00"` + `"€"`) |
| muestra envío gratis cuando subtotal ≥ 50€ | Badge `"free"` |
| muestra coste de envío 4,95€ cuando subtotal < 50€ | Precio de envío |
| muestra nota de envío gratis pendiente | Texto con importe restante |
| muestra el total correcto sin cupón ni envío | Total = subtotal |

#### Cupón
| Test | Verifica |
|---|---|
| aplica JUEGOS10 y muestra descuento | `role="status"` con `"discount_applied"` |
| muestra descuento correcto (10% de 60€ = 6€) | Importe del descuento: `−6,00€` |
| acepta JUEGOS10 en minúsculas | Normalización con `.toUpperCase()` |
| muestra error con código inválido | `role="alert"` con `"invalid_code"` |
| deshabilita el input tras aplicar el cupón | `disabled` en el campo |

#### Checkout
| Test | Verifica |
|---|---|
| llama a `/api/checkout` con los items correctos | URL, método POST, items y locale en el body |
| redirige a la URL de Stripe si el checkout es exitoso | `window.location.href = url` |
| envía `shippingCost` correcto según el subtotal | 4.95 cuando < 50€ |
| envía `shippingCost: 0` cuando subtotal ≥ 50€ | Envío gratis |
| deshabilita el botón de checkout durante la petición | `disabled` mientras `loading` |

**Mocks:**
- `@/store/cartStore` → `useCartStore` con `items` y `totalPrice` como `vi.fn()` controlables
- `@/i18n/navigation` → `useRouter`
- `next-intl` → `useTranslations`, `useLocale`
- `fetch` global → `vi.stubGlobal('fetch', vi.fn())`
- `window.location` → `Object.defineProperty` para interceptar `href`

---

## Bloque 4 — Webhook y Email

### ✅ app/api/webhook/route.ts
- Tests: 14 passing
- File: `app/api/webhook/__tests__/route.test.ts`

Cubre: firma inválida (400), eventos no gestionados, sesión sin pago, idempotencia (pedido ya existe), creación de pedido con campos correctos, cálculo de subtotal con envío, cálculo de descuento, envío de email al cliente, no envía email sin customer email, envío de email al admin, llamada a `rpc decrementar_stock` por producto, error 500 en inserción BD, `user_id` de metadata, `user_id` null para invitados.

**Mocks:** `stripe` como clase (`MockStripe`), `@/lib/supabase/admin`, `@/lib/email/confirmacion-pedido`.

---

### ✅ lib/email/confirmacion-pedido.tsx
- Tests: 24 passing
- File: `lib/email/__tests__/confirmacion-pedido.test.ts`

Cubre `sendConfirmacionPedido`: destinatario correcto, número de pedido en asunto y HTML, nombres de productos, total formateado, "Gratis" para envío 0, coste de envío > 0, dirección incluida/excluida, remitente de CONTACT_EMAIL, resiliencia a errores de Resend, cantidades y precios.

Cubre `sendNuevoPedidoAdmin`: no envía sin ADMIN_EMAIL, envía al admin, número en asunto, email cliente en HTML, total formateado, enlace al panel con orderId, envío gratis/coste, dirección incluida/excluida, resiliencia, nombre del cliente.

---

## Bloque 5 — Auth Callbacks y Recuperar Password

### ✅ app/auth/callback/route.ts
- Tests: 7 passing
- File: `app/auth/callback/__tests__/route.test.ts`

Cubre: redirección con error a `/es/login?error=`, llamada a `exchangeCodeForSession` con code, redirección a `/es/cuenta` por defecto, redirección a `next` personalizado, sin code ni error → `/es/cuenta`, resiliencia a fallo de exchangeCode, error tiene prioridad sobre code.

---

### ✅ app/[locale]/auth/callback/route.ts
- Tests: 6 passing
- File: `app/[locale]/auth/callback/__tests__/route.test.ts`

Misma lógica que el callback raíz. Cubre los mismos casos más redirección a rutas con locale (ej. `/es/recuperar-password/nueva`).

---

### ✅ actions/recuperar-password.ts
- Tests: 13 passing
- File: `actions/__tests__/recuperar-password.test.ts`

Cubre `solicitarRecuperacion`: email correcto a Supabase, `NEXT_PUBLIC_SITE_URL` en redirectTo, locale en redirectTo, `success:true` aunque haya error de Supabase, `NEXT_PUBLIC_VERCEL_URL` como fallback, localhost como último fallback, `/auth/callback` en redirectTo.

Cubre `actualizarPassword`: llama a `updateUser`, `success:true` en happy path, propaga `error.message` para contraseña igual, sesión expirada, contraseña demasiado corta.

---

### ✅ components/auth/SolicitarRecuperacionForm
- Tests: 10 passing
- File: `components/auth/__tests__/SolicitarRecuperacionForm.test.tsx`

Cubre: campo email, botón submit, enlace a login, llamada a action con email, locale en FormData, mensaje de confirmación tras envío, oculta formulario tras envío, mensaje de spam, enlace a login en estado sent, botón disabled mientras pending.

---

### ✅ components/auth/NuevaPasswordForm
- Tests: 15 passing
- File: `components/auth/__tests__/NuevaPasswordForm.test.tsx`

Cubre: campos de contraseña y confirmación, botón submit, error si contraseñas no coinciden, no llama action si no coinciden, error si < 6 chars, no llama action si corta, llamada a action en happy path, redirección a `/cuenta` tras éxito, errores del servidor (same_password, session_missing, too_many_requests, error_generic), no redirige si hay error, botón disabled mientras pending.

---

## Bloque 6 — Cuenta

### ✅ actions/cuenta.ts
- Tests: 21 passing
- File: `actions/__tests__/cuenta.test.ts`

Cubre `actualizarPerfil`: error sin sesión, update con datos correctos, error BD, revalidatePath.
Cubre `actualizarDireccion`: error sin sesión, update con todos los campos, error BD.
Cubre `cambiarEmail`: error sin sesión, error si email igual, llama a updateUser, error Supabase, revalidatePath.
Cubre `cambiarPassword`: error sin sesión, llama a updateUser, error Supabase, revalidatePath.
Cubre `solicitarDevolucion`: no autenticado, pedido no encontrado, pedido no en delivered, actualiza a return_requested, error en update.

---

### ✅ components/cuenta/DatosPersonalesForm
- Tests: 10 passing
- File: `components/cuenta/__tests__/DatosPersonalesForm.test.tsx`

Cubre: nombre con valor actual, teléfono con valor actual, email deshabilitado, campos vacíos sin perfil, botón guardar, llamada a actualizarPerfil, mensaje de éxito, error de action, no muestra éxito si hay error, botón disabled mientras pending.

---

### ✅ components/cuenta/DireccionForm
- Tests: 13 passing
- File: `components/cuenta/__tests__/DireccionForm.test.tsx`

Cubre: dirección, ciudad, CP con valores actuales, selector de país ES por defecto, botón guardar, campos vacíos sin perfil, selector ES sin perfil, llamada a actualizarDireccion, éxito, error, no éxito si hay error, cambio de país, botón disabled.

---

### ✅ components/cuenta/SeguridadForm
- Tests: 13 passing
- File: `components/cuenta/__tests__/SeguridadForm.test.tsx`

Cubre email actual deshabilitado, campo nuevo email, campo contraseña, campo confirmar, botones, llamada a cambiarEmail, email_success, error cambio email, error contraseñas no coinciden (no llama action), error < 8 chars (no llama action), llamada a cambiarPassword válida, password_success, error cambiarPassword.

---

### ✅ components/cuenta/CuentaDashboard
- Tests: 11 passing
- File: `components/cuenta/__tests__/CuentaDashboard.test.tsx`

Cubre: saludo con primer nombre, email usuario, nombre de email si no hay perfil, tab pedidos activo por defecto, otros tabs ocultos al inicio, cambio a favoritos, ajustes y reseñas, badge con número de pedidos, badge con número de favoritos, sin badge cuando no hay pedidos.

---

### ✅ app/[locale]/cuenta/page.tsx
- Tests: 5 passing
- File: `app/[locale]/cuenta/__tests__/page.test.tsx`

Cubre: redirección a login si no hay usuario, locale correcto en redirección, llamada a redirect, render de CuentaDashboard autenticado con email correcto, orders vacío si consulta devuelve null.

---

## Resumen de cobertura por dominio

| Dominio | Archivos de test | Tests |
|---|---|---|
| Store (carrito) | 1 | 23 |
| Componente ClearCart | 1 | 3 |
| Server Action auth | 1 | 20 |
| Componente LoginForm | 1 | 10 |
| Componente RegisterForm | 1 | 11 |
| Route Handler checkout | 1 | 15 |
| Componente CartSummary | 1 | 16 |
| Admin (preexistente) | 2 | 19 |
| Route Handler webhook | 1 | 14 |
| Email confirmacion-pedido | 1 | 24 |
| Auth callback (raíz) | 1 | 7 |
| Auth callback (locale) | 1 | 6 |
| Action recuperar-password | 1 | 13 |
| SolicitarRecuperacionForm | 1 | 10 |
| NuevaPasswordForm | 1 | 15 |
| Action cuenta | 1 | 21 |
| DatosPersonalesForm | 1 | 10 |
| DireccionForm | 1 | 13 |
| SeguridadForm | 1 | 13 |
| CuentaDashboard | 1 | 11 |
| Página cuenta | 1 | 5 |
| **Total** | **22** | **288** |

---

## Decisiones técnicas

### `vi.hoisted()` para Stripe
La clase `MockStripe` referencia `mockCreateSession`. Como `vi.mock()` se eleva (hoisting) al inicio del archivo pero las declaraciones `const` no, se usó `vi.hoisted()` para crear el mock antes del hoisting. El mismo patrón se aplica al webhook (clase `MockStripe` con `webhooks.constructEvent` y `checkout.sessions.retrieve`).

### Mocking de `redirect()` de Next.js
`redirect()` en App Router lanza un error especial internamente. El mock lanza `new Error('NEXT_REDIRECT:/...')` para replicar este comportamiento. Los tests usan `.rejects.toThrow('NEXT_REDIRECT:...')`.

### `useTranslations` devuelve el key tal cual
En lugar de montar `NextIntlClientProvider` con mensajes reales, el mock devuelve el key de traducción directamente (`(key) => key`). Esto aísla los tests de los mensajes y los hace más robustos frente a cambios de texto.

### Dos nodos de texto en precios
JSX como `{value.toFixed(2)}€` genera dos nodos de texto separados en el DOM. `getByText('60,00€')` falla. Solución: `getAllByText(/60,00/)`.

### Supabase chain builder pattern
Para simular las cadenas de llamadas de Supabase (`.from().select().eq().single()`), se usa un helper `buildChain()` que crea un objeto con todos los métodos como `vi.fn()` que devuelven el propio objeto, y `.single()` resuelve con el valor deseado.

### Mocks de componentes hijos en CuentaDashboard
Los componentes hijos (PedidosTab, FavoritosTab, etc.) se mockean completamente con `vi.mock()` para aislar el test del dashboard de la complejidad de sus hijos y de sus dependencias (Supabase client-side, SWR, etc.).
