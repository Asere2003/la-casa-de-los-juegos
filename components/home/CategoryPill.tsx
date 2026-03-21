import type { CategoryItem } from '@/types/home'
import { Link } from '@/i18n/navigation'

type CategoryPillProps = {
  item: CategoryItem
}

export default function CategoryPill({ item }: CategoryPillProps) {
  return (
    <Link
      href={`/catalogo?category=${item.slug}`}
      className="flex flex-col items-center gap-2.5 shrink-0 group min-w-[72px] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded-lg"
      aria-label={`Categoría ${item.label}`}
    >
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--color-surface-low)] flex items-center justify-center transition-all duration-300 shadow-warm border border-[var(--color-outline-var)]/30 group-hover:scale-110 group-hover:rotate-[-3deg]">
        <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
      </div>
      <span className="font-headline italic text-xs text-[var(--color-on-surface)] text-center leading-tight">
        {item.label}
      </span>
    </Link>
  )
}