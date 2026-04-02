interface Props {
  rating: number
  size?: 'sm' | 'md'
}

export default function StarDisplay({ rating, size = 'md' }: Props) {
  const px = size === 'sm' ? 12 : 16

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? '#c9a84c' : 'none'}
          stroke="#c9a84c"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}