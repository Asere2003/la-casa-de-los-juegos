import type { AudienceGroupItem, CategoryItem, ProductCardItem } from '@/types/home'

import AudienceGrid from '@/components/home/AudienceGrid'
import BestsellersSection from '@/components/home/BestsellersSection'
import CategoryScroller from '@/components/home/CategoryScroller'
import EditorialBanner from '@/components/home/EditorialBanner'
import HeroSection from '@/components/home/HeroSection'
import type { Metadata } from 'next'
import NewArrivalsSection from '@/components/home/NewArrivalsSection'

export const metadata: Metadata = {
  title: 'La Casa de los Juegos — Granada',
  description: 'Juegos de mesa, puzzles, ajedrez y curiosidades lúdicas de todo el mundo.',
}

const categories: CategoryItem[] = [
  { emoji: '♟', label: 'Ajedrez', slug: 'ajedrez' },
  { emoji: '🧩', label: 'Puzzles', slug: 'puzzles' },
  { emoji: '🎲', label: 'Juegos de Mesa', slug: 'juegos-mesa' },
  { emoji: '🐉', label: 'Rol', slug: 'rol' },
  { emoji: '🎭', label: 'Clásicos', slug: 'clasicos' },
  { emoji: '🌍', label: 'Del Mundo', slug: 'del-mundo' },
  { emoji: '🃏', label: 'Cartas', slug: 'cartas' },
  { emoji: '🪀', label: 'Habilidad', slug: 'habilidad' },
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
  { label: 'Niños', sub: 'Mentes en Crecimiento', borderColor: '#755b00', emoji: '👶' },
  { label: 'Familia', sub: 'Momentos Compartidos', borderColor: '#1a5c2a', emoji: '👨‍👩‍👧' },
  { label: 'Adultos', sub: 'Estrategia y Reflexión', borderColor: '#805533', emoji: '🧠' },
  { label: 'Expertos', sub: 'Desafíos Legendarios', borderColor: '#2c1810', emoji: '🏆' },
]

export default function HomePage() {
  return (
    <>
      <HeroSection image="https://lh3.googleusercontent.com/aida-public/AB6AXuABqfDQ7FIq-Rw5EulpIdYRnZPoJSC6oG3LCvFGO140UN8utxkyQG7ZmJe46QzBtErnf-44qDZz1oHapiOrzGOBI5trnDWCkHRoO36uuYsacYynXevH4-MZJFtkO1Gzw8tUhGIxj3D1QJrvC4oBLrNIsMBQPWjPJpocG2gwhJMZJLcsr9li-kPqIPbFsQY-PnKiSTw3LPc-eIa8O4_OL6Q0538LWbuLCQn5YqZt7tjjbpKgjJSweRqI78LJaYT4eEFKBtjs3V4uvw" />
      <CategoryScroller items={categories} />
      <NewArrivalsSection items={newArrivals} />
      <EditorialBanner image="https://lh3.googleusercontent.com/aida-public/AB6AXuBdwjKdfMVRKzn2XD9SKJZXwfVI_jjaEMkKdQQUVHB4azA0Q-6UuNfkUgwwuz8mIzwWoNz2BtXcqTwy-sus9ILmoV9eClT3RAXYM2xZWYgu8DeRe-GhM8VY1iREOw_CK0cnJ1qx0TGfJAujqyob-kF_UQSLB45X32GhXRlVPo56wH3roPz7g18A8Rln4FwqoTHehQbaevi1zl6smgkfbCaMCaU7bEs0NWZlMvTS9FZEGRuGzpAjrKF62KCWAs-69BkAAVqmsZxE0g" />
      <BestsellersSection items={bestsellers} />
      <AudienceGrid items={audienceGroups} />
    </>
  )
}