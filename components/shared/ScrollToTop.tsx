'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY >= 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver al principio"
      className={`
        fixed bottom-20 md:bottom-8 right-4 z-40
        w-10 h-10
        bg-[#004317] border border-[#c9a84c]/40
        flex items-center justify-center
        text-[#c9a84c]
        shadow-[0_4px_16px_rgba(0,67,23,0.5)]
        transition-all duration-300
        hover:bg-[#1a5c2a] hover:border-[#c9a84c]/70 hover:scale-110
        active:scale-95
        focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}
      `}
      style={{ borderRadius: '2px' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
