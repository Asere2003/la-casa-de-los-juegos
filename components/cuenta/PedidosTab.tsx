'use client'

import { useState, useTransition } from 'react'

import { solicitarDevolucion } from '@/actions/cuenta'
import { useTranslations } from 'next-intl'

interface OrderItem {
    id: string
    product_name: string
    product_image: string | null
    quantity: number
    price: number
    subtotal: number
}

interface Order {
    id: string
    status: string
    total: number
    created_at: string
    delivered_at: string | null
    order_items: OrderItem[]

}

interface Props {
    orders: Order[]
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-[#004317]/10 text-[#004317]',
    return_requested: 'bg-orange-100 text-orange-700',
    returned: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
}

export default function PedidosTab({ orders }: Props) {

    const t = useTranslations('cuenta.pedidos')

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            pending: t('status_pending'),
            paid: t('status_paid'),
            processing: t('status_processing'),
            shipped: t('status_shipped'),
            delivered: t('status_delivered'),
            cancelled: t('status_cancelled'),
        }
        return labels[status] ?? status
    }

    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [devoluciones, setDevoluciones] = useState<Record<string, string>>({})

    function handleDevolucion(orderId: string) {
        if (!confirm('¿Confirmas que quieres solicitar la devolución de este pedido?')) return
        setLoadingId(orderId)
        startTransition(async () => {
            const result = await solicitarDevolucion(orderId)
            if (result.error) {
                alert(result.error)
            } else {
                setDevoluciones(prev => ({ ...prev, [orderId]: 'return_requested' }))
            }
            setLoadingId(null)
        })
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-4">🎲</div>
                <p
                    className="text-[#717a6f] text-sm mb-6"
                    style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
                >
                    {t('empty')}
                </p>

                <a
                    href="/catalogo"
                    className="btn-primary px-6 py-2 text-sm inline-block"
                >
                    {t('view_catalogue')}
                </a>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {orders.map(order => {
                const statusColor = STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'
                const statusLabel = getStatusLabel(order.status)
                const date = new Date(order.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })

                return (
                    <div
                        key={order.id}
                        className="border border-[#c0c9bc]/40 bg-white p-5"
                        style={{ borderRadius: '2px' }}
                    >
                        {/* Cabecera del pedido */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider text-[#717a6f] mb-1">
                                    {t('order_label')}
                                </p>
                                <p className="font-mono text-xs text-[#2a170f] font-bold">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </p>
                                <p className="font-body italic text-xs text-[#717a6f] mt-1">
                                    {date}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-mono px-2 py-1 rounded ${statusColor}`}>
                                    {statusLabel}
                                </span>
                                <p className="font-mono font-bold text-[#004317] mt-2">
                                    {order.total.toFixed(2)} €
                                </p>
                            </div>
                        </div>

                        {/* Línea separadora */}
                        <div className="border-t border-[#c0c9bc]/30 pt-4">
                            <div className="space-y-3">
                                {order.order_items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#004317]/10 rounded flex-shrink-0 overflow-hidden">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg">
                                                    🎲
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-[#2a170f] font-medium truncate">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-[#717a6f]">
                                                {item.quantity} × {item.price.toFixed(2)} €
                                            </p>
                                        </div>
                                        <p className="text-sm font-mono text-[#2a170f] flex-shrink-0">
                                            {item.subtotal.toFixed(2)} €
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Botón devolución */}
                        {(devoluciones[order.id] ?? order.status) === 'delivered' && (() => {
                            if (!order.delivered_at) return false
                            const days = Math.floor(
                                (new Date().getTime() - new Date(order.delivered_at).getTime())
                                / (1000 * 60 * 60 * 24)
                            )
                            return days <= 14
                        })() && (
                                <div className="border-t border-[#c0c9bc]/30 pt-4 mt-4 flex items-center justify-between">
                                    <p className="text-xs text-[#717a6f] italic">
                                        ¿Tienes algún problema con tu pedido?
                                    </p>
                                    <button
                                        onClick={() => handleDevolucion(order.id)}
                                        disabled={loadingId === order.id}
                                        className="text-xs text-[#717a6f] underline hover:text-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {loadingId === order.id ? 'Procesando...' : 'Solicitar devolución'}
                                    </button>
                                </div>
                            )}

                        {(devoluciones[order.id] ?? order.status) === 'return_requested' && (
                            <div className="border-t border-[#c0c9bc]/30 pt-4 mt-4">
                                <p className="text-xs text-orange-600 font-mono">
                                    ✓ Devolución solicitada — nos pondremos en contacto contigo
                                </p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
