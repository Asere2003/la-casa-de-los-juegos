import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    try {
      const supabase = createAdminClient()

      // Comprobar si el pedido ya existe (idempotencia)
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single()

      if (existingOrder) {
        return NextResponse.json({ received: true })
      }

      // Recuperar line_items completos
      const sessionWithItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] }
      )

      // Calcular subtotal y envío
      const shippingItem = sessionWithItems.line_items?.data.find(
        item => item.description === 'Gastos de envío'
      )
      const discountItem = sessionWithItems.line_items?.data.find(
        item => item.description?.includes('Descuento')
      )

      const shippingCost = (shippingItem?.amount_total ?? 0) / 100
      const discount = Math.abs((discountItem?.amount_total ?? 0) / 100)
      const total = (session.amount_total ?? 0) / 100
      const subtotal = total - shippingCost + discount

      // Crear pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.metadata?.user_id || null,
          status: 'paid',
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          total,
          subtotal,
          shipping_cost: shippingCost,
          discount,
          shipping_name: session.customer_details?.name,
          shipping_email: session.customer_details?.email,
          shipping_address: session.customer_details?.address?.line1,
          shipping_city: session.customer_details?.address?.city,
          shipping_postal_code: session.customer_details?.address?.postal_code,
          shipping_country: session.customer_details?.address?.country ?? 'ES',
        })
        .select()
        .single()

      if (orderError || !order) {
        console.error('Error creando pedido:', orderError)
        return NextResponse.json({ error: 'Error creando pedido' }, { status: 500 })
      }

      // Crear order_items y descontar stock
      const productItems = sessionWithItems.line_items?.data.filter(
        item => item.description !== 'Gastos de envío' && !item.description?.includes('Descuento')
      ) ?? []

      for (const item of productItems) {
        // Buscar producto por nombre para obtener id y slug
        const { data: product } = await supabase
          .from('products')
          .select('id, slug, images')
          .eq('name', item.description)
          .single()

        // Insertar línea de pedido
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: product?.id ?? null,
          product_name: item.description ?? '',
          product_slug: product?.slug ?? '',
          product_image: product?.images?.[0] ?? null,
          price: (item.price?.unit_amount ?? 0) / 100,
          quantity: item.quantity ?? 1,
          subtotal: (item.amount_total ?? 0) / 100,
        })

        // Descontar stock
        if (product) {
          await supabase.rpc('decrementar_stock', {
            producto_id: product.id,
            cantidad: item.quantity ?? 1,
          })
        }
      }

      console.log('✅ Pedido creado:', order.id)

    } catch (error) {
      console.error('Error procesando webhook:', error)
      return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}