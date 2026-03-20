import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  centered?: boolean
  action?: ReactNode
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  centered = false,
  action,
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={[
        'flex gap-6 mb-10 md:mb-12',
        centered ? 'flex-col items-center text-center' : 'items-end justify-between',
        className,
      ].join(' ')}
    >
      <div>
        {eyebrow ? <p className="section-label mb-2">{eyebrow}</p> : null}
        <h2 className="font-headline text-4xl md:text-5xl text-[var(--color-on-surface)]">
          {title}
        </h2>
        <span className={centered ? 'gold-rule mx-auto' : 'gold-rule'} aria-hidden="true" />
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}