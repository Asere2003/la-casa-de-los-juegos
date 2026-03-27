'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  status: string
  total: number
  shipping_name: string | null
  shipping_email: string | null
  shipping_city: string | null
  created_at: string
  order_items: OrderItem[]
}

interface Props {
  orders: Order[]
  locale: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:          { label: 'Pendiente',          color: 'bg-yellow-100 text-yellow-700' },
  paid:             { label: 'Pagado',              color: 'bg-green-100 text-green-700' },
  processing:       { label: 'Procesando',          color: 'bg-blue-100 text-blue-700' },
  shipped:          { label: 'Enviado',             color: 'bg-purple-100 text-purple-700' },
  delivered:        { label: 'Entregado',           color: 'bg-[#004317]/10 text-[#004317]' },
  return_requested: { label: 'Dev. solicitada',     color: 'bg-orange-100 text-orange-700' },
  returned:         { label: 'Devuelto',            color: 'bg-gray-100 text-gray-700' },
  cancelled:        { label: 'Cancelado',           color: 'bg-red-100 text-red-700' },
}

const PER_PAGE = 10

export default function PedidosAdminTable({ orders, locale }: Props) {
  const tableRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pendingScroll, setPendingScroll] = useState(false)

  const filtered = orders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? o.status === filterStatus : true
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function changePage(newPage: number) {
    setPage(newPage)
    setPendingScroll(true)
  }

  useEffect(() => {
    if (pendingScroll) {
      const top = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      setPendingScroll(false)
    }
  }, [pendingScroll])

  return (
    <div ref={tableRef}>

      {/* ── FILTROS ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, email o nº pedido..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="input-base flex-1"
        />
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
          className="input-base sm:w-48"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {(search || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); setPage(1) }}
            className="btn-outline px-4 text-sm"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Contador */}
      <p className="text-xs text-[#2c1810]/40 mb-4">
        {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
        {(search || filterStatus) ? ' encontrados' : ' en total'}
      </p>

      {/* ── VISTA MÓVIL ── */}
      <div className="md:hidden space-y-3">
        {paginated.map(order => {
          const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' }
          const date = new Date(order.created_at).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric'
          })
          return (
            <div key={order.id} className="bg-white border border-[#2c1810]/10 rounded p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono text-xs font-bold text-[#2c1810]">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#2c1810]/50 mt-0.5">{date}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-[#2c1810] font-medium">{order.shipping_name ?? '—'}</p>
              <p className="text-xs text-[#2c1810]/50">{order.shipping_email}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono font-bold text-[#004317]">{order.total.toFixed(2)} €</span>
                <Link
                  href={`/${locale}/admin/pedidos/${order.id}`}
                  className="text-xs text-[#004317] border border-[#004317]/30 px-3 py-1.5 rounded hover:bg-[#004317]/5 transition-colors"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── VISTA DESKTOP ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#004317]/20 text-left">
              <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Pedido</th>
              <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Cliente</th>
              <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Productos</th>
              <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Total</th>
              <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Estado</th>
              <th className="pb-3 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2c1810]/10">
            {paginated.map(order => {
              const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' }
              const date = new Date(order.created_at).toLocaleDateString('es-ES', {
                day: 'numeric', month: 'short', year: 'numeric'
              })
              return (
                <tr key={order.id} className="hover:bg-[#004317]/5 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="font-mono text-xs font-bold text-[#2c1810]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#2c1810]/40 mt-0.5">{date}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-[#2c1810]">{order.shipping_name ?? '—'}</p>
                    <p className="text-xs text-[#2c1810]/40">{order.shipping_email}</p>
                    <p className="text-xs text-[#2c1810]/40">{order.shipping_city}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="space-y-0.5">
                      {order.order_items.map(item => (
                        <p key={item.id} className="text-xs text-[#2c1810]/70">
                          {item.quantity}× {item.product_name}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono font-bold text-[#004317]">
                      {order.total.toFixed(2)} €
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded font-mono ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/${locale}/admin/pedidos/${order.id}`}
                      className="text-xs text-[#004317] border border-[#004317]/30 px-3 py-1 rounded hover:bg-[#004317]/5 transition-colors"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── PAGINACIÓN ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => changePage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-outline px-4 py-2 text-sm disabled:opacity-30"
          >
            ← Anterior
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => changePage(n)}
                className={`w-8 h-8 text-sm rounded transition-colors ${
                  page === n ? 'bg-[#004317] text-white' : 'text-[#2c1810]/60 hover:bg-[#004317]/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() => changePage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="btn-outline px-4 py-2 text-sm disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      )}

    </div>
  )
}