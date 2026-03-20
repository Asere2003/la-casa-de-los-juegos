import type { CatalogProduct } from '@/types/catalog'
import ProductCard from '@/components/shared/ProductCard'

type ProductGridProps = {
  products: CatalogProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <section className="bg-[var(--color-surface)] p-10 shadow-warm" style={{ borderRadius: '2px' }}>
        <h2 className="font-headline text-2xl text-[var(--color-on-surface)] mb-3">
          No hemos encontrado resultados
        </h2>
        <p className="text-[var(--color-on-surface-var)]">
          Prueba con otra categoría o limpia los filtros.
        </p>
      </section>
    )
  }

  return (
    <section>
      <p className="section-label mb-6">{products.length} productos encontrados</p>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              category: product.category,
              badgeBg: product.badgeBg,
            }}
          />
        ))}
      </div>
    </section>
  )
}