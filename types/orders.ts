export interface OrderItem {
  id: string
  product_id?: string | null
  product_name: string
  product_image?: string | null
  product_slug?: string | null
  quantity: number
  price: number
  subtotal?: number
}

export interface Order {
  id: string
  status: string
  total: number
  subtotal?: number
  shipping_cost?: number
  discount?: number
  shipping_name?: string | null
  shipping_email?: string | null
  shipping_address?: string | null
  shipping_city?: string | null
  shipping_postal_code?: string | null
  shipping_country?: string | null
  stripe_payment_intent?: string | null
  created_at: string
  updated_at?: string
  delivered_at?: string | null
  order_items: OrderItem[]
}
