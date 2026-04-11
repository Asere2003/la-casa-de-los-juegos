import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY, {
  baseUrl: 'https://api.eu.resend.com',
})

const STATUS_CONTENT: Record<string, { titulo: string; subtitulo: string; mensaje: string; emoji: string }> = {
  processing: {
    emoji: '📦',
    titulo: 'Estamos preparando tu pedido',
    subtitulo: 'Tu pedido está siendo procesado.',
    mensaje: 'Nuestro equipo está preparando tu pedido con cuidado. Te avisaremos cuando esté en camino.',
  },
  shipped: {
    emoji: '🚚',
    titulo: 'Tu pedido está en camino',
    subtitulo: '¡Tu pedido ha sido enviado!',
    mensaje: 'Tu pedido ya está en manos del transportista y pronto llegará a tu dirección.',
  },
  delivered: {
    emoji: '✅',
    titulo: 'Tu pedido ha sido entregado',
    subtitulo: '¡Esperamos que lo disfrutes!',
    mensaje: 'Tu pedido ha sido entregado. Si tienes cualquier problema no dudes en contactarnos.',
  },
  return_requested: {
    emoji: '🔄',
    titulo: 'Hemos recibido tu solicitud de devolución',
    subtitulo: 'Nos pondremos en contacto contigo pronto.',
    mensaje: 'Hemos recibido tu solicitud de devolución. Nuestro equipo se pondrá en contacto contigo en breve para gestionar el proceso.',
  },
  returned: {
    emoji: '💚',
    titulo: 'Tu devolución ha sido procesada',
    subtitulo: 'El reembolso está en camino.',
    mensaje: 'Hemos procesado tu devolución. El reembolso se realizará en los próximos días hábiles según tu método de pago.',
  },
}

interface SendEstadoPedidoProps {
  to: string
  orderNumber: string
  status: string
}

export async function sendEstadoPedido({ to, orderNumber, status }: SendEstadoPedidoProps) {
  const content = STATUS_CONTENT[status]
  if (!content) return

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
          width="140"
          height="140"
          style="display: block; margin: 0 auto 8px;"
        />
        <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #805533; margin: 0;">
          Granada · Est. 2024
        </p>
        <div style="width: 40px; height: 2px; background: #c9a84c; margin: 16px auto 0;"></div>
      </div>

        <!-- Título -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">${content.emoji}</div>
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin: 0 0 8px;">
            Actualización de pedido
          </p>
          <h2 style="font-family: Georgia, serif; color: #2a170f; font-size: 24px; margin: 0 0 12px;">
            ${content.titulo}
          </h2>
          <p style="color: #717a6f; font-style: italic; font-size: 15px; margin: 0;">
            ${content.subtitulo}
          </p>
        </div>

        <!-- Cuerpo -->
        <div style="background: white; border: 1px solid #e8e0dc; border-radius: 2px; padding: 32px; margin-bottom: 24px; text-align: center;">
          <div style="background: #fff8f6; border: 1px solid #e8e0dc; border-radius: 2px; padding: 16px; margin-bottom: 24px;">
            <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 4px;">
              Número de pedido
            </p>
            <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #004317; margin: 0;">
              #${orderNumber}
            </p>
          </div>
          <p style="color: #2a170f; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            ${content.mensaje}
          </p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
            <tr>
              <td style="background-color: #004317; border-radius: 2px; padding: 14px 32px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/es/cuenta?tab=pedidos" style="color: white; font-family: Georgia, serif; font-size: 15px; text-decoration: none; display: block;">Ver mis pedidos →</a>
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e8e0dc;">
          <p style="color: #717a6f; font-style: italic; font-size: 13px; margin: 0 0 8px;">
            "Un juego no termina cuando se cierra la caja, solo se guarda para la próxima sesión."
          </p>
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #c9a84c; margin: 0;">
            La Casa de los Juegos · Granada
          </p>
          <p style="font-size: 12px; color: #717a6f; margin: 16px 0 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #004317;">lacasadelosjuegos.com</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  const { error } = await resend.emails.send({
    from: `La Casa de los Juegos <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`,
    to,
    subject: `${content.emoji} ${content.titulo} — Pedido #${orderNumber}`,
    html,
  })

  if (error) console.error('Error enviando email estado pedido:', error)
}