// components/legal/CookieBanner.tsx
'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
    // Aquí activarías Google Analytics si usas consentimiento granular
    window.dispatchEvent(new Event('cookie_consent_accepted'))
  }

  function reject() {
    localStorage.setItem('cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6
      bg-[#2c1810] border-t border-[#c9a84c]/30 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row
        items-start sm:items-center gap-4 justify-between">
        <div className="flex-1">
          <p className="text-[#fff8f6] text-sm leading-relaxed">
            Usamos cookies propias (necesarias para el funcionamiento) y de terceros
            con tu consentimiento (Google Analytics). Puedes{' '}
            <Link href="/privacidad" className="text-[#c9a84c] underline">
              leer nuestra política de privacidad
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className="btn-outline text-sm px-4 py-2
              !border-[#c9a84c]/40 !text-[#fff8f6]/70
              hover:!text-[#fff8f6]"
          >
            Solo necesarias
          </button>
          <button
            onClick={accept}
            className="btn-gold text-sm px-4 py-2"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}