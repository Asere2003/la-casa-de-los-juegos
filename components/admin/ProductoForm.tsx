'use client'

import type { Category, Product } from '@/types'
import { crearProducto, editarProducto } from '@/actions/admin'
import { useState, useTransition } from 'react'

import ImageUploader from '@/components/admin/ImageUploader'
import { useRouter } from 'next/navigation'

interface Props {
    product?: Product
    categories: Category[]
    locale: string
}

const CATEGORY_PREFIXES: Record<string, string> = {
    'ajedrez': 'AJE',
    'puzzles': 'PUZ',
    'juegos-mesa': 'JME',
    'rol': 'ROL',
    'clasicos': 'CLA',
    'del-mundo': 'DMU',
    'cartas': 'CAR',
    'habilidad': 'HAB',
}

function generateSku(categorySlug: string) {
    const prefix = CATEGORY_PREFIXES[categorySlug] ?? 'GEN'
    const num = Math.floor(100 + Math.random() * 900)
    return `${prefix}-${num}`
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

export default function ProductoForm({ product, categories, locale }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    // Campos del formulario
    const [name, setName] = useState(product?.name ?? '')
    const [slug, setSlug] = useState(product?.slug ?? '')
    const [slugManual, setSlugManual] = useState(false)
    const [sku, setSku] = useState(product?.sku ?? '')
    const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
    const [active, setActive] = useState(product?.active ?? true)
    const [featured, setFeatured] = useState(product?.featured ?? false)
    const [images, setImages] = useState<string[]>(product?.images ?? [])

    function handleNameChange(val: string) {
        setName(val)
        if (!slugManual) setSlug(slugify(val))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = product
                ? await editarProducto(product.id, formData)
                : await crearProducto(formData)

            if (result.error) {
                setError(result.error)
            } else {
                router.push(`/${locale}/admin/productos`)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            {/* ── INFORMACIÓN BÁSICA ── */}
            <section>
                <p className="section-label mb-4">Información básica</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Nombre (ES) *
                        </label>
                        <input
                            name="name"
                            value={name}
                            onChange={e => handleNameChange(e.target.value)}
                            required
                            className="input-base w-full"
                            placeholder="Catan, Azul, Ticket to Ride..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Nombre (EN)
                        </label>
                        <input
                            name="name_en"
                            defaultValue={product?.name_en ?? ''}
                            className="input-base w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Nombre (CAT)
                        </label>
                        <input
                            name="name_cat"
                            defaultValue={product?.name_cat ?? ''}
                            className="input-base w-full"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Slug *
                        </label>
                        <input
                            name="slug"
                            value={slug}
                            onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
                            required
                            className="input-base w-full font-mono text-sm"
                            placeholder="catan, azul, ticket-to-ride..."
                        />
                        <p className="text-xs text-[#2c1810]/40 mt-1">
                            Se genera automáticamente. Puedes editarlo manualmente.
                        </p>
                    </div>

                </div>
            </section>

            {/* ── DESCRIPCIONES ── */}
            <section>
                <p className="section-label mb-4">Descripciones</p>
                <div className="space-y-4">

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Descripción (ES)
                        </label>
                        <textarea
                            name="description"
                            defaultValue={product?.description ?? ''}
                            rows={4}
                            className="input-base w-full resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                                Descripción (EN)
                            </label>
                            <textarea
                                name="description_en"
                                defaultValue={product?.description_en ?? ''}
                                rows={3}
                                className="input-base w-full resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                                Descripción (CAT)
                            </label>
                            <textarea
                                name="description_cat"
                                defaultValue={product?.description_cat ?? ''}
                                rows={3}
                                className="input-base w-full resize-none"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* ── PRECIO Y STOCK ── */}
            <section>
                <p className="section-label mb-4">Precio y stock</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Precio (€) *
                        </label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={product?.price ?? ''}
                            required
                            className="input-base w-full"
                            placeholder="29.99"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Precio tachado (€)
                        </label>
                        <input
                            name="compare_price"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={product?.compare_price ?? ''}
                            className="input-base w-full"
                            placeholder="39.99"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Stock *
                        </label>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            defaultValue={product?.stock ?? 0}
                            required
                            className="input-base w-full"
                        />
                    </div>
                </div>
            </section>

            {/* ── CATEGORÍA Y BADGE ── */}
            <section>
                <p className="section-label mb-4">Categoría y etiqueta</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Categoría
                        </label>
                        <select
                            name="category_id"
                            value={categoryId}
                            onChange={e => {
                                const selected = categories.find(c => c.id === e.target.value)
                                setCategoryId(e.target.value)
                                if (selected && !product) {
                                    setSku(generateSku(selected.slug))
                                }
                            }}
                            className="input-base w-full"
                        >
                            <option value="">Sin categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            SKU
                        </label>
                        <input
                            name="sku"
                            value={sku}
                            onChange={e => setSku(e.target.value)}
                            className="input-base w-full font-mono text-sm"
                            placeholder="Selecciona una categoría"
                        />
                        <p className="text-xs text-[#2c1810]/40 mt-1">
                            Se genera automáticamente. Puedes editarlo.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Badge
                        </label>
                        <select
                            name="badge"
                            defaultValue={product?.badge ?? ''}
                            className="input-base w-full"
                        >
                            <option value="">Sin badge</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="oferta">Oferta</option>
                            <option value="agotandose">Agotándose</option>
                            <option value="ultimas-unidades">Últimas unidades</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Dificultad
                        </label>
                        <select
                            name="difficulty"
                            defaultValue={product?.difficulty ?? ''}
                            className="input-base w-full"
                        >
                            <option value="">Sin especificar</option>
                            <option value="familiar">Familiar</option>
                            <option value="medio">Medio</option>
                            <option value="avanzado">Avanzado</option>
                            <option value="experto">Experto</option>
                        </select>
                    </div>

                </div>
            </section>

            {/* ── DETALLES DEL JUEGO ── */}
            <section>
                <p className="section-label mb-4">Detalles del juego</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Jugadores mín.
                        </label>
                        <input
                            name="min_players"
                            type="number"
                            min="1"
                            defaultValue={product?.min_players ?? ''}
                            className="input-base w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Jugadores máx.
                        </label>
                        <input
                            name="max_players"
                            type="number"
                            min="1"
                            defaultValue={product?.max_players ?? ''}
                            className="input-base w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Edad mínima
                        </label>
                        <input
                            name="min_age"
                            type="number"
                            min="0"
                            defaultValue={product?.min_age ?? ''}
                            className="input-base w-full"
                            placeholder="8"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Duración (min)
                        </label>
                        <input
                            name="duration_min"
                            type="number"
                            min="0"
                            defaultValue={product?.duration_min ?? ''}
                            className="input-base w-full"
                            placeholder="60"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Material
                        </label>
                        <input
                            name="material"
                            defaultValue={product?.material ?? ''}
                            className="input-base w-full"
                            placeholder="Cartón, madera, plástico..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-[#2c1810]/50 mb-1">
                            Origen
                        </label>
                        <input
                            name="origin"
                            defaultValue={product?.origin ?? ''}
                            className="input-base w-full"
                            placeholder="Alemania, España..."
                        />
                    </div>

                </div>
            </section>

            {/* ── IMÁGENES ── */}
            <section>
            <p className="section-label mb-4">Imágenes</p>
            <ImageUploader images={images} onChange={setImages} />
            <input type="hidden" name="images" value={JSON.stringify(images)} />
            </section>

            {/* ── VISIBILIDAD ── */}
            <section>
                <p className="section-label mb-4">Visibilidad</p>
                <div className="flex gap-8">

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={e => setActive(e.target.checked)}
                            className="w-4 h-4 accent-[#004317]"
                        />
                        <span className="text-sm text-[#2c1810]">Producto activo (visible en tienda)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={e => setFeatured(e.target.checked)}
                            className="w-4 h-4 accent-[#004317]"
                        />
                        <span className="text-sm text-[#2c1810]">Producto destacado (aparece en home)</span>
                    </label>

                </div>
                {/* Campos ocultos con el valor controlado */}
                <input type="hidden" name="active" value={active ? 'true' : 'false'} />
                <input type="hidden" name="featured" value={featured ? 'true' : 'false'} />
            </section>

            {/* ── ACCIONES ── */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#2c1810]/10">
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary px-8 py-2.5 disabled:opacity-50"
                >
                    {isPending
                        ? 'Guardando...'
                        : product ? 'Guardar cambios' : 'Crear producto'
                    }
                </button>
                <button
                    type="button"
                    onClick={() => router.push(`/${locale}/admin/productos`)}
                    className="btn-outline px-6 py-2.5"
                >
                    Cancelar
                </button>
            </div>

        </form>
    )
}