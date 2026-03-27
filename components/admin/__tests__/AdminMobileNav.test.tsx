import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminMobileNav from '../AdminMobileNav'

// ── Mock de next/navigation ───────────────────────────────────────────────────

const mockUsePathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// ── Mock de next/link ─────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

// ─────────────────────────────────────────────────────────────────────────────

describe('AdminMobileNav — navegación móvil del panel admin', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/es/admin')
  })

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('renderiza los tres items de navegación', () => {
    render(<AdminMobileNav locale="es" />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
  })

  it('los enlaces apuntan a rutas con el locale correcto', () => {
    render(<AdminMobileNav locale="es" />)

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/es/admin')
    expect(screen.getByText('Productos').closest('a')).toHaveAttribute('href', '/es/admin/productos')
    expect(screen.getByText('Pedidos').closest('a')).toHaveAttribute('href', '/es/admin/pedidos')
  })

  it('marca Dashboard como activo cuando la ruta es exactamente /es/admin', () => {
    mockUsePathname.mockReturnValue('/es/admin')
    render(<AdminMobileNav locale="es" />)

    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).toContain('border-[#c9a84c]')
    expect(dashboard?.className).toContain('text-[#2a170f]')
  })

  it('marca Productos como activo cuando la ruta empieza por /es/admin/productos', () => {
    mockUsePathname.mockReturnValue('/es/admin/productos')
    render(<AdminMobileNav locale="es" />)

    const productos = screen.getByText('Productos').closest('a')
    expect(productos?.className).toContain('border-[#c9a84c]')
  })

  it('marca Pedidos como activo en subrutas de pedidos', () => {
    mockUsePathname.mockReturnValue('/es/admin/pedidos/123')
    render(<AdminMobileNav locale="es" />)

    const pedidos = screen.getByText('Pedidos').closest('a')
    expect(pedidos?.className).toContain('border-[#c9a84c]')
  })

  // ── Casos de error realistas ────────────────────────────────────────────────

  it('Dashboard NO se marca activo cuando la ruta es /es/admin/productos', () => {
    mockUsePathname.mockReturnValue('/es/admin/productos')
    render(<AdminMobileNav locale="es" />)

    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).toContain('border-transparent')
  })

  it('Dashboard NO se marca activo cuando la ruta es /es/admin/pedidos', () => {
    mockUsePathname.mockReturnValue('/es/admin/pedidos')
    render(<AdminMobileNav locale="es" />)

    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).toContain('border-transparent')
  })

  it('solo un item está activo a la vez en una ruta de sección', () => {
    mockUsePathname.mockReturnValue('/es/admin/productos')
    render(<AdminMobileNav locale="es" />)

    const activos = screen
      .getAllByRole('link')
      .filter(link => link.className.includes('border-[#c9a84c]'))

    expect(activos).toHaveLength(1)
  })

  // ── Edge cases del dominio ──────────────────────────────────────────────────

  it('funciona con locale en inglés', () => {
    mockUsePathname.mockReturnValue('/en/admin')
    render(<AdminMobileNav locale="en" />)

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/en/admin')
    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).toContain('border-[#c9a84c]')
  })

  it('no marca activo ningún item con locale distinto al de la ruta', () => {
    mockUsePathname.mockReturnValue('/en/admin')
    render(<AdminMobileNav locale="es" />)

    const activos = screen
      .getAllByRole('link')
      .filter(link => link.className.includes('border-[#c9a84c]'))

    expect(activos).toHaveLength(0)
  })
})
