// components/DevModeBanner.tsx
'use client'

import { useEffect, useState } from 'react'

export function DevModeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('dev_notice_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    sessionStorage.setItem('dev_notice_dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#2c1810]/80 backdrop-blur-sm">
      <div className="bg-[#fff8f6] max-w-md w-full shadow-2xl" style={{ borderRadius: '2px' }}>

        {/* Header */}
        <div className="bg-[#2c1810] px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🚧</span>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c]">
            Sitio en desarrollo
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <h2 className="font-serif text-xl text-[#2c1810] mb-3">
            Esta tienda está en fase de pruebas
          </h2>
          <p className="text-sm text-[#2c1810]/70 leading-relaxed mb-4">
            La Casa de los Juegos está actualmente en desarrollo y <strong>no está operativa comercialmente</strong>.
            Los pagos están en <strong>modo test</strong> — ninguna transacción real será procesada.
          </p>
          <ul className="space-y-2 text-sm text-[#2c1810]/70 mb-6">
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Puedes explorar el catálogo libremente
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Los pagos son simulados, no se cobra nada
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a84c]">✓</span> Los pedidos no se procesan ni envían
            </li>
          </ul>
          <div className="gold-rule mb-6" />
          <button
            onClick={dismiss}
            className="btn-primary w-full"
          >
            Entendido, explorar la tienda →
          </button>
        </div>
      </div>
    </div>
  )
}