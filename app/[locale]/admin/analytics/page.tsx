'use client'

import { useEffect, useState } from 'react'

type TopPage = { path: string; title: string; views: string }
type Device = { device: string; sessions: string }

type AnalyticsData = {
  users: string
  sessions: string
  revenue: string
  bounceRate: string
  avgSessionDuration: string
  newUsers: string
  returningUsers: string
  topPages: TopPage[]
  devices: Device[]
}

function formatDuration(seconds: string): string {
  const s = Math.round(Number(seconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return m > 0 ? `${m}m ${rem}s` : `${rem}s`
}

function formatPct(value: string): string {
  return `${(Number(value) * 100).toFixed(1)}%`
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-[#004317]/20 rounded p-6 bg-white hover:shadow-md transition-all">
      <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">{label}</p>
      <p className="font-mono text-3xl text-[#004317] font-bold">{value}</p>
      {sub && <p className="text-sm text-[#2c1810]/50 mt-2">{sub}</p>}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('/api/analytics', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Error cargando Analytics')
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const totalSessions = Number(data?.devices.reduce((acc, d) => acc + Number(d.sessions), 0) || 1)

  return (
    <main className="min-h-screen bg-[#fff8f6] pb-32">
      <div className="max-w-6xl mx-auto px-4">

        {/* Cabecera */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-headline text-3xl text-[#004317]">Analytics</h1>
          <p className="text-sm text-[#2c1810]/60 mt-2">
            Resumen de Google Analytics de los últimos 7 días.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-[#004317]/15 rounded p-6 bg-white animate-pulse">
                <div className="h-4 w-24 bg-[#004317]/10 rounded mb-4" />
                <div className="h-8 w-32 bg-[#004317]/10 rounded mb-3" />
                <div className="h-3 w-40 bg-[#2c1810]/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="border border-red-200 bg-red-50 rounded p-5">
            <p className="text-sm font-medium text-red-700 mb-1">No se pudo cargar Analytics</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6">

            {/* ── Fila 1: métricas principales ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Usuarios activos"
                value={Number(data.users).toLocaleString('es-ES')}
                sub="Personas activas en los últimos 7 días"
              />
              <StatCard
                label="Sesiones"
                value={Number(data.sessions).toLocaleString('es-ES')}
                sub="Sesiones totales de los últimos 7 días"
              />
              <StatCard
                label="Ingresos"
                value={`${Number(data.revenue).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`}
                sub="Revenue reportado por Google Analytics"
              />
            </div>

            {/* ── Fila 2: métricas de comportamiento ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Tasa de rebote"
                value={formatPct(data.bounceRate)}
                sub="Sesiones de una sola página"
              />
              <StatCard
                label="Duración media"
                value={formatDuration(data.avgSessionDuration)}
                sub="Tiempo medio por sesión"
              />
              <div className="border border-[#004317]/20 rounded p-6 bg-white hover:shadow-md transition-all">
                <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">
                  Nuevos vs Recurrentes
                </p>
                <div className="flex items-end gap-4 mb-3">
                  <div>
                    <p className="font-mono text-2xl text-[#004317] font-bold">
                      {Number(data.newUsers).toLocaleString('es-ES')}
                    </p>
                    <p className="text-xs text-[#2c1810]/50">Nuevos</p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl text-[#004317] font-bold">
                      {Number(data.returningUsers).toLocaleString('es-ES')}
                    </p>
                    <p className="text-xs text-[#2c1810]/50">Recurrentes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Fila 3: páginas + dispositivos ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Páginas más vistas */}
              <div className="border border-[#004317]/20 rounded p-6 bg-white">
                <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-4">
                  Páginas más vistas
                </p>
                <div className="space-y-3">
                  {data.topPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#2a170f] truncate font-medium">
                          {page.title || page.path}
                        </p>
                        <p className="font-mono text-[10px] text-[#717a6f] truncate">
                          {page.path}
                        </p>
                      </div>
                      <span className="font-mono text-sm text-[#004317] font-bold shrink-0">
                        {Number(page.views).toLocaleString('es-ES')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispositivos */}
              <div className="border border-[#004317]/20 rounded p-6 bg-white">
                <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-4">
                  Dispositivos
                </p>
                <div className="space-y-4">
                  {data.devices.map((d, i) => {
                    const pct = Math.round((Number(d.sessions) / totalSessions) * 100)
                    const labels: Record<string, string> = {
                      mobile: '📱 Móvil',
                      desktop: '🖥️ Escritorio',
                      tablet: '📟 Tablet',
                    }
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#2a170f]">
                            {labels[d.device] ?? d.device}
                          </span>
                          <span className="font-mono text-xs text-[#004317] font-bold">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#c0c9bc]/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#004317] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="font-mono text-[10px] text-[#717a6f] mt-0.5">
                          {Number(d.sessions).toLocaleString('es-ES')} sesiones
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}