'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  locale: string
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/pedidos', label: 'Pedidos' },
]

export default function AdminMobileNav({ locale }: Props) {
  const pathname = usePathname()

  return (
    <div className="md:hidden flex border-b border-[#c0c9bc]/40 mb-6 overflow-x-auto no-scrollbar">
      {navItems.map(item => {
        const href = `/${locale}${item.href}`
        const isActive = item.href === '/admin'
          ? pathname === `/${locale}/admin`
          : pathname.startsWith(href)

        return (
          <Link
            key={item.href}
            href={href}
            className={`
              font-mono text-[9px] uppercase tracking-[0.18em]
              px-5 py-3 border-b-2 transition-all whitespace-nowrap
              ${isActive
                ? 'border-[#c9a84c] text-[#2a170f]'
                : 'border-transparent text-[#717a6f] hover:text-[#2a170f]'
              }
            `}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}