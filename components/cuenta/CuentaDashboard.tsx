'use client'

import AjustesTab from './AjustesTab'
import PedidosTab from './PedidosTab'
import type { User } from '@supabase/supabase-js'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface Profile {
  id: string
  nombre: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  codigo_postal: string | null
  pais: string | null
}
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
  order_items: OrderItem[]
}

interface Props {
  user: User
  profile: Profile | null
  orders: Order[]
}

export default function CuentaDashboard({ user, profile, orders }: Props) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'ajustes')
  const t = useTranslations('cuenta')

  const tabs = [
    { key: 'ajustes',   label: t('tabs.ajustes') },
    { key: 'pedidos',   label: t('tabs.pedidos') },
    { key: 'favoritos', label: t('tabs.favoritos') },
    { key: 'resenas',   label: t('tabs.resenas') },
  ]

  const nombreCorto = profile?.nombre
    ? profile.nombre.split(' ')[0]
    : user.email?.split('@')[0] ?? ''

  return (
    <div className="min-h-screen bg-[#fff8f6] px-4">
      <div className="max-w-md mx-auto">

        {/* ── Cabecera ── */}
        <div className="mb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
            {t('heading')}
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-5" />
          <h1
            className="text-3xl text-[#2a170f]"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            {t('greeting')}{' '}
            <span className="italic text-[#1a5c2a]">{nombreCorto}</span>
          </h1>
          <p
            className="mt-2 text-sm text-[#717a6f]"
            style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
          >
            {user.email}
          </p>
        </div>

        {/* ── Pestañas ── */}
        <div className="flex border-b border-[#c0c9bc]/40 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                font-mono text-[9px] uppercase tracking-[0.18em]
                px-5 py-3 border-b-2 transition-all duration-200
                whitespace-nowrap focus-visible:ring-2
                focus-visible:ring-[#c9a84c]
                ${activeTab === tab.key
                  ? 'border-[#c9a84c] text-[#2a170f]'
                  : 'border-transparent text-[#717a6f] hover:text-[#2a170f]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Contenido ── */}
        {activeTab === 'ajustes' && (
          <AjustesTab user={user} profile={profile} />
        )}
        {activeTab === 'pedidos' && <PedidosTab orders={orders} />}
        {activeTab === 'favoritos' && <Proximamente label={t('tabs.favoritos')} />}
        {activeTab === 'resenas' && <Proximamente label={t('tabs.resenas')} />}

      </div>
    </div>
  )
}

function Proximamente({ label }: { label: string }) {
  const t = useTranslations('cuenta')
  return (
    <div className="text-center py-16">
      <span className="block w-10 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
      <p
        className="text-[#717a6f] text-sm"
        style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
      >
        {t('coming_soon', { label })}
      </p>
    </div>
  )
}
