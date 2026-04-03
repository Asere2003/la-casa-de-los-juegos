'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  locale: string
}

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    href: '/admin/productos',
    label: 'Productos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    )
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    )
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
    )
  }
]

export default function AdminSidebar({ locale }: Props) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-52 flex-shrink-0">
      <nav className="space-y-1 sticky top-24">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] px-4 mb-3">
          Admin
        </p>
        {navItems.map(item => {
          const href = `/${locale}${item.href}`
          const isActive = item.href === '/admin'
            ? pathname === `/${locale}/admin`
            : pathname.startsWith(href)

          return (
            <Link
              key={item.href}
              href={href}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-sm ${
                isActive
                  ? 'bg-[#004317] text-white'
                  : 'text-[#717a6f] hover:bg-[#004317]/5 hover:text-[#2a170f]'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-[#717a6f]'}>
                {item.icon}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}