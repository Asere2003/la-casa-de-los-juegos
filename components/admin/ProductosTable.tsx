'use client'

import { borrarProducto, toggleActivo, toggleDestacado } from '@/actions/admin'
import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

interface Props {
    products: Product[]
    locale: string
}

export default function ProductosTable({ products, locale }: Props) {
    const tableRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<string | null>(null)
    const [lista, setLista] = useState(products)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [page, setPage] = useState(1)
    const PER_PAGE = 8
    const [pendingScroll, setPendingScroll] = useState(false)


    const categoryOptions = Array.from(
        new Set(products.map(p => p.category?.name).filter(Boolean))
    ) as string[]

    const filtered = lista.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.slug.toLowerCase().includes(search.toLowerCase())
        const matchCategory = filterCategory ? p.category?.name === filterCategory : true
        return matchSearch && matchCategory
    })

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    async function handleToggleActivo(id: string, current: boolean) {
        setLoading(id + '-activo')
        await toggleActivo(id, !current)
        setLista(prev => prev.map(p => p.id === id ? { ...p, active: !current } : p))
        setLoading(null)
    }

    async function handleToggleDestacado(id: string, current: boolean) {
        setLoading(id + '-destacado')
        await toggleDestacado(id, !current)
        setLista(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p))
        setLoading(null)
    }

    async function handleBorrar(id: string, name: string) {
        if (!confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) return
        setLoading(id + '-borrar')
        const result = await borrarProducto(id)
        if (result.error) {
            alert(result.error)
        } else {
            setLista(prev => prev.filter(p => p.id !== id))
        }
        setLoading(null)
    }

    function changePage(newPage: number) {
        setPage(newPage)
        setPendingScroll(true)
    }

useEffect(() => {
  if (pendingScroll) {
    if (window.innerWidth < 768) {
      const top = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 170
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setPendingScroll(false)
  }
}, [pendingScroll])

    if (lista.length === 0) {
        return (
            <div className="text-center py-20 text-[#2c1810]/40">
                No hay productos todavía.{' '}
                <Link href={`/${locale}/admin/productos/nuevo`} className="text-[#004317] underline">
                    Crea el primero
                </Link>
            </div>
        )
    }

    return (
        <div ref={tableRef}>
            {/* ── FILTROS ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre o slug..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="input-base flex-1"
                />
                <select
                    value={filterCategory}
                    onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
                    className="input-base sm:w-48"
                >
                    <option value="">Todas las categorías</option>
                    {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {(search || filterCategory) && (
                    <button
                        onClick={() => { setSearch(''); setFilterCategory(''); setPage(1) }}
                        className="btn-outline px-4 text-sm"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* Contador */}
            <p className="text-xs text-[#2c1810]/40 mb-4">
                {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
                {(search || filterCategory) ? ' encontrados' : ' en total'}
            </p>
            {/* ── VISTA MÓVIL (tarjetas) ── */}
            <div className="md:hidden space-y-3">
                {paginated.map(product => (
                    <div key={product.id} className="bg-white border border-[#2c1810]/10 rounded p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-[#004317]/10 rounded flex-shrink-0 overflow-hidden">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#004317]/30 text-xl">🎲</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#2c1810] truncate">{product.name}</p>
                                <p className="text-xs text-[#2c1810]/40">{product.category?.name ?? '—'}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleToggleDestacado(product.id, product.featured)}
                                    disabled={loading === product.id + '-destacado'}
                                    className={`text-lg ${product.featured ? 'opacity-100' : 'opacity-20'}`}
                                >⭐</button>
                                <button
                                    onClick={() => handleToggleActivo(product.id, product.active)}
                                    disabled={loading === product.id + '-activo'}
                                    className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${product.active ? 'bg-[#004317]' : 'bg-[#2c1810]/20'
                                        }`}
                                >
                                    <span
                                        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                                        style={{ transform: product.active ? 'translateX(16px)' : 'translateX(0)' }}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-medium text-[#004317]">{product.price.toFixed(2)} €</span>
                                {product.compare_price && (
                                    <span className="ml-2 text-xs text-[#2c1810]/40 line-through">{product.compare_price.toFixed(2)} €</span>
                                )}
                                <span className={`ml-3 text-sm font-medium ${product.stock <= 3 ? 'text-red-600' : 'text-[#2c1810]'}`}>
                                    Stock: {product.stock}
                                    {product.stock <= 3 && product.stock > 0 && (
                                        <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">bajo</span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">agotado</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/${locale}/admin/productos/${product.id}`}
                                    className="text-xs text-[#004317] border border-[#004317]/30 px-3 py-1.5 rounded hover:bg-[#004317]/5 transition-colors"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleBorrar(product.id, product.name)}
                                    disabled={loading === product.id + '-borrar'}
                                    className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── VISTA DESKTOP (tabla) ── */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-[#004317]/20 text-left">
                            <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Producto</th>
                            <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Categoría</th>
                            <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Precio</th>
                            <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Stock</th>
                            <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Activo</th>
                            <th className="pb-3 pr-4 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Destacado</th>
                            <th className="pb-3 text-[#2c1810]/50 font-medium uppercase tracking-wider text-xs">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2c1810]/10">
                        {paginated.map(product => (
                            <tr key={product.id} className="hover:bg-[#004317]/5 transition-colors">
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#004317]/10 rounded flex-shrink-0 overflow-hidden">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#004317]/30 text-lg">🎲</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2c1810]">{product.name}</p>
                                            <p className="text-xs text-[#2c1810]/40">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 pr-4 text-[#2c1810]/60">{product.category?.name ?? '—'}</td>
                                <td className="py-3 pr-4">
                                    <span className="font-medium text-[#004317]">{product.price.toFixed(2)} €</span>
                                    {product.compare_price && (
                                        <span className="ml-2 text-xs text-[#2c1810]/40 line-through">{product.compare_price.toFixed(2)} €</span>
                                    )}
                                </td>
                                <td className="py-3 pr-4">
                                    <span className={`font-medium ${product.stock <= 3 ? 'text-red-600' : 'text-[#2c1810]'}`}>
                                        {product.stock}
                                    </span>
                                    {product.stock <= 3 && product.stock > 0 && (
                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">bajo</span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">agotado</span>
                                    )}
                                </td>
                                <td className="py-3 pr-4">
                                    <button
                                        onClick={() => handleToggleActivo(product.id, product.active)}
                                        disabled={loading === product.id + '-activo'}
                                        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${product.active ? 'bg-[#004317]' : 'bg-[#2c1810]/20'
                                            }`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${product.active ? 'translate-x-4' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </td>
                                <td className="py-3 pr-4">
                                    <button
                                        onClick={() => handleToggleDestacado(product.id, product.featured)}
                                        disabled={loading === product.id + '-destacado'}
                                        className={`text-lg transition-opacity ${product.featured ? 'opacity-100' : 'opacity-20 hover:opacity-50'
                                            }`}
                                    >⭐</button>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/${locale}/admin/productos/${product.id}`}
                                            className="text-xs text-[#004317] border border-[#004317]/30 px-3 py-1 rounded hover:bg-[#004317]/5 transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleBorrar(product.id, product.name)}
                                            disabled={loading === product.id + '-borrar'}
                                            className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* ── PAGINACIÓN ── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => changePage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="btn-outline px-4 py-2 text-sm disabled:opacity-30"
                    >
                        ← Anterior
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => changePage(n)}
                                className={`w-8 h-8 text-sm rounded transition-colors ${page === n
                                        ? 'bg-[#004317] text-white'
                                        : 'text-[#2c1810]/60 hover:bg-[#004317]/10'
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => changePage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="btn-outline px-4 py-2 text-sm disabled:opacity-30"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    )
}