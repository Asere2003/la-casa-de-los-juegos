import type { AudienceGroupItem, CategoryItem, ProductCardItem } from '@/types/home'

import AudienceGrid from '@/components/home/AudienceGrid'
import BestsellersSection from '@/components/home/BestsellersSection'
import CategoryScroller from '@/components/home/CategoryScroller'
import EditorialBanner from '@/components/home/EditorialBanner'
import HeroSection from '@/components/home/HeroSection'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('home')
  return {
    title: 'La Casa de los Juegos — Granada',
    description: t('hero_subtitle'),
  }
}

export default async function HomePage() {
  const tCat = await getTranslations('categories')
  const tHome = await getTranslations('home')

  const categories: CategoryItem[] = [
    { emoji: '♟', label: tCat('chess'), slug: 'ajedrez' },
    { emoji: '🧩', label: tCat('puzzles'), slug: 'puzzles' },
    { emoji: '🎲', label: tCat('boardgames'), slug: 'juegos-mesa' },
    { emoji: '🐉', label: tCat('rpg'), slug: 'rol' },
    { emoji: '🎭', label: tCat('classics'), slug: 'clasicos' },
    { emoji: '🌍', label: tCat('world'), slug: 'del-mundo' },
    { emoji: '🃏', label: tCat('cards'), slug: 'cartas' },
    { emoji: '🪀', label: tCat('skill'), slug: 'habilidad' },
  ]

  const newArrivals: ProductCardItem[] = [
  {
    id: '1',
    name: 'Tablero de Ajedrez de Lujo',
    slug: 'tablero-ajedrez-lujo',
    price: 145,
    category: 'Ajedrez',
    badgeBg: '#1c1c1c',
    tag: null,
    description: 'Tallado a mano en ébano y arce con incrustaciones de nácar.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATSsMtmjN2tZppklbu1Fw_gowS1Pv-oO1Fkz5ma2-SWrFXKKd2gWBLSNXZk5-_8DVthdVrMbCL3pzIOqKhMV4VuGn0h2KOfN8-eq_tKyYsZp5yuED-9rMvErGfVWqU3RAULTsgeNdYtV4hH4jBSt-IUuJ3xuYb8e9Ld4Nrb4GgBZwZRXqf3qTCnkdswCChW3Z8HS-_kFSUlz5Mvuoa-7IEm2sS6jWgZVImtH4Xfz9e3oHbSPivquJjW461Hx20Qgj9TTNtZ8ATVw',
  },
  {
    id: '2',
    name: 'Dados de Resina Áurea',
    slug: 'dados-resina-aurea',
    price: 42.5,
    category: 'Rol',
    badgeBg: '#3d1a5c',
    tag: 'Nuevo',
    description: 'Set completo con pan de oro auténtico en resina cristalina.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk5JbuNDgIYeTKJ03cGaAAN6gkZG3Pr3TbaU1b7vDjINlFTP1E6m5dNFVB20IjG5MXesbnf9y86iJOng2wqtl6ewi8yuCXMbR9UGJ-kkiiCxN00QZh_-QYnJDUahc8XMQE7_vNkCFye0HI0dwYaWt2V9AcTafWqWPQUKR3LwQiWxRODAskvK1w9TlIw_uAhPsrnSffIMfZNj0t9tLHHsBySmotoF5qAcAI6F7CuMW3-ynQeCGucTCXmDullHxDjhE7dbOBiFVpGg',
  },
  {
    id: '3',
    name: 'Caja Secreta Kyu',
    slug: 'caja-secreta-kyu',
    price: 64,
    category: 'Clásicos',
    badgeBg: '#5c3d1a',
    tag: null,
    description: 'Puzzle de madera japonés con cámara oculta. Nivel maestro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXqSzQk3j4p1zioJq_0zsjUHzYxcItfxOB6jrNQpbp_qJsK4KDTRMK-78MxfwNF2W4dTBPr_perFLjIKmfhX7aAYnsDVCvzlgc4BxayidsSXLhUv0VblJUBRMED3AYfRA-eXylpynnZZe2RPWospD-I46cmhGlTW5xufD4hJE-Kim4Gu1ILQJRdUraBGjj5dwidRynNPl7OCSxHvkUyo1zisICLgW-XkSld_HGoFVLyOLuheJX3cuIXIhe2YV819--L4YILZGo6Q',
  },
  {
    id: '4',
    name: 'Puzzle Mecánico: El Orbe',
    slug: 'puzzle-mecanico-orbe',
    price: 120,
    category: 'Puzzles',
    badgeBg: '#1a3a5c',
    tag: 'Agotándose',
    description: '450 piezas de madera cortada por láser. Nivel Maestro.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU2UWgqSoQ1oa77D_cBP77ZdP8LmYJEOkyXwVMTelDMIIHSjD7OUStWWuWzqDXEniktMOuym0FLM2ljxdl4UjFkHFKu0I9UMe6TlJA-lg7YIQ-C8Vo3wWLqbhPzS-iBu-tAsjQV8DUhTNHHnV9Be_cXjM332qEAkYHmGIElu6SHAaSxXu6jeUu7RQZKHbAtuWqoaqUSOXVpqICz4VCCWQuVRZMeJ7qBWu1Cuv8FhvUDwpp5DJ7EakFt5BImav61ArNWvyxDz-Ysg',
  },
]

  const bestsellers: ProductCardItem[] = [
  {
    id: '5',
    name: 'Tablero Go Tradicional',
    slug: 'tablero-go-tradicional',
    price: 89,
    description: 'Madera de haya con piedras de resina pulida.',
    tag: 'Agotándose',
    tagBg: '#ba1a1a',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzY3gZbkXXGoan0CJAueBfpVyrpSxP48W34AM6HmPqZWI3HcFwDe_JEFdw5IMuUfQZDQUUtHkIFLdBVtS4xMZqatGBXpG2It0roWOAaxivhra2qRXGh38Fj0CHJcMyvxr6RzpzfWzlbDkYh_8w89HW8r1mX4C-uYXMgAhi-JTc827JI62PB9A1NTsSIo-ybOHDYhBNAQhlXX3OUt4gCTsRq5JXiEdk934jOGkfERZSqYEoDy7OAQ-TMx8gQ2KHLMoz2bIWVBzdQ',
  },
  {
    id: '4b',
    name: 'Puzzle Mecánico: El Orbe',
    slug: 'puzzle-mecanico-orbe',
    price: 120,
    description: 'Nivel Maestro. 450 piezas de madera cortada por láser.',
    tag: null,
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU2UWgqSoQ1oa77D_cBP77ZdP8LmYJEOkyXwVMTelDMIIHSjD7OUStWWuWzqDXEniktMOuym0FLM2ljxdl4UjFkHFKu0I9UMe6TlJA-lg7YIQ-C8Vo3wWLqbhPzS-iBu-tAsjQV8DUhTNHHnV9Be_cXjM332qEAkYHmGIElu6SHAaSxXu6jeUu7RQZKHbAtuWqoaqUSOXVpqICz4VCCWQuVRZMeJ7qBWu1Cuv8FhvUDwpp5DJ7EakFt5BImav61ArNWvyxDz-Ysg',
  },
  {
    id: '6',
    name: 'Baraja Tarot Arcano',
    slug: 'baraja-tarot-arcano',
    price: 35,
    description: 'Ilustraciones originales de 1920 recuperadas.',
    tag: null,
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxfFCxjMDaot8TtBIkyuMqD9ou2yOasTCtMMdygDEOwwDXX3fYTVKxhLjmEFJfR4XxbIqb1BwNJ9OzD5bVcH_I5l39Q8kDU17wd9ry1d9OgnS0b9KSDhjHEjGQk02Egly19ggL4bYHvmOuFdcRcHi9Je2agTENVdv1b51I29TqXSZItEfFH42YFd2bS2W4Inrn4Ee_fewbqJ9s_8ZOf83R0mICxDdnJu1ycn21wddKmDpt_TfCT31O3K93bTdXH039-JD6zTdrw',
  },
]

  const audienceGroups: AudienceGroupItem[] = [
    { label: tHome('age_kids'), sub: tHome('age_kids_sub'), borderColor: '#755b00', emoji: '👶' },
    { label: tHome('age_family'), sub: tHome('age_family_sub'), borderColor: '#1a5c2a', emoji: '👨‍👩‍👧' },
    { label: tHome('age_adults'), sub: tHome('age_adults_sub'), borderColor: '#805533', emoji: '🧠' },
    { label: tHome('age_expert'), sub: tHome('age_expert_sub'), borderColor: '#2c1810', emoji: '🏆' },
  ]

  return (
    <>
      <HeroSection image="inicio/hero-fondo-tienda-1" />
      <CategoryScroller items={categories} />
      <NewArrivalsSection items={newArrivals} />
      <EditorialBanner image="inicio/hero-tienda" />
      <BestsellersSection items={bestsellers} />
      <AudienceGrid items={audienceGroups} />
    </>
  )
}