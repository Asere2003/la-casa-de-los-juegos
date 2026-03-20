interface Props {
  variant?: 'full' | 'icon' | 'text'
  className?: string
  goldColor?: string
  greenColor?: string
}

export default function Logo({
  variant = 'full',
  className = '',
  goldColor = '#c9a84c',
  greenColor = '#1a5c2a',
}: Props) {

  // Solo el icono — para favicon, loader, etc.
  if (variant === 'icon') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width="40"
        height="40"
        className={className}
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="6" fill={greenColor}/>
        <g transform="translate(10, 5)">
          <rect x="0" y="26" width="20" height="4" rx="2" fill={goldColor}/>
          <rect x="3" y="14" width="14" height="13" rx="2" fill={goldColor}/>
          <rect x="5" y="10" width="10" height="5" rx="1" fill={goldColor}/>
          <rect x="3" y="3" width="14" height="9" rx="3" fill={goldColor}/>
          <rect x="9" y="1" width="3" height="12" rx="1" fill={goldColor}/>
          <rect x="6" y="4" width="9" height="3" rx="1" fill={goldColor}/>
        </g>
      </svg>
    )
  }

  // Solo texto — para footer, etc.
  if (variant === 'text') {
    return (
      <span
        className={`font-headline italic font-bold tracking-tight ${className}`}
        style={{ color: goldColor }}
      >
        La Casa de los Juegos
      </span>
    )
  }

  // Versión completa — icono + texto
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 52"
      height="52"
      className={className}
      role="img"
      aria-label="La Casa de los Juegos"
    >
      {/* <!-- Icono --> */}
      <rect width="52" height="52" rx="4" fill={greenColor}/>
      <g transform="translate(10, 7)">
        <rect x="0" y="26" width="32" height="5" rx="2" fill={goldColor}/>
        <rect x="5" y="14" width="22" height="13" rx="2" fill={goldColor}/>
        <rect x="9" y="10" width="14" height="6" rx="1" fill={goldColor}/>
        <rect x="7" y="3" width="18" height="9" rx="3" fill={goldColor}/>
        <rect x="14" y="1" width="4" height="14" rx="1" fill={goldColor}/>
        <rect x="10" y="4" width="12" height="4" rx="1" fill={goldColor}/>
      </g>

      {/* <!-- Texto --> */}
      <text
        x="64"
        y="26"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="20"
        fontStyle="italic"
        fontWeight="700"
        fill={goldColor}
        letterSpacing="-0.3"
      >
        La Casa de los Juegos
      </text>
      <line x1="64" y1="34" x2="272" y2="34" stroke={goldColor} strokeWidth="0.8" strokeOpacity="0.4"/>
      <text
        x="64"
        y="46"
        fontFamily="monospace"
        fontSize="7"
        fill={goldColor}
        fillOpacity="0.55"
        letterSpacing="3"
      >
        GRANADA · EST. 2026
      </text>
    </svg>
  )
}
