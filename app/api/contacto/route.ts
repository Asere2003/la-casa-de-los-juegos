import { NextResponse } from 'next/server'
import { sendContacto } from '@/lib/email/sendContacto'

export async function POST(req: Request) {
  try {
    const { nombre, email, asunto, mensaje } = await req.json()

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'El email no es válido.' }, { status: 400 })
    }

    await sendContacto({ nombre, email, asunto, mensaje })
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error al enviar.' }, { status: 500 })
  }
}