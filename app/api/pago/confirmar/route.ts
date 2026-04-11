import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendConfirmacionPedido, sendNuevoPedidoAdmin } from '@/lib/email/confirmacion-pedido'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CartItem {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images?: string[]
  }
  quantity: number
}

interface ShippingData {
  nombre: string
  email: string
  direccion: string
  ciudad: string
  codigo_postal: string
  pais: string
  guardarDireccion?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const {
      paymentIntentId,
      items,
      shippingCost,
      discount,
      shippingData,
      userId,
    }: {
      paymentIntentId: string
      items: CartItem[]
      shippingCost: number
      discount: number
      shippingData: ShippingData
      userId?: string
    } = await request.json()

    if (!paymentIntentId || !items?.length || !shippingData) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Verificar que el PaymentIntent está en estado succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'El pago no se ha completado' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Comprobar idempotencia: ¿ya existe un pedido con este paymentIntentId?
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent', paymentIntentId)
      .maybeSingle()

    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder.id })
    }

    // Calcular importes
    const subtotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )
    const total = subtotal + shippingCost - discount

    // Crear pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId ?? null,
        status: 'paid',
        stripe_payment_intent: paymentIntentId,
        total,
        subtotal,
        shipping_cost: shippingCost,
        discount,
        shipping_name: shippingData.nombre,
        shipping_email: shippingData.email,
        shipping_address: shippingData.direccion,
        shipping_city: shippingData.ciudad,
        shipping_postal_code: shippingData.codigo_postal,
        shipping_country: shippingData.pais,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Error creando pedido:', orderError)
      return NextResponse.json({ error: 'Error creando el pedido' }, { status: 500 })
    }

    // Crear order_items y descontar stock
    for (const item of items) {
      await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_slug: item.product.slug,
        product_image: item.product.images?.[0] ?? null,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })

      await supabase.rpc('decrementar_stock', {
        producto_id: item.product.id,
        cantidad: item.quantity,
      })
    }

    // Guardar dirección en perfil si el usuario lo solicitó
    if (userId && shippingData.guardarDireccion) {
      await supabase
        .from('profiles')
        .update({
          nombre: shippingData.nombre,
          direccion: shippingData.direccion,
          ciudad: shippingData.ciudad,
          codigo_postal: shippingData.codigo_postal,
          pais: shippingData.pais,
        })
        .eq('id', userId)
    }

    // Enviar emails
    const emailItems = items.map(item => ({
      product_name: item.product.name,
      product_image: item.product.images?.[0] ?? null,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity,
    }))

    const orderNumber = order.id.slice(0, 8).toUpperCase()

    await sendConfirmacionPedido({
      to: shippingData.email,
      orderNumber,
      total: order.total,
      shippingCost: order.shipping_cost,
      items: emailItems,
      shippingName: shippingData.nombre,
      shippingAddress: shippingData.direccion,
      shippingCity: shippingData.ciudad,
      shippingPostalCode: shippingData.codigo_postal,
    })

    await sendNuevoPedidoAdmin({
      customerEmail: shippingData.email,
      orderNumber,
      orderId: order.id,
      total: order.total,
      shippingCost: order.shipping_cost,
      items: emailItems,
      shippingName: shippingData.nombre,
      shippingAddress: shippingData.direccion,
      shippingCity: shippingData.ciudad,
      shippingPostalCode: shippingData.codigo_postal,
    })

    console.log('✅ Pedido confirmado via /api/pago/confirmar:', order.id)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Error en /api/pago/confirmar:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
