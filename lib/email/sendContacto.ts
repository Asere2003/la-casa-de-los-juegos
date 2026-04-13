import { Resend } from 'resend'
import { formatearFechaES } from '@/lib/email/utils/formatearFecha'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendContactoProps {
  nombre: string
  email: string
  mensaje: string
  asunto: string
}

export async function sendContacto({ nombre, email, mensaje, asunto }: SendContactoProps) {
  const fechaEnvio = formatearFechaES()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

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

        <!-- Header -->
        <div style="background: #004317; border-radius: 2px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <img
            src="https://res.cloudinary.com/db3v04xc1/image/upload/v1775222426/icons/logo_new.svg"
            alt="La Casa de los Juegos"
            width="80"
            height="80"
            style="display: block; margin: 0 auto 12px; filter: brightness(0) invert(1);"
          />
          <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin: 0 0 6px;">
            Nuevo mensaje de contacto
          </p>
        </div>

        <!-- Remitente -->
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 16px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            De
          </p>
          <p style="color: #2a170f; font-size: 15px; margin: 0;">
            <strong>${nombre}</strong><br/>
            <a href="mailto:${email}" style="color: #004317;">${email}</a>
          </p>
          <p style="font-family: monospace; font-size: 11px; color: #b0a090; margin: 4px 0 0; letter-spacing: 0.05em;">
            ${fechaEnvio}
          </p>
        </div>

        <!-- Asunto -->
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 16px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            Asunto
          </p>
          <p style="color: #2a170f; font-size: 15px; margin: 0;">
            ${asunto}
          </p>
        </div>

        <!-- Mensaje -->
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 24px;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            Mensaje
          </p>
          <p style="color: #2a170f; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
            ${mensaje}
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align: center;">
          <a href="mailto:${email}"
             style="background-color: #004317; color: white; font-family: Georgia, serif; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 2px; display: inline-block;">
            Responder a ${nombre} →
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #c9a84c; margin: 0;">
            La Casa de los Juegos · Granada
          </p>
          <p style="font-size: 12px; color: #717a6f; margin: 8px 0 0;">
            <a href="${siteUrl}" style="color: #004317;">lacasadelosjuegos.com</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  const { error } = await resend.emails.send({
    from: `La Casa de los Juegos <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`,
    to: adminEmail,
    replyTo: email,
    subject: `✉️ Nuevo mensaje de ${nombre}`,
    html,
  })

  if (error) console.error('Error enviando email de contacto:', error)
}