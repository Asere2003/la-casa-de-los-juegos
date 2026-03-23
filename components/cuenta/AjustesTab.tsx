'use client'

import DatosPersonalesForm from './DatosPersonalesForm'
import DireccionForm from './DireccionForm'
import SeguridadForm from './SeguridadForm'
import type { User } from '@supabase/supabase-js'
import { useState } from 'react'

interface Profile {
  id: string
  nombre: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  codigo_postal: string | null
  pais: string | null
}

interface Props {
  user: User
  profile: Profile | null
}

const secciones = [
  {
    key: 'perfil',
    label: 'Datos personales',
    desc: 'Nombre y teléfono',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    key: 'direccion',
    label: 'Dirección de envío',
    desc: 'Donde recibir tus pedidos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    key: 'seguridad',
    label: 'Seguridad',
    desc: 'Email y contraseña',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
]

export default function AjustesTab({ user, profile }: Props) {
  const [abierta, setAbierta] = useState<string | null>('perfil')

  return (
    <div className="space-y-3 pb-8">
      {secciones.map(sec => (
        <div
          key={sec.key}
          className="bg-white overflow-hidden transition-all duration-200"
          style={{
            borderRadius: '2px',
            boxShadow: '0 4px 16px rgba(42,23,15,.08)',
          }}
        >
          {/* ── Cabecera acordeón ── */}
          <button
            onClick={() => setAbierta(abierta === sec.key ? null : sec.key)}
            className="w-full flex items-center justify-between px-6 py-5
                       hover:bg-[#fff1ec] transition-colors duration-200
                       focus-visible:ring-2 focus-visible:ring-inset
                       focus-visible:ring-[#c9a84c]"
          >
            <div className="flex items-center gap-3">
              <span className={`${
                abierta === sec.key ? 'text-[#1a5c2a]' : 'text-[#717a6f]'
              } transition-colors`}>
                {sec.icon}
              </span>
              <div className="text-left">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em]
                               text-[#2a170f]">
                  {sec.label}
                </p>
                <p
                  className="text-xs text-[#717a6f] mt-0.5"
                  style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
                >
                  {sec.desc}
                </p>
              </div>
            </div>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#c0c9bc" strokeWidth="2" strokeLinecap="round"
              className={`transition-transform duration-300 flex-shrink-0 ${
                abierta === sec.key ? 'rotate-180' : ''
              }`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* ── Línea dorada cuando está abierto ── */}
          {abierta === sec.key && (
            <div className="h-px bg-[#c9a84c]/30 mx-6" />
          )}

          {/* ── Contenido desplegable ── */}
          {abierta === sec.key && (
            <div className="px-6 pt-5 pb-6 " style={{  paddingBottom: '20px' }}>
              {sec.key === 'perfil'    && <DatosPersonalesForm user={user} profile={profile} />}
              {sec.key === 'direccion' && <DireccionForm profile={profile} />}
              {sec.key === 'seguridad' && <SeguridadForm user={user} />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
