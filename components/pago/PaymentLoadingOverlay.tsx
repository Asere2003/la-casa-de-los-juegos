'use client'

import { useEffect, useState } from 'react'

import Logo from '@/components/Logo'
import { useTranslations } from 'next-intl'

export default function PaymentLoadingOverlay() {
  const t = useTranslations('pago')
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  const messages = [
    t('processing_msg_1'),
    t('processing_msg_2'),
    t('processing_msg_3'),
    t('processing_msg_4'),
  ]

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-700"
      style={{
        background: 'linear-gradient(135deg, #001f0a 0%, #004317 50%, #002d12 100%)',
        opacity: visible ? 1 : 0,
      }}
      aria-live="polite"
      aria-label="Procesando pago"
    >
      {/* Viñeta bordes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Líneas doradas */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />

      {/* Contenido */}
      <div className="relative flex flex-col items-center gap-8 px-8 text-center max-w-sm">

        {/* Círculo girando + Logo */}
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>

          {/* Arco exterior girando */}
          <svg
            className="absolute inset-0"
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            style={{ animation: 'spin-circle 2s linear infinite' }}
            aria-hidden="true"
          >
            {/* Pista base */}
            <circle
              cx="80" cy="80" r="72"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="2"
            />
            {/* Arco dorado */}
            <circle
              cx="80" cy="80" r="72"
              stroke="#c9a84c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100 352"
              strokeDashoffset="0"
            />
          </svg>

          {/* Arco interior girando en sentido contrario */}
          <svg
            className="absolute inset-0"
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            style={{ animation: 'spin-circle-reverse 3s linear infinite' }}
            aria-hidden="true"
          >
            <circle
              cx="80" cy="80" r="64"
              stroke="rgba(201,168,76,0.08)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="40 362"
            />
          </svg>

          {/* Logo centrado */}
          <div className="relative z-10">
            <Logo
              src="/images/icons/logo_new_sn.svg"
              width={96}
              height={96}
              ariaLabel="La Casa de los Juegos"
            />
          </div>
        </div>

        {/* Mensaje rotatorio */}
        <div className="h-8 flex items-center justify-center overflow-hidden">
          <p
            key={msgIndex}
            className="font-headline italic text-white text-xl leading-none"
            style={{ animation: 'fade-slide-up 0.5s ease-out' }}
          >
            {messages[msgIndex]}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-3" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block rounded-full bg-[#c9a84c]"
              style={{
                width: i === 1 ? '10px' : '6px',
                height: i === 1 ? '10px' : '6px',
                animation: 'dot-bounce 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Aviso */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.6" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              {t('secure_payment')}
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
            {t('do_not_close')}
          </p>
        </div>

      </div>

      <style>{`
        @keyframes spin-circle {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-circle-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40%            { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}