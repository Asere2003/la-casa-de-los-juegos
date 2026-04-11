import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { items, shippingCost, discount, userId } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    // Calcular total en céntimos
    const subtotal = items.reduce(
      (acc: number, item: { product: { price: number }; quantity: number }) =>
        acc + item.product.price * item.quantity,
      0
    )
    const total = subtotal + (shippingCost ?? 0) - (discount ?? 0)
    const amountCents = Math.round(total * 100)

    if (amountCents < 50) {
      return NextResponse.json({ error: 'Importe mínimo 0,50 €' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: userId ?? '',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creando PaymentIntent:', error)
    return NextResponse.json({ error: 'Error al iniciar el pago' }, { status: 500 })
  }
}
