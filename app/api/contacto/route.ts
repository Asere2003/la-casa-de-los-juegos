// app/api/contacto/route.ts

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { nombre, email, asunto, mensaje } = await req.json()

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: `La Casa de los Juegos <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`,
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
      replyTo: email,
      subject: `[Contacto] ${asunto || 'Nuevo mensaje'} — ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nAsunto: ${asunto}\n\n${mensaje}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}