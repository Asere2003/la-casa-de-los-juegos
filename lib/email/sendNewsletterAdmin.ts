import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY, {
  baseUrl: 'https://api.eu.resend.com',
})

export async function sendNewsletterAdmin(emailSuscriptor: string) {
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
          <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin: 0;">
            Nueva suscripción al boletín
          </p>
        </div>

        <!-- Email -->
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 2px; padding: 20px 24px; margin-bottom: 24px; text-align: center;">
          <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #717a6f; margin: 0 0 12px;">
            Email suscrito
          </p>
          <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #004317; margin: 0;">
            ${emailSuscriptor}
          </p>
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
    subject: `📬 Nueva suscripción — ${emailSuscriptor}`,
    html,
  })

  if (error) console.error('Error enviando email newsletter admin:', error)
}