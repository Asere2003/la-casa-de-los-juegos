'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { cambiarRolUsuario } from '@/actions/admin'

interface Usuario {
  id: string
  nombre: string | null
  email: string        // ← añadir
  telefono: string | null
  ciudad: string | null
  pais: string | null
  role: string
  created_at: string
  total_orders: number
  total_spent: number
}

interface Props {
  usuarios: Usuario[]
}

const PER_PAGE = 15

export default function UsuariosAdminTable({ usuarios }: Props) {
  const tableRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [page, setPage] = useState(1)
  const [pendingScroll, setPendingScroll] = useState(false)

  const filtered = usuarios.filter(u => {
    const matchSearch =
      u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      u.ciudad?.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole ? u.role === filterRole : true
    return matchSearch && matchRole
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
          placeholder="Buscar por nombre, ciudad o ID..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="input-base flex-1"
        />
        <select
          value={filterRole}
          onChange={e => { setFilterRole(e.target.value); setPage(1) }}
          className="input-base sm:w-40"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="user">Usuario</option>
        </select>
        {(search || filterRole) && (
          <button
            onClick={() => { setSearch(''); setFilterRole(''); setPage(1) }}
            className="btn-outline px-4 text-sm"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Contador */}
      <p className="text-xs text-[#2c1810]/40 mb-4">
        {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
        {(search || filterRole) ? ' encontrados' : ' en total'}
      </p>

      {/* ── VISTA MÓVIL ── */}
      <div className="md:hidden space-y-3">
        {paginated.map(u => (
          <div key={u.id} className="bg-white border border-[#2c1810]/10 rounded p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-sm text-[#2c1810]">
                  {u.nombre ?? 'Sin nombre'}
                </p>
                <p className="text-xs text-[#2c1810]/50">{u.email}</p>
                <p className="font-mono text-[10px] text-[#2c1810]/40 mt-0.5">
                  {u.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            <RolButton userId={u.id} currentRole={u.role} />
            </div>
            <p className="text-xs text-[#2c1810]/50">
              {u.ciudad ?? '—'}{u.pais ? `, ${u.pais}` : ''}
            </p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#2c1810]/10">
              <div>
                <p className="font-mono text-sm font-bold text-[#004317]">{u.total_orders}</p>
                <p className="text-[10px] text-[#2c1810]/40">pedidos</p>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-[#004317]">
                  {u.total_spent.toFixed(2)} €
                </p>
                <p className="text-[10px] text-[#2c1810]/40">gastado</p>
              </div>
              <div className="ml-auto">
                <p className="text-[10px] text-[#2c1810]/40">
                  {new Date(u.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── VISTA DESKTOP ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#004317]/20 text-left">
              {['Usuario', 'Ubicación', 'Pedidos', 'Total gastado', 'Rol', 'Registro'].map(h => (
                <th key={h} className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2c1810]/10">
            {paginated.map(u => (
              <tr key={u.id} className="hover:bg-[#004317]/5 transition-colors">
                <td className="py-3 pr-4">
                    <p className="font-medium text-[#2c1810]">{u.nombre ?? 'Sin nombre'}</p>
                    <p className="text-xs text-[#2c1810]/50">{u.email}</p>
                    <p className="font-mono text-[10px] text-[#2c1810]/40 mt-0.5">
                        {u.id.slice(0, 8).toUpperCase()}
                    </p>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-xs text-[#2c1810]/70">
                    {u.ciudad ?? '—'}{u.pais ? `, ${u.pais}` : ''}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <p className="font-mono font-bold text-[#004317]">{u.total_orders}</p>
                </td>
                <td className="py-3 pr-4">
                  <p className="font-mono font-bold text-[#004317]">
                    {u.total_spent.toFixed(2)} €
                  </p>
                </td>
                <td className="py-3 pr-4">
                <RolButton userId={u.id} currentRole={u.role} />
                </td>
                <td className="py-3 pr-4">
                  <p className="text-xs text-[#2c1810]/50">
                    {new Date(u.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </td>
              </tr>
            ))}
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

function RolButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [isPending, startTransition] = useTransition()
  const isAdmin = currentRole === 'admin'

  function handleToggle() {
    if (!confirm(`¿Cambiar rol a ${isAdmin ? 'usuario' : 'admin'}?`)) return
    startTransition(async () => {
      await cambiarRolUsuario(userId, isAdmin ? 'user' : 'admin')
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-mono px-2 py-1 rounded ${
        isAdmin ? 'bg-[#004317] text-white' : 'bg-[#c0c9bc]/30 text-[#2c1810]/60'
      }`}>
        {currentRole}
      </span>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="text-[10px] font-mono text-[#717a6f] hover:text-[#004317] underline transition-colors disabled:opacity-50"
      >
        {isPending ? '...' : isAdmin ? 'Quitar admin' : 'Hacer admin'}
      </button>
    </div>
  )
}