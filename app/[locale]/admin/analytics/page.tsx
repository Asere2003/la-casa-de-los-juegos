'use client'

import { useEffect, useState } from 'react'

type AnalyticsData = {
  users: string
  sessions: string
  revenue: string
  error?: string
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAnalytics() {
      try {
        setLoading(true)
        setError('')

        const res = await fetch('/api/analytics', {
          method: 'GET',
          cache: 'no-store',
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json?.error || 'No se pudieron cargar los datos de Analytics')
        }

        if (!cancelled) {
          setData(json)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Ha ocurrido un error al cargar Analytics'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      cancelled = true
    }
  }, [])

  const users = Number(data?.users ?? 0).toLocaleString('es-ES')
  const sessions = Number(data?.sessions ?? 0).toLocaleString('es-ES')
  const revenue = Number(data?.revenue ?? 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <main className="min-h-screen bg-[#fff8f6] pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-1">
            Panel de administración
          </p>
          <h1 className="font-headline text-3xl text-[#004317]">
            Analytics
          </h1>
          <p className="text-sm text-[#2c1810]/60 mt-2">
            Resumen de Google Analytics de los últimos 7 días.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border border-[#004317]/15 rounded p-6 bg-white animate-pulse"
              >
                <div className="h-4 w-24 bg-[#004317]/10 rounded mb-4" />
                <div className="h-8 w-32 bg-[#004317]/10 rounded mb-3" />
                <div className="h-3 w-40 bg-[#2c1810]/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="border border-red-200 bg-red-50 rounded p-5">
            <p className="text-sm font-medium text-red-700 mb-1">
              No se pudo cargar Analytics
            </p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="border border-[#004317]/20 rounded p-6 bg-white hover:shadow-md transition-all">
                <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">
                  Usuarios activos
                </p>
                <p className="font-mono text-3xl text-[#004317] font-bold">
                  {users}
                </p>
                <p className="text-sm text-[#2c1810]/50 mt-2">
                  Personas activas registradas por GA4
                </p>
              </div>

              <div className="border border-[#004317]/20 rounded p-6 bg-white hover:shadow-md transition-all">
                <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">
                  Sesiones
                </p>
                <p className="font-mono text-3xl text-[#004317] font-bold">
                  {sessions}
                </p>
                <p className="text-sm text-[#2c1810]/50 mt-2">
                  Sesiones totales de los últimos 7 días
                </p>
              </div>

              <div className="border border-[#004317]/20 rounded p-6 bg-white hover:shadow-md transition-all">
                <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">
                  Ingresos
                </p>
                <p className="font-mono text-3xl text-[#004317] font-bold">
                  {revenue} €
                </p>
                <p className="text-sm text-[#2c1810]/50 mt-2">
                  Revenue reportado por Google Analytics
                </p>
              </div>
            </div>

            <div className="border border-[#2c1810]/10 rounded p-6 bg-white">
              <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium mb-2">
                Estado
              </p>
              <h2 className="font-headline text-xl text-[#004317] mb-2">
                Integración funcionando
              </h2>
              <p className="text-sm text-[#2c1810]/60">
                El dashboard ya está leyendo datos desde tu endpoint seguro
                <span className="font-mono text-[#004317]"> /api/analytics</span>.
                En el siguiente paso te preparo el acceso desde la tarjeta del panel
                principal para sustituir el “Próximamente”.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}