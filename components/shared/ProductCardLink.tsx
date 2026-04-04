'use client'

import { useProductDrawerStore } from '@/store/productDrawerStore'

interface Props {
  href: string
  slug: string
  className?: string
  children: React.ReactNode
  ariaLabel?: string
}

/**
 * Wraps a product link to intercept regular clicks and open the product drawer
 * instead of navigating. Ctrl/Cmd/middle-click still opens the page normally.
 */
export function ProductCardLink({ href, slug, className, children, ariaLabel }: Props) {
  const openProduct = useProductDrawerStore(s => s.openProduct)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modifier keys and non-left-clicks open in new tab / do default
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    openProduct(slug)
  }

  return (
    <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
