'use client'

import { useState } from 'react'

interface Props {
  description?: string
}

export default function ProductDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (!description) return null

  const paragraphs = description.split('\n').filter(Boolean)
  const isLong     = paragraphs.length > 2

  return (
    <div className="border-t border-[#c0c9bc]/20 pt-5">
      <h2 className="font-headline italic text-lg text-[#2a170f] mb-3">Descripción</h2>

      <div
        className={`relative overflow-hidden transition-all duration-500 ${
          !expanded && isLong ? 'max-h-24' : 'max-h-[600px]'
        }`}
      >
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-body text-base text-[#40493f] leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Fade out si está colapsado */}
        {!expanded && isLong && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#fff8f6] to-transparent pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 font-body italic text-sm text-[#004317] hover:text-[#1a5c2a] transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
        >
          {expanded ? 'Ver menos' : 'Leer más'}
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      )}
    </div>
  )
}
