import type { Product } from '@/types'

// ── Datos mock hasta conectar Supabase ──
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ajedrez de la Alhambra',
    slug: 'ajedrez-alhambra',
    description:
      'Inspirado en los intrincados patrones de la Alhambra, este conjunto de ajedrez es una oda a la artesanía granadina. Cada pieza ha sido tallada a mano en ébano y arce, pulida con ceras naturales para un tacto sedoso y ancestral.\n\nEl tablero, de 45cm, presenta incrustaciones de nácar genuino, convirtiendo cada partida en un acto ritual de estrategia y belleza. Una obra de arte funcional que merece un lugar privilegiado en cualquier hogar.',
    price: 185,
    compare_price: 220,
    stock: 3,
    sku: 'GR-1892-CH',
    category_id: 'ajedrez',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjUZi7ikAXyytHRUFv1hdcaC-lmDgZ9k5NRt_StZMdrxZYgFSb5PvA25Zj3JE5Z4TBwWKRw-iK6GAZIw8A_EpFRSGRljBvnwpPpCvrF0pO0xRRIJlkwlM068jBSswf-DFZsLGZhPPcTuh7qa3peCRq7-zCj9YwG3vm4yyXSU7Kfu-bBGv_nLDjdqQCgnrcgL5VwYDxnC6f0GSPw0CBpQmNW04d_hGWTvVHQpOKRCoVLFcV8IKombwMj5byoEkoUAoyFutNI2ocUg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8KJ0CTosqH5cf8Vg5F1SuIiIja9g0BXaXkL85mOkpz-KxvvMTTeSIQXJdaKBpAdLxM2g7RCtbjB5JQFpQICfqXUrY2tE_c_S-B9MqTTseJx3w5Azh6ULpvAP9A8YTuwd6yYzPyNIEx79nnnIT2JPV8fH7vXiKD_Muf_rLecbBBVAAcReC0k3gv8W7Gck48kZ-T8EtlnxPLN7PcDccU-ALKJkwcleRV8aHIxA1DqXMuBgZSlkkWwEpwLJt_nkZKz_iSNMbYitJiA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVRo7peTvxIqVL13JUWzZCLk76To7YhIg-B_UJ8OozSgSoZ9pkkZMyYdUXBd_840jgxGlDwOVelFGw_S86oNR2aNwvVuAD2RFvzwrTiUQQAUX_SYMn0t3B3JimKwBu0J2aCNRqTJ9T3fwslzOyBUKrzrlbW2Vd6CNQto3HiyATbuIuBuGrzgzcU0Izhc0Eft6x1QbI0IQmFrOArewqZg6fedn1NGVXqlQaKZjxhdvdsqEnv0HSJtUgV7WajH3lMhahnCeMnzeVnw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL_BGQ4SRkhVpJeztJWSgOxw4_98-bCfr_qII4pZQGwp2zPIJzqhSmaYrmnOoh8BuxCHTIFNSWMLBon3OVHUKNOKKsI3fb--d1u_DBmAO7vskTe4GS5mWd--3-QTQhnRDgEbCbXcDEaemrrrZIftGbUSE_aZAk_mV3KFj5Tvb2vHPkifmQZc6V45TM_Hfs774OGab134t68qIcr2U96MBTtmFd-YqqtmT4qnV1qJea2_o0TtHsEFbtMPRHTjTIWECFb4rXwovEdg',
    ],
    difficulty: 'experto',
    min_players: 2,
    max_players: 2,
    min_age: 12,
    duration_min: 60,
    material: 'Ébano, arce y nácar',
    featured: true,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'ajedrez', name: 'Ajedrez', slug: 'ajedrez', emoji: '♟', color: '#1c1c1c', created_at: '' },
  },
  {
    id: '2',
    name: 'Dados de Resina Áurea',
    slug: 'dados-resina-aurea',
    description: 'Set completo con pan de oro auténtico en resina cristalina.',
    price: 42.5,
    compare_price: undefined,
    stock: 15,
    sku: 'GR-2024-RD',
    category_id: 'rol',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDk5JbuNDgIYeTKJ03cGaAAN6gkZG3Pr3TbaU1b7vDjINlFTP1E6m5dNFVB20IjG5MXesbnf9y86iJOng2wqtl6ewi8yuCXMbR9UGJ-kkiiCxN00QZh_-QYnJDUahc8XMQE7_vNkCFye0HI0dwYaWt2V9AcTafWqWPQUKR3LwQiWxRODAskvK1w9TlIw_uAhPsrnSffIMfZNj0t9tLHHsBySmotoF5qAcAI6F7CuMW3-ynQeCGucTCXmDullHxDjhE7dbOBiFVpGg',
    ],
    difficulty: 'medio',
    min_players: 1,
    max_players: 6,
    min_age: 14,
    duration_min: 120,
    material: 'Resina',
    featured: false,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'rol', name: 'Rol', slug: 'rol', emoji: '🐉', color: '#3d1a5c', created_at: '' },
  },
  {
    id: '3',
    name: 'Karakorum Maze Box',
    slug: 'karakorum-maze-box',
    description: 'Nogal raro con dos cámaras ocultas y cerradura críptica.',
    price: 120,
    compare_price: undefined,
    stock: 8,
    sku: 'WP-KZ-102',
    category_id: 'puzzles',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWdjN2m5W5wEVZNsRgPFU013JHDiscovGBPS0cZAA8_EKmucdULD-pYevQ89FltyqTTR5hWU9oIHrg8eXUvr05oBIMNdRVKFU0zyH6bRVmJ1Wn2w-FM2vy92qF-I60CvFF330CkD29iW9FUWyqc1TpmtGa4MMImjANoYuhmI74AHr-7qX9T_jbcdYRMrPd5AL386gABPxM7haB4f7n4Ux0ecXqzcvYmM3GPLNYYOM_-lnQ17qK-1b8mny2u262KjWkt5j3W3uTlA',
    ],
    difficulty: 'experto',
    min_players: 1,
    max_players: 1,
    min_age: 16,
    duration_min: 90,
    material: 'Nogal',
    featured: true,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'puzzles', name: 'Puzzles', slug: 'puzzles', emoji: '🧩', color: '#1a3a5c', created_at: '' },
  },
  {
    id: '4',
    name: 'The Grand Vizier Chess',
    slug: 'grand-vizier-chess',
    description: 'Hueso torneado y ébano. Réplica cordobana del siglo XIV.',
    price: 345,
    compare_price: undefined,
    stock: 2,
    sku: 'CS-GV-01',
    category_id: 'ajedrez',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoRr0qF7ONyX6NgMXjvzJoL3U4nwdS0_tU3AtUZJmw4TKsh5GCNk7c6yFo7rrg6GtV5LObU2bCD4Ya3OYQqQTszFuJ-sOntp7wngRXg8gnW_bPK0aVkyR-IL-nE2rdGN1iEbuG_nYESwZTzoJhTq05AZCu-hewlAdah5L7-imMI22qtF-WSvMxvQ9qHVgHFG0D7nZSyUs8gx5xD9t7wKG7vO0wydemSqrAC2wvFnw0H3ZANdbtv_wmBbRDHIgLb9s1ssr3ICCoEw',
    ],
    difficulty: 'experto',
    min_players: 2,
    max_players: 2,
    min_age: 12,
    duration_min: 90,
    material: 'Hueso y ébano',
    featured: false,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'ajedrez', name: 'Ajedrez', slug: 'ajedrez', emoji: '♟', color: '#1c1c1c', created_at: '' },
  },
  {
    id: '5',
    name: 'Stellar Quartz Polyhedrals',
    slug: 'stellar-quartz-polyhedrals',
    description: 'Dados de piedra semipreciosa para aventureros exigentes.',
    price: 45,
    compare_price: undefined,
    stock: 20,
    sku: 'AD-SQ-24',
    category_id: 'rol',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMuyFwB9aTY8KnhS2n3Bus9197GcSE6Q8zAByDYznQxnfeYPHqTLWrqaZpJpT509w7b-IYktwyn6qk4J8eLeTlnbebjXW12whMgjPiqsVWNe3ALs2Ns7zGshJ-a6-NLJavuD0Obb4dgNXcOonZJ_LzrtU6NeKMQvqqWcG8Cyum9sC9X3hiKmcMEdtnvuBk-ly6dBdE4YH6Q82onj2SgV-Sf9GhQ5yqXI3fKB0gqfoSYp0xP9vVD2chYBo1tTKmMXVXFqz5H6LCQg',
    ],
    difficulty: 'medio',
    min_players: 1,
    max_players: 8,
    min_age: 14,
    duration_min: 120,
    material: 'Cuarzo',
    featured: false,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'rol', name: 'Rol', slug: 'rol', emoji: '🐉', color: '#3d1a5c', created_at: '' },
  },
  {
    id: '6',
    name: 'Backgammon Imperial',
    slug: 'backgammon-imperial',
    description: 'Tablero de viaje en piel y madera noble con piezas torneadas.',
    price: 125,
    compare_price: undefined,
    stock: 6,
    sku: 'BG-IMP-07',
    category_id: 'clasicos',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCs7Nf2AXWVhnDS9P7k1pN25bvE-aPE8ao87KfTbhBYdE_bVTGPH5cpqCJmwjMVU3fXKKJaxsNlUt_lqGdrDpYYnGaruGQuIRWP-KvyJdJdXYxDdRuq2JQBGFb8mkzdUXkhI77KKVOk67hFL00JutrrZ32EiT1SLPP2woXjkHr6WqjefHQeuLSA6UAHdPnJ9P22XeuC0v3nwmgtk6F-YEsjJKsewvy0YzOhu3btXC052BOwZYN_UcwGgzMcW1ENuNWH85ubXBloSQ',
    ],
    difficulty: 'medio',
    min_players: 2,
    max_players: 2,
    min_age: 10,
    duration_min: 30,
    material: 'Piel y madera',
    featured: false,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'clasicos', name: 'Clásicos', slug: 'clasicos', emoji: '🎭', color: '#5c3d1a', created_at: '' },
  },
  {
    id: '7',
    name: 'Tablero Go Tradicional',
    slug: 'tablero-go-tradicional',
    description: 'Madera de haya con piedras de resina pulida.',
    price: 89,
    compare_price: undefined,
    stock: 4,
    sku: 'GO-TR-01',
    category_id: 'del-mundo',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzY3gZbkXXGoan0CJAueBfpVyrpSxP48W34AM6HmPqZWI3HcFwDe_JEFdw5IMuUfQZDQUUtHkIFLdBVtS4xMZqatGBXpG2It0roWOAaxivhra2qRXGh38Fj0CHJcMyvxr6RzpzfWzlbDkYh_8w89HW8r1mX4C-uYXMgAhi-JTc827JI62PB9A1NTsSIo-ybOHDYhBNAQhlXX3OUt4gCTsRq5JXiEdk934jOGkfERZSqYEoDy7OAQ-TMx8gQ2KHLMoz2bIWVBzdQ',
    ],
    difficulty: 'avanzado',
    min_players: 2,
    max_players: 2,
    min_age: 8,
    duration_min: 60,
    material: 'Haya',
    featured: true,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'del-mundo', name: 'Del Mundo', slug: 'del-mundo', emoji: '🌍', color: '#1a4a5c', created_at: '' },
  },
  {
    id: '8',
    name: 'Baraja Tarot Arcano',
    slug: 'baraja-tarot-arcano',
    description: 'Ilustraciones originales de 1920 recuperadas.',
    price: 35,
    compare_price: undefined,
    stock: 12,
    sku: 'BT-ARC-20',
    category_id: 'cartas',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxfFCxjMDaot8TtBIkyuMqD9ou2yOasTCtMMdygDEOwwDXX3fYTVKxhLjmEFJfR4XxbIqb1BwNJ9OzD5bVcH_I5l39Q8kDU17wd9ry1d9OgnS0b9KSDhjHEjGQk02Egly19ggL4bYHvmOuFdcRcHi9Je2agTENVdv1b51I29TqXSZItEfFH42YFd2bS2W4Inrn4Ee_fewbqJ9s_8ZOf83R0mICxDdnJv1ycn21wddKmDpt_TfCT31O3K93bTdXH039-JD6zTdrw',
    ],
    difficulty: 'familiar',
    min_players: 1,
    max_players: 4,
    min_age: 16,
    duration_min: 30,
    material: 'Cartón premium',
    featured: false,
    active: true,
    created_at: '',
    updated_at: '',
    category: { id: 'cartas', name: 'Cartas', slug: 'cartas', emoji: '🃏', color: '#5c1a1a', created_at: '' },
  },
]

/** Buscar un producto por slug */
export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.slug === slug)
}

/** Obtener productos relacionados (misma categoría, excluyendo el actual) */
export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug)
  if (!product) return []

  const related = MOCK_PRODUCTS.filter(
    p => p.slug !== slug && p.category_id === product.category_id
  )

  // Si no hay suficientes de la misma categoría, rellenar con otros
  if (related.length < limit) {
    const others = MOCK_PRODUCTS.filter(
      p => p.slug !== slug && p.category_id !== product.category_id
    )
    related.push(...others.slice(0, limit - related.length))
  }

  return related.slice(0, limit)
}
