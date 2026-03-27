# Plan de testing para **LA CASA DE LOS JUEGOS**

Documento de referencia para construir una suite de tests escalable, mantenible y alineada con la arquitectura actual del proyecto.

---

# 1. Objetivo del plan

Este documento define cómo testear **LA CASA DE LOS JUEGOS** de forma profesional, pragmática y por fases, evitando tanto el infra-testing como el over-testing.

El objetivo no es alcanzar “100% coverage”, sino proteger las partes con mayor riesgo real:

* autenticación
* checkout
* persistencia de pedidos
* descuento de stock
* asociación de pedidos de invitado
* permisos de admin
* estabilidad del carrito
* integraciones críticas

Este plan está pensado para implementar tests **archivo por archivo**, con prioridad de negocio, de modo que cada bloque añadido aumente la confianza del sistema sin frenar el desarrollo.

---

# 2. Estrategia global de testing

## Tipos de tests a usar

### 2.1 Unit tests

Para lógica aislada, determinista y rápida.

Aplicar en:

* utilidades puras
* transformaciones de datos
* validaciones
* store de Zustand
* helpers de construcción de payloads
* pequeñas funciones de soporte en `lib/`

No usar unit tests para:

* validar que Next.js renderiza correctamente una página simple
* repetir el comportamiento interno de librerías externas
* testear componentes triviales sin lógica

---

### 2.2 Integration tests

Serán el núcleo de la suite.

Aplicar en:

* Server Actions
* Route Handlers
* componentes con interacción relevante
* piezas que coordinan varias dependencias
* auth + Supabase
* checkout + Stripe
* webhook + BD + email

Aquí es donde más valor se obtiene porque el proyecto depende de flujos, no solo de funciones aisladas.

---

### 2.3 E2E tests

Para validar recorridos críticos de usuario reales.

Aplicar solo a los flujos de máximo valor:

* registro
* login
* recuperación de contraseña
* compra como invitado
* compra logado
* acceso a cuenta
* acceso admin
* flujo de confirmación tras pago

Los E2E deben ser pocos, muy estables y centrados en negocio.

---

## Herramientas recomendadas

### Para unit e integration

* **Vitest**
* **Testing Library**
* **@testing-library/react**
* **@testing-library/user-event**
* **jsdom** para tests de componentes
* **happy-dom** solo si hubiera necesidad concreta, pero preferencia por jsdom
* **MSW** opcional si se decide mockear red a nivel HTTP en algún flujo futuro

### Para E2E

* **Playwright**

### Para mocks y utilidades

* `vi.mock`
* factories/fixtures propias del proyecto
* spies explícitos para:

  * Supabase
  * Stripe
  * Resend
  * Cloudinary
  * router/navigation
  * cookies/session

---

## Qué NO testear

No merece la pena dedicar tiempo a:

* estilos visuales finos de Tailwind
* clases CSS exactas salvo que impliquen estado crítico
* funcionamiento interno de Supabase, Stripe, Cloudinary o Resend
* componentes puramente presentacionales sin lógica ni branching real
* comportamiento base de Next.js App Router
* traducciones literales de `next-intl` salvo que afecten a routing o render condicional
* skeletons simples si no contienen lógica
* queries demasiado pegadas a la implementación interna si lo importante es el resultado final

Regla práctica: si un test falla tras un refactor sano y el comportamiento visible no cambia, probablemente ese test está mal planteado.

---

# 3. Filosofía de testing para este proyecto

## Prioridad por riesgo de negocio

Primero se testea lo que puede provocar:

* pérdida de pedidos
* cobros erróneos
* stock inconsistente
* accesos indebidos
* usuarios bloqueados fuera de sus cuentas
* regresiones en auth

## Prioridad por estabilidad

Se debe empezar por las zonas donde:

* la lógica es crítica
* los inputs y outputs están claros
* las dependencias se pueden mockear con precisión

## Prioridad por ROI

Los primeros tests deben dar máxima cobertura funcional con poco mantenimiento.

Por eso el orden recomendado es:

1. Server Actions críticas
2. Route Handlers críticos
3. Store del carrito
4. Componentes con lógica real
5. E2E de flujos principales
6. Cobertura de admin y catálogo

---

# 4. Convenciones del proyecto

## Naming de tests

Formato recomendado:

* `describe('actions/auth.ts', () => {})`
* `it('devuelve error si las credenciales son inválidas', () => {})`
* `it('asocia pedidos de invitado al registrarse', () => {})`

Convenciones:

* describir comportamiento, no implementación
* usar lenguaje de negocio
* una expectativa central por test siempre que sea viable
* separar claramente casos felices, errores y edge cases

---

## Ubicación de archivos

Recomendación principal: **co-location controlada**

Ejemplos:

* `actions/__tests__/auth.test.ts`
* `app/api/webhook/__tests__/route.test.ts`
* `components/auth/__tests__/LoginForm.test.tsx`
* `store/__tests__/cartStore.test.ts`
* `lib/supabase/__tests__/queries.test.ts`

Esto facilita:

* descubrir cobertura por dominio
* mantener tests cerca del código
* evitar carpetas globales inmanejables

Para E2E:

* `e2e/auth.spec.ts`
* `e2e/checkout-guest.spec.ts`
* `e2e/account.spec.ts`

---

## Convención de estructura interna de cada test file

Orden recomendado:

1. imports
2. mocks globales del archivo
3. helpers locales
4. fixtures/factories mínimas
5. `describe`
6. casos happy path
7. casos de error
8. edge cases
9. cleanup/reset mocks

---

## Mocking strategy

### Principio general

Mockear fronteras externas, no la lógica propia.

Se mockea:

* Supabase client
* Stripe SDK
* Resend
* Cloudinary
* router/navigation
* cookies/session
* `window`/`localStorage` si aplica a Zustand persist

No se debe mockear:

* la función bajo test
* helpers internos del mismo módulo salvo necesidad extrema
* la lógica de negocio que precisamente se quiere validar

---

## Fixtures y factories

Se recomienda crear datos reutilizables para:

* usuario
* perfil
* producto
* categoría
* pedido
* items del pedido
* sesión Stripe
* evento de webhook
* dirección de envío

Ejemplo conceptual de factories:

* `makeUser()`
* `makeProfile()`
* `makeProduct()`
* `makeOrder()`
* `makeStripeCheckoutSession()`
* `makeStripeWebhookEvent()`

Deben permitir overrides parciales para crear edge cases sin duplicar datos.

---

## Datos fake

Convenciones:

* IDs consistentes y legibles
* correos realistas
* precios enteros o decimales controlados
* stock explícito
* slugs semánticos
* fechas fijas en tests cuando importe el orden temporal

Nunca depender de:

* `Date.now()` sin control
* orden aleatorio
* strings improvisados en cada test

---

# 5. Priorización por fases

## Fase 1 — Core de negocio

Debe implementarse primero.

### Incluye

* `actions/auth.ts`
* `app/api/checkout/route.ts`
* `app/api/webhook/route.ts`
* `actions/recuperar-password.ts`
* `app/auth/callback/route.ts`
* `app/[locale]/auth/callback/route.ts`
* `store/cartStore.ts`
* `components/carrito/CartSummary.tsx`
* `components/pedido/ClearCart.tsx`

### Motivo

Aquí están los flujos que más dinero, confianza y datos afectan:

* autenticación
* recuperación de acceso
* compra
* creación de pedido
* persistencia
* stock
* email transaccional

Un error aquí vale mucho más que un fallo visual en catálogo o admin.

---

## Fase 2 — Experiencia del usuario autenticado

### Incluye

* `actions/cuenta.ts`
* `components/cuenta/*`
* `app/[locale]/cuenta/page.tsx`
* `components/auth/*`
* `app/[locale]/login/page.tsx`
* `app/[locale]/registro/page.tsx`
* `app/[locale]/recuperar-password/*`

### Motivo

Protege:

* edición de datos
* acceso al panel
* seguridad de credenciales
* consistencia de sesión

---

## Fase 3 — Operativa interna y catálogo

### Incluye

* `actions/admin.ts`
* `app/[locale]/admin/**`
* `components/admin/**`
* `lib/supabase/queries.ts`
* `app/[locale]/catalogo/**`
* `app/[locale]/producto/[slug]/page.tsx`
* `components/layout/Header.tsx`
* `components/layout/BottomNav.tsx`

### Motivo

Es importante, pero una regresión aquí normalmente es menos crítica que cobrar mal, perder stock o bloquear auth.

---

# 6. Plan por capas

## 6.1 `actions/`

Las Server Actions deben tener tests de integración como prioridad principal.

---

### `actions/auth.ts`

**Tipo:** Integration

**Qué validar**

* login correcto
* login con credenciales inválidas
* registro correcto
* registro con email ya existente
* asociación de pedidos de invitado por `shipping_email`
* logout correcto si existe acción dedicada o flujo asociado
* comportamiento cuando falla Supabase
* comportamiento cuando falla asociación de pedidos

**Mocks**

* `createServerClient` o wrapper equivalente
* `supabase.auth.signInWithPassword`
* `supabase.auth.signUp`
* `createAdminClient` para asociación de pedidos
* respuestas de BD para pedidos invitados

**Edge cases**

* usuario no verificado
* respuesta parcial de Supabase
* error de red/servicio
* email con mayúsculas/minúsculas
* asociación sin pedidos previos
* asociación con múltiples pedidos

**Qué no testear**

* el redirect del cliente
* internals de Supabase Auth

---

### `actions/admin.ts`

**Tipo:** Integration

**Qué validar**

* crear producto correcto
* edición correcta
* toggle de `active`
* toggle de `featured`
* borrado correcto
* rechazo si el usuario no es admin
* manejo de campos opcionales y traducciones
* SKU automático si está ahí la lógica
* validación de payload incompleto

**Mocks**

* Supabase server/admin client
* perfil/role del usuario
* inserciones/updates/deletes
* subida de imágenes si pasa por integración indirecta

**Edge cases**

* slug duplicado
* stock negativo
* precio inválido
* producto inexistente al editar o borrar
* imágenes vacías o mal formadas
* categorías inexistentes

**Riesgo**
Alto para operativa, medio para negocio directo.

---

### `actions/recuperar-password.ts`

**Tipo:** Integration

**Qué validar**

* solicitud de recuperación correcta
* actualización de password correcta
* error en email inexistente si se expone
* error de token inválido o expirado
* comportamiento si Supabase falla

**Mocks**

* métodos de recuperación de Supabase Auth
* navegación si la acción devuelve estados para UI

**Edge cases**

* nueva contraseña inválida
* confirmación no coincidente si se valida en action
* rate limiting si existiera lógica propia

---

### `actions/cuenta.ts`

**Tipo:** Integration

**Qué validar**

* actualizar perfil
* actualizar dirección
* cambiar email
* cambiar password
* rechazo sin usuario autenticado
* persistencia correcta de campos
* sanitización básica si aplica

**Mocks**

* `getUser()`
* cliente Supabase
* update de `profiles`
* métodos auth para email/password

**Edge cases**

* usuario sin sesión
* datos vacíos
* actualización parcial
* email ya usado
* password actual incorrecta si se valida

---

## 6.2 `app/api/`

Los Route Handlers críticos deben estar muy bien cubiertos.

---

### `app/api/checkout/route.ts`

**Tipo:** Integration

**Qué validar**

* crea checkout session correctamente
* usa dirección del perfil si existe
* pide `shipping_address_collection` si no existe dirección
* incluye items correctos
* calcula importes correctamente
* devuelve error si faltan productos
* devuelve error si Stripe falla
* restringe datos inconsistentes

**Mocks**

* Stripe SDK
* Supabase queries para perfil/productos
* request payload
* site URL / env vars

**Edge cases**

* carrito vacío
* producto inactivo
* stock insuficiente
* producto sin imagen
* precio inválido
* usuario logado sin perfil completo
* usuario invitado

**Muy importante**
Validar shape del payload enviado a Stripe, no solo que “se llamó”.

---

### `app/api/webhook/route.ts`

**Tipo:** Integration muy exhaustiva

**Qué validar**

* verifica firma correctamente
* procesa evento válido `checkout.session.completed`
* crea pedido
* crea `order_items`
* descuenta stock llamando a `decrementar_stock`
* envía email de confirmación
* ignora eventos no relevantes
* no procesa si la firma es inválida
* maneja errores de persistencia
* maneja fallos del email sin romper consistencia del pedido si ese es el diseño
* evita duplicados si llega el mismo evento dos veces, si existe esa protección o debe añadirse

**Mocks**

* Stripe `webhooks.constructEvent`
* `createAdminClient`
* inserts en `orders`
* inserts en `order_items`
* RPC `decrementar_stock`
* Resend/sendConfirmacionPedido
* request raw body
* cabecera de firma

**Edge cases**

* metadata incompleta
* items vacíos
* session sin customer email
* error al insertar pedido
* error al insertar items
* error al descontar stock
* error enviando email
* productos borrados entre checkout y webhook
* webhook duplicado/reintentado

**Este archivo es top prioridad absoluta.**

---

### `app/api/cloudinary-signature/route.ts`

**Tipo:** Integration

**Qué validar**

* devuelve firma si el usuario es admin
* rechaza si no hay sesión
* rechaza si el role no es admin
* genera respuesta con shape esperado

**Mocks**

* auth usuario actual
* role en `profiles`
* Cloudinary signing helper si existe

**Edge cases**

* env vars faltantes
* payload inválido
* timestamp ausente

---

## 6.3 `app/[locale]/`

Aquí no conviene testear todas las páginas igual. Se priorizan las que tienen protección, branching o carga crítica.

---

### `app/[locale]/page.tsx`

**Tipo:** Integration ligera o smoke test

**Qué validar**

* render básico
* carga de secciones principales si depende de datos
* no rompe con lista de productos vacía si aplica

**No prioridad alta** salvo lógica importante de home.

---

### `app/[locale]/catalogo/page.tsx`

**Tipo:** Integration

**Qué validar**

* obtiene productos correctamente
* soporta lista vacía
* pasa props correctas a `CatalogoContent`
* no rompe ante error controlado

**Mocks**

* `lib/supabase/queries.ts`

---

### `app/[locale]/catalogo/CatalogoContent.tsx`

**Tipo:** Integration de componente

**Qué validar**

* render de productos
* filtros
* búsqueda
* ordenación si existe
* paginación o carga incremental si existe
* estado vacío
* combinación de filtros

**Mocks**

* dataset de productos
* router/search params si aplica

**Edge cases**

* filtros incompatibles
* categorías vacías
* producto sin datos opcionales

---

### `app/[locale]/producto/[slug]/page.tsx`

**Tipo:** Integration

**Qué validar**

* carga producto por slug
* renderiza ficha correctamente
* estado no encontrado si el slug no existe
* tratamiento de imágenes múltiples
* datos opcionales ausentes

**Mocks**

* `getProductBySlug`

---

### `app/[locale]/cuenta/page.tsx`

**Tipo:** Integration

**Qué validar**

* redirige o bloquea si no hay usuario
* renderiza panel si hay usuario
* fuerza comportamiento dinámico esperado a nivel funcional

**Mocks**

* `getUser()`
* queries de perfil/pedidos

---

### `app/[locale]/cuenta/verificar-email/page.tsx`

**Tipo:** Smoke o Integration ligera

**Qué validar**

* render de mensaje esperado
* manejo de params si condicionan UI

---

### `app/[locale]/carrito/page.tsx`

**Tipo:** Integration

**Qué validar**

* renderiza carrito con datos
* renderiza estado vacío
* skeleton si la hidratación lo exige
* integración con store

**Mocks**

* Zustand store/hydration

---

### `app/[locale]/pedido/confirmacion/page.tsx`

**Tipo:** Integration

**Qué validar**

* espera/consulta el pedido correctamente
* muestra confirmación cuando existe
* comportamiento si el webhook aún no ha terminado
* timeout razonable o mensaje de fallback
* integra `ClearCart`

**Mocks**

* query de pedido por session id o criterio correspondiente
* delays controlados con fake timers si aplica

**Edge cases**

* pedido no encontrado
* webhook retrasado
* usuario invitado
* refresco de página

---

### `app/[locale]/recuperar-password/page.tsx`

**Tipo:** Integration ligera

**Qué validar**

* renderiza formulario
* muestra feedback según resultado

---

### `app/[locale]/recuperar-password/nueva/page.tsx`

**Tipo:** Integration ligera

**Qué validar**

* renderiza formulario de nueva contraseña
* consume token/contexto esperado
* muestra errores de validación

---

### `app/[locale]/login/page.tsx`

### `app/[locale]/registro/page.tsx`

**Tipo:** Smoke + integración ligera

**Qué validar**

* render de formularios
* manejo de estados básicos
* no romper con i18n o props requeridas

---

### `app/[locale]/admin/layout.tsx`

**Tipo:** Integration

**Qué validar**

* permite acceso a admin
* bloquea usuario normal
* bloquea usuario no autenticado

**Mocks**

* `getUser()`
* perfil con role

---

### `app/[locale]/admin/page.tsx`

**Tipo:** Smoke o Integration ligera

**Qué validar**

* render dashboard
* widgets mínimos si dependen de queries

---

### `app/[locale]/admin/productos/page.tsx`

**Tipo:** Integration

**Qué validar**

* lista de productos
* filtros
* paginación
* estado vacío
* errores de carga

---

### `app/[locale]/admin/productos/nuevo/page.tsx`

**Tipo:** Integration ligera

**Qué validar**

* render de formulario en modo creación
* wiring correcto con `ProductoForm`

---

### `app/[locale]/admin/productos/[id]/page.tsx`

**Tipo:** Integration

**Qué validar**

* carga producto existente
* estado no encontrado
* formulario precargado

---

### `app/auth/callback/route.ts`

### `app/[locale]/auth/callback/route.ts`

**Tipo:** Integration

**Qué validar**

* intercambio de código/token correcto
* redirección correcta
* manejo de error
* soporte con y sin locale

**Mocks**

* Supabase auth callback exchange
* request URL params
* redirect/response

**Muy importante**
Estos dos handlers existen por decisión técnica y deben cubrirse porque es fácil romper uno y dejar el otro vivo.

---

## 6.4 `components/`

No todos los componentes merecen el mismo nivel de test.

---

### `components/layout/Header.tsx`

**Tipo:** Integration

**Qué validar**

* render de navegación principal
* muestra opciones correctas según sesión
* detecta admin y muestra sidebar/admin links
* reacciona a `onAuthStateChange`
* comportamiento ligado a `pathname`

**Mocks**

* Supabase browser client
* sesión actual
* query a `profiles`
* `usePathname`

**Edge cases**

* usuario logado sin perfil
* fallo al consultar role
* cambio de ruta
* logout

---

### `components/layout/BottomNav.tsx`

**Tipo:** Smoke o Integration ligera

**Qué validar**

* render y navegación básica
* estados activos si aplica

---

### `components/auth/LoginForm.tsx`

**Tipo:** Integration de componente

**Qué validar**

* envío correcto del formulario
* muestra error en credenciales inválidas
* redirección desde cliente tras éxito
* deshabilita submit durante loading
* manejo de respuesta de `login()`

**Mocks**

* action `login`
* router
* traducciones si afectan render

**Edge cases**

* submit doble
* campos vacíos
* error inesperado

---

### `components/auth/RegisterForm.tsx`

**Tipo:** Integration de componente

**Qué validar**

* envío correcto
* feedback de registro
* errores de validación
* asociación indirecta si la UI refleja el resultado
* loading state

---

### `components/auth/SolicitarRecuperacionForm.tsx`

**Tipo:** Integration de componente

**Qué validar**

* submit correcto
* éxito
* error
* bloqueo durante envío

---

### `components/auth/NuevaPasswordForm.tsx`

**Tipo:** Integration de componente

**Qué validar**

* validación de nueva contraseña
* confirmación
* submit correcto
* feedback de error/success

---

### `components/cuenta/CuentaDashboard.tsx`

**Tipo:** Integration

**Qué validar**

* render de tabs/sidebar
* cambio de sección
* persistencia de la sección seleccionada si existe
* adaptación desktop/móvil a nivel de lógica, no visual fina

---

### `components/cuenta/AjustesTab.tsx`

**Tipo:** Integration

**Qué validar**

* acordeones
* update de perfil
* update de dirección
* update de seguridad
* mensajes de éxito/error

**Mocks**

* acciones de cuenta

---

### `components/cuenta/PedidosTab.tsx`

**Tipo:** Integration

**Qué validar**

* render de pedidos
* estado vacío
* datos incompletos
* orden cronológico si aplica

---

### `components/admin/ProductosTable.tsx`

**Tipo:** Integration

**Qué validar**

* tabla/tarjetas
* filtros
* paginación
* toggles de activo/destacado
* acción borrar
* estado vacío
* comportamiento responsive si implica distinta lógica

**Mocks**

* acciones admin
* dataset de productos

---

### `components/admin/ProductoForm.tsx`

**Tipo:** Integration muy importante

**Qué validar**

* modo crear vs editar
* generación automática de SKU si corresponde a la UI
* validación de campos
* submit correcto
* normalización de imágenes
* campos traducidos
* estado loading
* manejo de errores de servidor

**Mocks**

* acciones admin
* uploader
* categorías

**Edge cases**

* imágenes duplicadas
* slug inválido
* precio/stock inválidos
* campos opcionales vacíos

---

### `components/admin/ImageUploader.tsx`

**Tipo:** Integration

**Qué validar**

* compresión previa
* subida correcta
* límite de imágenes si existe
* borrado/reordenación si existe
* error en firma
* error en subida

**Mocks**

* `fetch` a `/api/cloudinary-signature`
* Cloudinary upload endpoint si se abstrae
* compresión de imagen si se usa helper separable

**Qué no testear**

* compresión real pixel-perfect
* funcionamiento interno de Cloudinary

---

### `components/carrito/CartSummary.tsx`

**Tipo:** Integration crítica

**Qué validar**

* calcula resumen visual correctamente
* inicia checkout con datos correctos
* deshabilita botón si carrito vacío
* maneja loading
* error de checkout
* uso de dirección del perfil cuando aplique
* comportamiento invitado/logado

**Mocks**

* store carrito
* API checkout
* router/redirect a Stripe

---

### `components/pedido/ClearCart.tsx`

**Tipo:** Unit o Integration ligera

**Qué validar**

* vacía carrito al montar o al cumplirse condición esperada
* no vacía en contexto incorrecto
* no se ejecuta dos veces si debe ser idempotente

**Mocks**

* store carrito
* params/props

---

## 6.5 `lib/`

Aquí hay que separar wrappers simples de lógica real.

---

### `lib/supabase/client.ts`

**Tipo:** Smoke o ninguno

Si solo crea el browser client, apenas requiere test. Solo testear si añade configuración propia relevante.

---

### `lib/supabase/server.ts`

**Tipo:** Smoke o ninguno

Igual criterio. No duplicar tests de la librería.

---

### `lib/supabase/admin.ts`

**Tipo:** Smoke muy ligero

Solo si hay lógica propia de protección o env vars críticas.

---

### `lib/supabase/queries.ts`

**Tipo:** Integration

**Qué validar**

* `getProducts()`
* `getProductBySlug()`
* otras queries relevantes
* filtros aplicados correctamente
* shape devuelto
* manejo de errores
* exclusión de productos inactivos si aplica

**Mocks**

* browser client o wrapper de query builder

**Edge cases**

* sin resultados
* slug inexistente
* datos nulos
* traducciones faltantes

**Importante**
No testear el SQL interno de Supabase como si fuera un motor propio; testear intención de consulta y shape de retorno.

---

### `lib/email/confirmacion-pedido.tsx`

**Tipo:** Unit/Integration ligera

**Qué validar**

* construye payload de email correctamente
* incluye datos clave del pedido
* soporta items múltiples
* maneja campos opcionales

**Mocks**

* Resend client o función `send`

**Qué no testear**

* render visual exacto del email línea a línea salvo contenido crítico

---

## 6.6 `store/`

### `store/cartStore.ts`

**Tipo:** Unit + Integration ligera

**Qué validar**

* añadir producto
* incrementar cantidad si el producto ya existe
* eliminar producto
* actualizar cantidad
* impedir cantidades inválidas
* limpiar carrito
* calcular totales
* persistencia/hidratación
* `_hasHydrated`
* comportamiento tras rehidratar
* tolerancia a storage corrupto si aplica

**Mocks**

* `localStorage`
* persist middleware

**Edge cases**

* producto sin imagen
* cantidad 0 o negativa
* stock superado si la lógica lo contempla
* producto duplicado con distinto shape
* storage con datos antiguos

**Este archivo es quick win claro.**

---

# 7. Testing específico de integraciones externas

## 7.1 Supabase

## Qué testear realmente

* que llamas al método correcto
* que construyes correctamente la intención de consulta
* que manejas correctamente respuestas de éxito/error
* que respetas auth/roles/usuario actual
* que interpretas bien los datos devueltos

## Qué no testear

* RLS real dentro de tests unitarios/integration locales
* funcionamiento interno del cliente oficial
* SQL engine de Supabase

## Cómo mockear

Crear dobles de cliente por capa:

* browser client mock
* server client mock
* admin client mock

Cada uno debe permitir:

* encadenar `.from(...).select(...)`
* `insert`, `update`, `delete`, `eq`, `single`
* métodos auth
* `rpc`

Recomendación:
crear helpers como:

* `mockSupabaseSuccess(data)`
* `mockSupabaseError(message)`
* `mockSupabaseAuthUser(user)`
* `mockSupabaseRpcSuccess()`

---

## 7.2 Stripe

## Qué testear

### En checkout

* payload enviado a `checkout.sessions.create`
* line items correctos
* metadatos relevantes
* URLs correctas
* modo correcto
* tratamiento de invitado/logado

### En webhook

* validación de firma
* interpretación del evento
* idempotencia si aplica
* persistencia de pedido y líneas
* interacción con stock
* email posterior

## Cómo simular eventos

Usar fixtures de eventos Stripe mockeados con shape realista:

* `checkout.session.completed`
* evento irrelevante
* firma inválida

No hace falta hablar con Stripe real para estos tests.

---

## 7.3 Cloudinary

## Qué sí testear

* que la firma se solicita correctamente
* que solo admin puede obtener firma
* que el uploader maneja éxito/error
* que la UI integra resultado de subida
* que la compresión/preparación produce una llamada válida

## Qué no testear

* subida real a Cloudinary en tests unitarios/integration
* calidad visual final de la imagen
* comportamiento interno de la CDN

---

## 7.4 Resend

## Qué sí testear

* que el email se intenta enviar con payload correcto
* que errores del servicio se manejan según diseño
* que el email no bloquea indebidamente el flujo si no debe hacerlo

## Qué no testear

* entrega real de correo
* render perfecto del cliente de correo

---

# 8. Testing del flujo completo con Playwright

Los E2E deben cubrir pocas rutas, pero muy críticas.

## Escenario 1 — Usuario invitado compra

**Objetivo:** proteger el flujo de venta mínimo viable.

**Pasos**

* entrar a catálogo
* abrir producto
* añadir al carrito
* ir a carrito
* iniciar checkout
* completar flujo simulado o interceptado
* llegar a confirmación
* validar mensaje de pedido
* validar que el carrito queda vacío

**Riesgos cubiertos**

* add to cart
* checkout
* confirmación
* limpieza de carrito

---

## Escenario 2 — Usuario logado compra con dirección en perfil

**Objetivo:** validar ramificación de checkout según perfil.

**Pasos**

* login
* ir a producto
* añadir al carrito
* checkout
* verificar que usa datos del perfil
* completar compra
* llegar a confirmación
* comprobar pedido en cuenta si el entorno E2E lo permite

---

## Escenario 3 — Registro + asociación de pedido invitado

**Objetivo:** proteger una de las decisiones técnicas más delicadas del proyecto.

**Pasos**

* realizar compra como invitado con email X
* registrarse con email X
* acceder a cuenta
* comprobar que aparece el pedido asociado

**Este escenario tiene altísimo valor.**

---

## Escenario 4 — Recuperación de contraseña

**Pasos**

* solicitar recuperación
* abrir enlace simulado o URL preparada
* establecer nueva contraseña
* login con nueva contraseña

---

## Escenario 5 — Acceso a `/cuenta`

**Pasos**

* probar usuario no autenticado
* validar bloqueo o redirección
* probar usuario autenticado
* validar acceso

---

## Escenario 6 — Acceso admin

**Pasos**

* usuario normal intenta entrar a `/admin`
* acceso denegado
* usuario admin entra
* listado de productos visible

---

## Escenario 7 — CRUD básico de producto admin

No hace falta cubrir todo. Solo smoke de operativa:

* crear producto
* editar dato simple
* marcar destacado/activo
* borrar o desactivar según el flujo elegido

---

# 9. Quick Wins

Estos son los primeros tests que deberías implementar ya porque dan mucho valor y poco coste relativo.

## Quick Win 1 — `store/cartStore.ts`

Porque:

* lógica clara
* alto impacto
* pocos mocks complejos
* protege una parte usada por todo el checkout

## Quick Win 2 — `actions/auth.ts`

Porque:

* auth siempre es fuente de regresiones
* la asociación de pedidos invitado es lógica sensible
* buen equilibrio entre valor y complejidad

## Quick Win 3 — `app/api/webhook/route.ts`

Porque:

* es la pieza más crítica de negocio
* protege creación de pedido, stock y email
* cualquier bug aquí cuesta dinero

## Quick Win 4 — `components/carrito/CartSummary.tsx`

Porque:

* conecta carrito con checkout
* revela rápido fallos de integración UI-negocio

## Quick Win 5 — `components/auth/LoginForm.tsx`

Porque:

* el login es muy usado
* la decisión técnica de redirigir desde cliente conviene blindarla

## Quick Win 6 — `app/auth/callback/route.ts` y `app/[locale]/auth/callback/route.ts`

Porque:

* hay dos callbacks y es fácil que uno se desincronice del otro

---

# 10. Anti-patterns a evitar en este proyecto

## 10.1 Testear demasiado la UI

No tiene sentido comprobar cada clase Tailwind, cada borde o cada detalle visual.

## 10.2 Acoplar tests a implementación interna

Ejemplo malo:

* comprobar cuántos `useState` tiene un componente
* comprobar el orden exacto de llamadas internas irrelevantes

Ejemplo bueno:

* comprobar que el usuario ve error al fallar login
* comprobar que se crea sesión de checkout con los datos correctos

---

## 10.3 Mockear tanto que el test deja de valer

Si mockeas toda la cadena, el test solo confirma que el mock responde lo que tú decidiste.

Hay que mockear fronteras externas, no convertir el sistema entero en un teatro de mocks.

---

## 10.4 Hacer E2E para todo

Los E2E son caros y frágiles. Solo deben cubrir recorridos troncales.

---

## 10.5 No testear errores

En este proyecto los casos de error son tan importantes como los felices:

* Stripe cae
* Supabase falla
* email falla
* callback no recibe parámetros válidos
* usuario no tiene permisos
* webhook llega duplicado

---

## 10.6 No controlar tiempo ni entorno

Hay que fijar:

* fechas
* timers
* env vars
* storage
* usuario autenticado o no

Sin eso tendrás tests flakey.

---

## 10.7 Probar internals de librerías

No hay que “demostrar” que Stripe o Supabase funcionan. Hay que demostrar que tu código los usa correctamente.

---

# 11. Orden exacto recomendado de implementación

## Bloque 1

* `store/cartStore.ts`
* `components/pedido/ClearCart.tsx`

## Bloque 2

* `actions/auth.ts`
* `components/auth/LoginForm.tsx`
* `components/auth/RegisterForm.tsx`

## Bloque 3

* `app/api/checkout/route.ts`
* `components/carrito/CartSummary.tsx`

## Bloque 4

* `app/api/webhook/route.ts`
* `lib/email/confirmacion-pedido.tsx`

## Bloque 5

* `app/auth/callback/route.ts`
* `app/[locale]/auth/callback/route.ts`
* `actions/recuperar-password.ts`
* formularios de recuperación

## Bloque 6

* `actions/cuenta.ts`
* `components/cuenta/*`
* `app/[locale]/cuenta/page.tsx`

## Bloque 7

* `actions/admin.ts`
* `components/admin/ProductoForm.tsx`
* `components/admin/ProductosTable.tsx`
* `app/[locale]/admin/**`

## Bloque 8

* `lib/supabase/queries.ts`
* `catalogo`
* `producto/[slug]`
* `Header`

## Bloque 9

* E2E Playwright de flujos clave

---

# 12. Matriz resumida por archivo

## Críticos inmediatos

* `actions/auth.ts`
* `app/api/checkout/route.ts`
* `app/api/webhook/route.ts`
* `store/cartStore.ts`
* `components/carrito/CartSummary.tsx`
* `components/auth/LoginForm.tsx`
* `app/auth/callback/route.ts`
* `app/[locale]/auth/callback/route.ts`

## Importantes

* `actions/recuperar-password.ts`
* `actions/cuenta.ts`
* `components/auth/RegisterForm.tsx`
* `components/cuenta/AjustesTab.tsx`
* `components/cuenta/PedidosTab.tsx`
* `app/[locale]/pedido/confirmacion/page.tsx`

## Secundarios pero recomendables

* `actions/admin.ts`
* `components/admin/ProductoForm.tsx`
* `components/admin/ProductosTable.tsx`
* `lib/supabase/queries.ts`
* `app/[locale]/catalogo/CatalogoContent.tsx`
* `components/layout/Header.tsx`

## Baja prioridad

* `BottomNav`
* pages simples sin lógica
* wrappers mínimos de cliente

---

# 13. Definición de terminado para cada archivo testado

Un archivo se considerará bien cubierto cuando:

* tenga happy path
* tenga al menos un caso de error realista
* tenga edge cases importantes del dominio
* no dependa de red externa real
* sea estable en local y CI
* siga describiendo comportamiento de negocio, no implementación interna

---

# 14. Resultado esperado al aplicar este plan

Al terminar este roadmap, el proyecto debería tener protegidos:

* login, registro y recuperación
* compra invitado y logado
* creación de checkout
* procesamiento de webhook
* creación de pedidos y líneas
* descuento de stock
* vaciado de carrito
* asociación de pedidos invitado al registrarse
* protección de rutas de cuenta y admin
* CRUD principal de productos
* flujos E2E de máxima criticidad

---

# 15. Siguiente paso recomendado

El mejor siguiente paso es crear primero un documento operativo derivado de este plan con este formato:

* archivo
* prioridad
* tipo de test
* dependencias a mockear
* casos a implementar
* estado

Y empezar por esta secuencia:

1. `store/cartStore.ts`
2. `actions/auth.ts`
3. `app/api/webhook/route.ts`

Luego continuar archivo por archivo.
