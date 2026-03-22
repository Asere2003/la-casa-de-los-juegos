import React from 'react';

/**
 * Componente reutilizable para resaltar texto en dorado.
 * Uso: <HighlightGold>Texto</HighlightGold>
 */
export default function HighlightGold({ children }: { children: React.ReactNode }) {
  return <span className="italic text-[var(--color-gold)]">{children}</span>;
}
