'use client'

import AjustesTab from './AjustesTab'
import FavoritosTab from './FavoritosTab'
import PedidosTab from './PedidosTab'
import ResenasTab from './Resenastab'
import type { Favorite, Review } from '@/types/cuentas'
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
  created_at: string,
  delivered_at: string | null
  order_items: OrderItem[]
}

interface Props {
  user: User
  profile: Profile | null
  orders: Order[]
  favorites: Favorite[]
  reviews: Review[]
  purchasedProductIds: string[]
}

export default function CuentaDashboard({ user, profile, orders, favorites, reviews, purchasedProductIds }: Props) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'ajustes')
  const t = useTranslations('cuenta')

  const tabs = [
    {
      key: 'ajustes', label: t('tabs.ajustes'), badge: null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      key: 'pedidos', label: t('tabs.pedidos'), badge: orders.length > 0 ? orders.length : null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      key: 'favoritos', label: t('tabs.favoritos'), badge: favorites.length > 0 ? favorites.length : null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    },
    {
      key: 'resenas', label: t('tabs.resenas'), badge: null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
  ]

  const nombreCorto = profile?.nombre
    ? profile.nombre.split(' ')[0]
    : user.email?.split('@')[0] ?? ''

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {/* ── Cabecera ── */}
        <div className="mb-8 pb-6 border-b border-[#c0c9bc]/30">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
            {t('heading')}
          </span>
          <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4" />
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl text-[#2a170f]" style={{ fontFamily: 'Noto Serif, serif' }}>
                {t('greeting')}{' '}
                <span className="italic text-[#1a5c2a]">{nombreCorto}</span>
              </h1>
              <p className="mt-1 text-sm text-[#717a6f]" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* ── Layout desktop: sidebar + contenido ── */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar desktop */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <nav className="space-y-1 sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-sm ${activeTab === tab.key
                      ? 'bg-[#004317] text-white'
                      : 'text-[#717a6f] hover:bg-[#004317]/5 hover:text-[#2a170f]'
                    }`}
                >
                  <span className={activeTab === tab.key ? 'text-white' : 'text-[#717a6f]'}>
                    {tab.icon}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] flex-1">
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-[#c9a84c] text-[#2c1810]'
                      }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Pestañas móvil */}
          <div className="md:hidden flex border-b border-[#c0c9bc]/40 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  font-mono text-[9px] uppercase tracking-[0.18em]
                  px-4 py-3 border-b-2 transition-all whitespace-nowrap
                  ${activeTab === tab.key
                    ? 'border-[#c9a84c] text-[#2a170f]'
                    : 'border-transparent text-[#717a6f]'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido */}
          <main className="flex-1 min-w-0">
            {activeTab === 'ajustes' && <AjustesTab user={user} profile={profile} />}
            {activeTab === 'pedidos' && <PedidosTab orders={orders} />}
            {activeTab === 'favoritos' && (
              <FavoritosTab userId={user.id} initialFavorites={favorites} />
            )}
            {activeTab === 'resenas' && (
              <ResenasTab userId={user.id} initialReviews={reviews} purchasedProductIds={purchasedProductIds} />
            )}
          </main>

        </div>
      </div>
    </div>
  )
}

