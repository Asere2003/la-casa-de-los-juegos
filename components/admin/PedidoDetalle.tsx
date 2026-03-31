'use client'

import { useState, useTransition } from 'react'

import Image from 'next/image'
import type { Order } from '@/types/orders'
import { actualizarEstadoPedido } from '@/actions/admin'

interface Props {
  order: Order
  locale: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:          { label: 'Pendiente',        color: 'bg-yellow-100 text-yellow-700' },
  paid:             { label: 'Pagado',            color: 'bg-green-100 text-green-700' },
  processing:       { label: 'Procesando',        color: 'bg-blue-100 text-blue-700' },
  shipped:          { label: 'Enviado',           color: 'bg-purple-100 text-purple-700' },
  delivered:        { label: 'Entregado',         color: 'bg-[#004317]/10 text-[#004317]' },
  return_requested: { label: 'Dev. solicitada',   color: 'bg-orange-100 text-orange-700' },
  returned:         { label: 'Devuelto',          color: 'bg-gray-100 text-gray-700' },
  cancelled:        { label: 'Cancelado',         color: 'bg-red-100 text-red-700' },
}

const STATUS_FLOW: Record<string, string[]> = {
  pending:          ['paid', 'cancelled'],
  paid:             ['processing', 'cancelled'],
  processing:       ['shipped', 'cancelled'],
  shipped:          ['delivered'],
  delivered:        ['return_requested'],
  return_requested: ['returned', 'delivered'],
  returned:         [],
  cancelled:        [],
}

export default function PedidoDetalle({ order, locale }: Props) {
  console.log('order subtotal:', order.subtotal, typeof order.subtotal)
  const [status, setStatus] = useState(order.status)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const currentStatus = STATUS_LABELS[status] ?? { label: status, color: 'bg-gray-100 text-gray-700' }
  const nextStatuses = STATUS_FLOW[status] ?? []

  const date = new Date(order.created_at).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  function handleStatusChange(newStatus: string) {
    if (!confirm(`¿Cambiar estado a "${STATUS_LABELS[newStatus]?.label}"?`)) return
    setError(null)
    startTransition(async () => {
      const result = await actualizarEstadoPedido(order.id, newStatus)
      if (result.error) {
        setError(result.error)
      } else {
        setStatus(newStatus)
      }
    })
  }

  return (
    <div className="space-y-6">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ── Estado y acciones ── */}
      <div className="bg-white border border-[#2c1810]/10 rounded p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#2c1810]/40 font-medium mb-2">
              Estado actual
            </p>
            <span className={`text-sm px-3 py-1.5 rounded font-mono ${currentStatus.color}`}>
              {currentStatus.label}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#2c1810]/40 mb-1">{date}</p>
            {order.stripe_payment_intent && (
              <p className="font-mono text-xs text-[#2c1810]/30">
                {order.stripe_payment_intent.slice(0, 20)}...
              </p>
            )}
          </div>
        </div>

        {/* Cambiar estado */}
        {nextStatuses.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider text-[#2c1810]/40 font-medium mb-3">
              Cambiar estado
            </p>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map(nextStatus => (
                <button
                  key={nextStatus}
                  onClick={() => handleStatusChange(nextStatus)}
                  disabled={isPending}
                  className={`text-xs px-4 py-2 rounded font-mono border transition-colors disabled:opacity-50 ${
                    nextStatus === 'cancelled' || nextStatus === 'returned'
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-[#004317]/30 text-[#004317] hover:bg-[#004317]/5'
                  }`}
                >
                  {isPending ? '...' : `→ ${STATUS_LABELS[nextStatus]?.label}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Datos del cliente ── */}
      <div className="bg-white border border-[#2c1810]/10 rounded p-6">
        <p className="text-xs uppercase tracking-wider text-[#2c1810]/40 font-medium mb-4">
          Datos del cliente
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-[#2c1810]/40 mb-1">Nombre</p>
            <p className="text-[#2c1810] font-medium">{order.shipping_name ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-[#2c1810]/40 mb-1">Email</p>
            <p className="text-[#2c1810]">{order.shipping_email ?? '—'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-[#2c1810]/40 mb-1">Dirección de envío</p>
            <p className="text-[#2c1810]">
              {order.shipping_address ?? '—'}<br/>
              {order.shipping_postal_code} {order.shipping_city}<br/>
              {order.shipping_country}
            </p>
          </div>
        </div>
      </div>

      {/* ── Productos ── */}
      <div className="bg-white border border-[#2c1810]/10 rounded p-6">
        <p className="text-xs uppercase tracking-wider text-[#2c1810]/40 font-medium mb-4">
          Productos
        </p>
        <div className="space-y-4">
          {order.order_items.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#004317]/10 rounded flex-shrink-0 overflow-hidden">
                {item.product_image ? (
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎲</div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2c1810]">{item.product_name}</p>
                <p className="text-xs text-[#2c1810]/50">{item.quantity} × {item.price.toFixed(2)} €</p>
              </div>
              <p className="font-mono text-sm font-bold text-[#004317]">
                {(item.subtotal ?? 0).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="border-t border-[#2c1810]/10 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#2c1810]/60">Subtotal</span>
            <span className="font-mono">{order.subtotal?.toFixed(2)} €</span>
          </div>
          {order.shipping_cost && order.shipping_cost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#2c1810]/60">Envío</span>
              <span className="font-mono">{order.shipping_cost?.toFixed(2)} €</span>
            </div>
          )}
          {order.discount && order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#2c1810]/60">Descuento</span>
              <span className="font-mono text-[#004317]">−{order.discount?.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold border-t border-[#2c1810]/10 pt-2">
            <span className="text-[#2c1810]">Total</span>
            <span className="font-mono text-[#004317]">{order.total.toFixed(2)} €</span>
          </div>
        </div>
      </div>

    </div>
  )
}