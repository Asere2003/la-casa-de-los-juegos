AGENTE: Página de Pago Propia con Stripe Elements
CONTEXTO DEL PROYECTO
La Casa de los Juegos — ecommerce Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase + Stripe. El stack completo está en el CONTEXT.md del proyecto.
OBJETIVO
Reemplazar el redirect a checkout.stripe.com por una página de pago propia en /[locale]/pago usando Stripe Elements, manteniendo toda la lógica de negocio actual y los estilos de la tienda.
PROBLEMA QUE RESUELVE
Actualmente el flujo redirige al usuario a checkout.stripe.com. Si el usuario pulsa atrás mientras Stripe procesa el pago, puede volver al carrito y pagar de nuevo. Con página propia todo ocurre en el mismo dominio y el flujo se controla completamente.
FLUJO NUEVO
Carrito → /[locale]/pago → Pago con Stripe Elements → /[locale]/pedido/confirmacion
USUARIOS — CASOS A CONTEMPLAR
Usuario NO logado (guest)

Puede comprar sin registrarse — SIEMPRE
Debe rellenar obligatoriamente: nombre completo, email, dirección, ciudad, código postal, país
No se crea perfil en Supabase
El pedido se guarda en orders con user_id: null

Usuario logado SIN dirección guardada en perfil

Debe rellenar la dirección en la página de pago
Opción opcional: "Guardar esta dirección en mi perfil" (checkbox)

Usuario logado CON dirección guardada en perfil

La dirección se precarga automáticamente desde el perfil
Puede editarla para este pedido sin que cambie el perfil

ARCHIVOS A CREAR
1. app/[locale]/pago/page.tsx

Server Component con force-dynamic
NO requiere autenticación — cualquier usuario puede acceder
Si el usuario está logado, obtiene su perfil (nombre, dirección, etc.) y lo pasa como prop
Si no está logado, pasa user: null y profile: null
Renderiza PagoContent

2. app/[locale]/pago/PagoContent.tsx
Client Component principal. Debe:

Leer el carrito de Zustand (useCartStore)
Si el carrito está vacío redirigir a /carrito
Mostrar resumen del pedido (productos, cantidades, precios, envío, total)
Mostrar formulario de datos de envío:

Si usuario logado con dirección: precargar campos, permitir edición
Si usuario logado sin dirección: campos vacíos + checkbox "Guardar dirección"
Si usuario guest: campos vacíos + campo email obligatorio


Mostrar formulario de Stripe Elements (PaymentElement)
Al enviar:

Validar todos los campos del formulario
Crear PaymentIntent via /api/pago/intent
Confirmar pago con stripe.confirmPayment()
En éxito: llamar a /api/pago/confirmar, limpiar carrito, redirigir a /pedido/confirmacion
En error: mostrar mensaje inline, NO redirigir, permitir reintentar


El botón de pago se deshabilita mientras procesa — imposible doble click
Una vez iniciado el pago no se puede modificar el carrito

3. app/api/pago/intent/route.ts
Endpoint POST que:

Recibe: { items, shippingCost, discount, userId? }
Calcula el importe total
Crea un PaymentIntent en Stripe con amount en céntimos
Devuelve: { clientSecret }
NO crea el pedido todavía — eso lo hace /api/pago/confirmar tras el pago exitoso

4. app/api/pago/confirmar/route.ts
Endpoint POST que:

Recibe: { paymentIntentId, items, shippingCost, discount, shippingData, userId? }
Verifica con Stripe que el PaymentIntent está en estado succeeded
Si no está succeeded: devuelve error 400
Comprueba idempotencia: si ya existe un pedido con ese paymentIntentId, devuelve el pedido existente sin crear duplicado
Crea el pedido en orders con todos los datos de envío y status: 'paid'
Crea los order_items
Decrementa stock via RPC decrementar_stock
Si userId y checkbox "guardar dirección" activo: actualiza el perfil en Supabase
Envía emails usando las funciones existentes en lib/emails/
Devuelve: { success: true, orderId }

5. Modificar components/carrito/CartSummary.tsx

Cambiar handleCheckout para navegar a /${locale}/pago usando router.push
Eliminar toda la lógica de localStorage de Stripe sessions
Eliminar imports de CHECKOUT_SESSION_KEY
El botón solo navega — no llama a ninguna API

6. Modificar components/pedido/ClearCart.tsx

Eliminar localStorage.removeItem(CHECKOUT_SESSION_KEY)
Solo mantener clearCart()

7. Modificar app/[locale]/pedido/confirmacion/page.tsx

Adaptar para recibir order_id en lugar de session_id como parámetro
O mantener compatibilidad con ambos parámetros

WEBHOOK
El webhook existente en app/api/webhook/route.ts se mantiene como capa de seguridad para el evento payment_intent.succeeded. Si el cliente se desconecta antes de que /api/pago/confirmar se ejecute, el webhook crea el pedido igualmente. Añadir comprobación de idempotencia igual que en /api/pago/confirmar.
ESTILOS
Usar exactamente los tokens de diseño de la tienda:

Verde primario: #004317
Dorado: #c9a84c
Madera oscura: #2c1810
Crema: #fff8f6
Fuentes: Noto Serif (headlines) + Newsreader (body)
Border radius: 2px en todo
Clases globales: btn-primary, btn-gold, btn-outline, input-base

Personalizar Stripe Elements con el objeto appearance:
javascriptconst appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#004317',
    colorBackground: '#ffffff',
    colorText: '#2c1810',
    colorDanger: '#ba1a1a',
    fontFamily: 'Newsreader, serif',
    borderRadius: '2px',
  }
}
DEPENDENCIAS
Instalar si no está: @stripe/react-stripe-js
Ya disponible: stripe, @stripe/stripe-js
REGLAS TÉCNICAS

Seguir todas las reglas del CONTEXT.md
createAdminClient() solo en webhook
Usar createClient() de @/lib/supabase/server en Route Handlers
i18n: useTranslations en Client Components, getTranslations en Server Components
No usar force-dynamic salvo donde sea estrictamente necesario
El carrito vive en Zustand con persist — no tocarlo salvo para limpiar tras pago exitoso
Todos los imports de constantes desde @/lib/constants

RESULTADO ESPERADO

Flujo de pago 100% en el dominio de la tienda
Diseño coherente con la tienda
Cualquier usuario (logado o guest) puede comprar
El carrito se limpia en el momento exacto del pago exitoso
Imposible pagar dos veces el mismo pedido
Si el usuario pulsa atrás durante el pago, al volver a /pago ve el estado actual del pago