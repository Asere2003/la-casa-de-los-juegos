'use client'

interface Props {
  value: string
  onChange: (val: string) => void
}

const OPTIONS = [
  { value: 'newest',     label: 'Más recientes'       },
  { value: 'popular',    label: 'Más vendidos'         },
  { value: 'price_asc',  label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="relative shrink-0">
      <label htmlFor="sort-select" className="sr-only">Ordenar productos</label>
      <select
        id="sort-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-white border border-[#c0c9bc]/50 text-[#2a170f] font-body italic text-sm pl-4 pr-9 py-2.5 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] cursor-pointer transition-colors"
        style={{ borderRadius: '2px' }}
      >
        {OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
