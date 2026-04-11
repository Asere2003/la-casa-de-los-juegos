import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  product_name: string
  product_image: string | null
  quantity: number
  price: number
  subtotal: number
}

interface SendConfirmacionPedidoProps {
  to: string
  orderNumber: string
  total: number
  shippingCost: number
  items: OrderItem[]
  shippingName: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingPostalCode: string | null
}

export async function sendConfirmacionPedido({
  to,
  orderNumber,
  total,
  shippingCost,
  items,
  shippingName,
  shippingAddress,
  shippingCity,
  shippingPostalCode,
}: SendConfirmacionPedidoProps) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe8;">
        <strong style="color: #2a170f;">${item.product_name}</strong><br/>
        <span style="color: #717a6f; font-size: 13px;">${item.quantity} × ${item.price.toFixed(2)} €</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe8; text-align: right;">
        <strong style="color: #004317;">${item.subtotal.toFixed(2)} €</strong>
      </td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #fff8f6; font-family: Georgia, serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <img
            src="https://res.cloudinary.com/db3v04xc1/image/upload/v1775222426/icons/logo_new.svg"
            alt="La Casa de los Juegos"
            width="120"
            height="120"
            style="display: block; margin: 0 auto 12px;"
          />
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #805533; margin: 0;">
            Granada · Est. 2024
          </p>
          <div style="width: 40px; height: 2px; background: #c9a84c; margin: 16px auto 0;"></div>
        </div>

        <!-- Título -->
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin: 0 0 8px;">
            Pedido confirmado
          </p>
          <h2 style="font-family: Georgia, serif; color: #2a170f; font-size: 24px; margin: 0 0 12px;">
            ¡Gracias por tu compra!
          </h2>
          <p style="color: #717a6f; font-style: italic; font-size: 15px; margin: 0;">
            Hemos recibido tu pedido correctamente y lo estamos procesando.
          </p>
        </div>

        <!-- Número de pedido -->
        <div style="background: white; border: 1px solid #e8e0dc; border-radius: 2px; padding: 16px; text-align: center; margin-bottom: 24px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 4px;">
            Número de pedido
          </p>
          <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #004317; margin: 0;">
            #${orderNumber}
          </p>
        </div>

        <!-- Productos -->
        <div style="background: white; border: 1px solid #e8e0dc; border-radius: 2px; padding: 24px; margin-bottom: 24px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 16px;">
            Productos
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>

          <!-- Totales -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            ${shippingCost > 0 ? `
            <tr>
              <td style="padding: 6px 0; color: #717a6f; font-size: 14px;">Gastos de envío</td>
              <td style="padding: 6px 0; text-align: right; color: #2a170f; font-size: 14px;">${shippingCost.toFixed(2)} €</td>
            </tr>
            ` : `
            <tr>
              <td style="padding: 6px 0; color: #717a6f; font-size: 14px;">Gastos de envío</td>
              <td style="padding: 6px 0; text-align: right; color: #004317; font-size: 14px; font-weight: bold;">Gratis</td>
            </tr>
            `}
            <tr>
              <td style="padding: 12px 0 0; border-top: 2px solid #2a170f; font-size: 16px; font-weight: bold; color: #2a170f;">Total</td>
              <td style="padding: 12px 0 0; border-top: 2px solid #2a170f; text-align: right; font-size: 18px; font-weight: bold; color: #004317;">${total.toFixed(2)} €</td>
            </tr>
          </table>
        </div>

        <!-- Dirección de envío -->
        ${shippingAddress ? `
        <div style="background: white; border: 1px solid #e8e0dc; border-radius: 2px; padding: 24px; margin-bottom: 24px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            Dirección de envío
          </p>
          <p style="color: #2a170f; font-size: 14px; line-height: 1.6; margin: 0;">
            ${shippingName ?? ''}<br/>
            ${shippingAddress}<br/>
            ${shippingPostalCode ?? ''} ${shippingCity ?? ''}
          </p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e8e0dc;">
          <p style="color: #717a6f; font-style: italic; font-size: 13px; margin: 0 0 8px;">
            "Un juego no termina cuando se cierra la caja, solo se guarda para la próxima sesión."
          </p>
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #c9a84c; margin: 0;">
            La Casa de los Juegos · Granada
          </p>
          <p style="font-size: 12px; color: #717a6f; margin: 16px 0 0;">
            <a href="https://lacasadelosjuegos.com" style="color: #004317;">lacasadelosjuegos.com</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  const { error } = await resend.emails.send({
    from: `La Casa de los Juegos <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`,
    to,
    subject: `✅ Pedido confirmado #${orderNumber} — La Casa de los Juegos`,
    html,
  })

  if (error) {
    console.error('Error enviando email de confirmación:', error)
  }
}

interface SendNuevoPedidoAdminProps {
  customerEmail: string
  orderNumber: string
  orderId: string
  total: number
  shippingCost: number
  items: OrderItem[]
  shippingName: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingPostalCode: string | null
}

export async function sendNuevoPedidoAdmin({
  customerEmail,
  orderNumber,
  orderId,
  total,
  shippingCost,
  items,
  shippingName,
  shippingAddress,
  shippingCity,
  shippingPostalCode,
}: SendNuevoPedidoAdminProps) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe8;">
        <strong style="color: #2a170f;">${item.product_name}</strong><br/>
        <span style="color: #717a6f; font-size: 13px;">${item.quantity} × ${item.price.toFixed(2)} €</span>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe8; text-align: right;">
        <strong style="color: #004317;">${item.subtotal.toFixed(2)} €</strong>
      </td>
    </tr>
  `).join('')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lacasadelosjuegos.com'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Georgia, serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header admin — fondo verde con logo -->
        <div style="background: #004317; border-radius: 2px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <img
            src="https://res.cloudinary.com/db3v04xc1/image/upload/v1775222426/icons/logo_new.svg"
            alt="La Casa de los Juegos"
            width="80"
            height="80"
            style="display: block; margin: 0 auto 12px; filter: brightness(0) invert(1);"
          />
          <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin: 0 0 6px;">
            Nuevo pedido recibido
          </p>
          <h1 style="font-family: Georgia, serif; color: white; font-size: 22px; margin: 0;">
            #${orderNumber}
          </h1>
        </div>

        <!-- Cliente -->
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 16px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            Cliente
          </p>
          <p style="color: #2a170f; font-size: 15px; margin: 0;">
            ${shippingName ? `<strong>${shippingName}</strong><br/>` : ''}
            ${customerEmail}
          </p>
        </div>

        <!-- Productos -->
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 16px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 16px;">
            Productos
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 6px 0; color: #717a6f; font-size: 14px;">Gastos de envío</td>
              <td style="padding: 6px 0; text-align: right; color: #2a170f; font-size: 14px;">
                ${shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : 'Gratis'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0 0; border-top: 2px solid #2a170f; font-size: 16px; font-weight: bold; color: #2a170f;">Total</td>
              <td style="padding: 12px 0 0; border-top: 2px solid #2a170f; text-align: right; font-size: 18px; font-weight: bold; color: #004317;">${total.toFixed(2)} €</td>
            </tr>
          </table>
        </div>

        <!-- Dirección -->
        ${shippingAddress ? `
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 16px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            Dirección de envío
          </p>
          <p style="color: #2a170f; font-size: 14px; line-height: 1.6; margin: 0;">
            ${shippingName ?? ''}<br/>
            ${shippingAddress}<br/>
            ${shippingPostalCode ?? ''} ${shippingCity ?? ''}
          </p>
        </div>
        ` : ''}

        <!-- CTA -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="${siteUrl}/es/admin/pedidos/${orderId}"
             style="background-color: #004317; color: white; font-family: Georgia, serif; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 2px; display: inline-block;">
            Ver pedido en el panel →
          </a>
        </div>

      </div>
    </body>
    </html>
  `

  const { error } = await resend.emails.send({
    from: `La Casa de los Juegos <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`,
    to: adminEmail,
    subject: `🛒 Nuevo pedido #${orderNumber} — ${total.toFixed(2)} €`,
    html,
  })

  if (error) {
    console.error('Error enviando email admin nuevo pedido:', error)
  }
}