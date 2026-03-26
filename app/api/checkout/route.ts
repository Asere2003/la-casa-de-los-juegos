import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { items, shippingCost, discount, locale } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000')

    // Obtener perfil del usuario si está logado
    let userProfile = null
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nombre, direccion, ciudad, codigo_postal, pais')
        .eq('id', user.id)
        .single()
      userProfile = profile
    }

    const hasAddress = userProfile?.direccion && userProfile?.ciudad

    // Construir line_items para Stripe
    const lineItems = items.map((item: {
      product: { name: string; images: string[]; price: number }
      quantity: number
    }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          images: item.product.images?.[0] ? [item.product.images[0]] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    // Añadir envío si tiene coste
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Gastos de envío' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    // Añadir descuento como línea negativa si hay cupón
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Descuento JUEGOS10' },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Solo pedir dirección si no la tenemos en el perfil
      ...(hasAddress ? {} : {
        shipping_address_collection: {
          allowed_countries: ['ES', 'PT', 'FR', 'DE', 'IT', 'GB'],
        },
      }),
      success_url: `${siteUrl}/${locale}/pedido/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/carrito`,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id ?? '',
        locale,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Error al crear el pago' }, { status: 500 })
  }
}