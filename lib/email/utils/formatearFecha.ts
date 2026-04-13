// lib/emails/utils/formatearFecha.ts
// Utilidad compartida para formatear fechas en hora española en todos los emails

/**
 * Formatea una fecha en hora española (Europe/Madrid)
 * Usar en TODOS los emails para evitar que el cliente de correo muestre UTC
 */
export function formatearFechaES(date: Date = new Date()): string {
  return date.toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Versión corta: "13 de abril de 2026, 17:32"
 */
export function formatearFechaESCorta(date: Date = new Date()): string {
  return date.toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Solo fecha sin hora: "13 de abril de 2026"
 */
export function formatearSoloFechaES(date: Date = new Date()): string {
  return date.toLocaleDateString('es-ES', {
    timeZone: 'Europe/Madrid',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}