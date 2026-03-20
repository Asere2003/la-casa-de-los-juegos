import type { CatalogProduct, CatalogSearchParams } from '@/types/catalog'

import ActiveFilters from '@/components/catalogo/ActiveFilters'
import CatalogHeader from '@/components/catalogo/CatalogHeader'
import FilterSidebar from '@/components/catalogo/FilterSidebar'
import type { Metadata } from 'next'
import ProductGrid from '@/components/catalogo/ProductGrid'

export const metadata: Metadata = {
  title: 'Catálogo — La Casa de los Juegos',
  description: 'Explora juegos de mesa, puzzles, ajedrez y curiosidades lúdicas.',
}

const products: CatalogProduct[] = [
  {
    id: '1',
    name: 'Ajedrez de la Alhambra',
    slug: 'ajedrez-alhambra',
    price: 145,
    description: 'Tallado a mano en ébano y arce con incrustaciones de nácar.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATSsMtmjN2tZppklbu1Fw_gowS1Pv-oO1Fkz5ma2-SWrFXKKd2gWBLSNXZk5-_8DVthdVrMbCL3pzIOqKhMV4VuGn0h2KOfN8-eq_tKyYsZp5yuED-9rMvErGfVWqU3RAULTsgeNdYtV4hH4jBSt-IUuJ3xuYb8e9Ld4Nrb4GgBZwZRXqf3qTCnkdswCChW3Z8HS-_kFSUlz5Mvuoa-7IEm2sS6jWgZVImtH4Xfz9e3oHbSPivquJjW461Hx20Qgj9TTNtZ8ATVw',
    category: 'Ajedrez',
    categorySlug: 'ajedrez',
    badgeBg: '#1c1c1c',
    ageTags: ['adultos', 'expertos'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Puzzle Mecánico: El Orbe',
    slug: 'puzzle-mecanico-orbe',
    price: 120,
    description: '450 piezas de madera cortada por láser. Nivel Maestro.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCU2UWgqSoQ1oa77D_cBP77ZdP8LmYJEOkyXwVMTelDMIIHSjD7OUStWWuWzqDXEniktMOuym0FLM2ljxdl4UjFkHFKu0I9UMe6TlJA-lg7YIQ-C8Vo3wWLqbhPzS-iBu-tAsjQV8DUhTNHHnV9Be_cXjM332qEAkYHmGIElu6SHAaSxXu6jeUu7RQZKHbAtuWqoaqUSOXVpqICz4VCCWQuVRZMeJ7qBWu1Cuv8FhvUDwpp5DJ7EakFt5BImav61ArNWvyxDz-Ysg',
    category: 'Puzzles',
    categorySlug: 'puzzles',
    badgeBg: '#1a3a5c',
    ageTags: ['adultos', 'expertos'],
    inStock: true,
    isNew: true,
  },
  {
    id: '3',
    name: 'Dados de Resina Áurea',
    slug: 'dados-resina-aurea',
    price: 42.5,
    description: 'Set completo con pan de oro auténtico en resina cristalina.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDk5JbuNDgIYeTKJ03cGaAAN6gkZG3Pr3TbaU1b7vDjINlFTP1E6m5dNFVB20IjG5MXesbnf9y86iJOng2wqtl6ewi8yuCXMbR9UGJ-kkiiCxN00QZh_-QYnJDUahc8XMQE7_vNkCFye0HI0dwYaWt2V9AcTafWqWPQUKR3LwQiWxRODAskvK1w9TlIw_uAhPsrnSffIMfZNj0t9tLHHsBySmotoF5qAcAI6F7CuMW3-ynQeCGucTCXmDullHxDjhE7dbOBiFVpGg',
    category: 'Rol',
    categorySlug: 'rol',
    badgeBg: '#3d1a5c',
    ageTags: ['adultos'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Baraja Tarot Arcano',
    slug: 'baraja-tarot-arcano',
    price: 35,
    description: 'Ilustraciones originales de 1920 recuperadas.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxfFCxjMDaot8TtBIkyuMqD9ou2yOasTCtMMdygDEOwwDXX3fYTVKxhLjmEFJfR4XxbIqb1BwNJ9OzD5bVcH_I5l39Q8kDU17wd9ry1d9OgnS0b9KSDhjHEjGQk02Egly19ggL4bYHvmOuFdcRcHi9Je2agTENVdv1b51I29TqXSZItEfFH42YFd2bS2W4Inrn4Ee_fewbqJ9s_8ZOf83R0mICxDdnJu1ycn21wddKmDpt_TfCT31O3K93bTdXH039-JD6zTdrw',
    category: 'Cartas',
    categorySlug: 'cartas',
    badgeBg: '#5c1a1a',
    ageTags: ['adultos'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Caja Secreta Kyu',
    slug: 'caja-secreta-kyu',
    price: 64,
    description: 'Puzzle de madera japonés con cámara oculta. Nivel maestro.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXqSzQk3j4p1zioJq_0zsjUHzYxcItfxOB6jrNQpbp_qJsK4KDTRMK-78MxfwNF2W4dTBPr_perFLjIKmfhX7aAYnsDVCvzlgc4BxayidsSXLhUv0VblJUBRMED3AYfRA-eXylpynnZZe2RPWospD-I46cmhGlTW5xufD4hJE-Kim4Gu1ILQJRdUraBGjj5dwidRynNPl7OCSxHvkUyo1zisICLgW-XkSld_HGoFVLyOLuheJX3cuIXIhe2YV819--L4YILZGo6Q',
    category: 'Clásicos',
    categorySlug: 'clasicos',
    badgeBg: '#5c3d1a',
    ageTags: ['familia', 'adultos'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Tablero Go Tradicional',
    slug: 'tablero-go-tradicional',
    price: 89,
    description: 'Madera de haya con piedras de resina pulida.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzY3gZbkXXGoan0CJAueBfpVyrpSxP48W34AM6HmPqZWI3HcFwDe_JEFdw5IMuUfQZDQUUtHkIFLdBVtS4xMZqatGBXpG2It0roWOAaxivhra2qRXGh38Fj0CHJcMyvxr6RzpzfWzlbDkYh_8w89HW8r1mX4C-uYXMgAhi-JTc827JI62PB9A1NTsSIo-ybOHDYhBNAQhlXX3OUt4gCTsRq5JXiEdk934jOGkfERZSqYEoDy7OAQ-TMx8gQ2KHLMoz2bIWVBzdQ',
    category: 'Clásicos',
    categorySlug: 'clasicos',
    badgeBg: '#5c3d1a',
    ageTags: ['adultos', 'expertos'],
    inStock: false,
  },
]

function sortProducts(items: CatalogProduct[], sort?: string) {
  const cloned = [...items]

  switch (sort) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return cloned.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    default:
      return cloned
  }
}

function filterProducts(items: CatalogProduct[], searchParams: CatalogSearchParams) {
  let result = [...items]

  if (searchParams.category) {
    result = result.filter((item) => item.categorySlug === searchParams.category)
  }

  if (searchParams.age) {
    result = result.filter((item) => item.ageTags?.includes(searchParams.age || ''))
  }

  return sortProducts(result, searchParams.sort)
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams

  const normalized: CatalogSearchParams = {
    category: typeof params.category === 'string' ? params.category : undefined,
    age: typeof params.age === 'string' ? params.age : undefined,
    sort: typeof params.sort === 'string' ? params.sort : undefined,
  }

  const filteredProducts = filterProducts(products, normalized)

  return (
    <>
      <CatalogHeader searchParams={normalized} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <ActiveFilters searchParams={normalized} />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          <FilterSidebar searchParams={normalized} />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </>
  )
}