import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminSidebar from '../AdminSidebar'

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

describe('AdminSidebar — barra lateral de navegación admin', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/es/admin')
  })

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('renderiza los tres items de navegación', () => {
    render(<AdminSidebar locale="es" />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
  })

  it('muestra el encabezado Admin', () => {
    render(<AdminSidebar locale="es" />)

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('los enlaces apuntan a rutas con el locale correcto', () => {
    render(<AdminSidebar locale="es" />)

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/es/admin')
    expect(screen.getByText('Productos').closest('a')).toHaveAttribute('href', '/es/admin/productos')
    expect(screen.getByText('Pedidos').closest('a')).toHaveAttribute('href', '/es/admin/pedidos')
  })

  it('marca Dashboard como activo cuando la ruta es exactamente /es/admin', () => {
    mockUsePathname.mockReturnValue('/es/admin')
    render(<AdminSidebar locale="es" />)

    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).toContain('text-white')
  })

  it('marca Productos como activo cuando la ruta empieza por /es/admin/productos', () => {
    mockUsePathname.mockReturnValue('/es/admin/productos')
    render(<AdminSidebar locale="es" />)

    const productos = screen.getByText('Productos').closest('a')
    expect(productos?.className).toContain('text-white')
  })

  it('marca Pedidos como activo en subrutas de pedidos', () => {
    mockUsePathname.mockReturnValue('/es/admin/pedidos/abc-123')
    render(<AdminSidebar locale="es" />)

    const pedidos = screen.getByText('Pedidos').closest('a')
    expect(pedidos?.className).toContain('text-white')
  })

  // ── Casos de error realistas ────────────────────────────────────────────────

  it('Dashboard NO se marca activo cuando la ruta es /es/admin/productos', () => {
    mockUsePathname.mockReturnValue('/es/admin/productos')
    render(<AdminSidebar locale="es" />)

    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).not.toContain('text-white')
  })

  it('Dashboard NO se marca activo cuando la ruta es /es/admin/pedidos', () => {
    mockUsePathname.mockReturnValue('/es/admin/pedidos')
    render(<AdminSidebar locale="es" />)

    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).not.toContain('text-white')
  })

  it('solo un item está activo a la vez en una ruta de sección', () => {
    mockUsePathname.mockReturnValue('/es/admin/productos')
    render(<AdminSidebar locale="es" />)

    const activos = screen
      .getAllByRole('link')
      .filter(link => link.className.includes('text-white'))

    expect(activos).toHaveLength(1)
  })

  // ── Edge cases del dominio ──────────────────────────────────────────────────

  it('funciona con locale en inglés', () => {
    mockUsePathname.mockReturnValue('/en/admin')
    render(<AdminSidebar locale="en" />)

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/en/admin')
    const dashboard = screen.getByText('Dashboard').closest('a')
    expect(dashboard?.className).toContain('text-white')
  })

  it('no marca activo ningún item con locale distinto al de la ruta', () => {
    mockUsePathname.mockReturnValue('/en/admin')
    render(<AdminSidebar locale="es" />)

    const activos = screen
      .getAllByRole('link')
      .filter(link => link.className.includes('text-white'))

    expect(activos).toHaveLength(0)
  })
})
