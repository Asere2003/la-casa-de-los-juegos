// app/[locale]/cookies/page.tsx

import { LegalPage } from '@/components/legal/LegalPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | La Casa de los Juegos',
  description: 'Información sobre el uso de cookies en La Casa de los Juegos.',
  robots: 'noindex',
}

export default function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies" lastUpdated="Enero 2025">
      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
        dispositivo cuando los visitas. Permiten que el sitio recuerde tus preferencias
        y mejore tu experiencia de navegación.
      </p>

      <h2>2. Cookies que utilizamos</h2>

      <h3>Cookies estrictamente necesarias</h3>
      <p>
        Son imprescindibles para el funcionamiento del sitio. Sin ellas no podrías
        navegar ni usar el carrito de compra. No requieren tu consentimiento.
      </p>
      <ul>
        <li><strong>Sesión de usuario</strong> — mantiene tu sesión iniciada.</li>
        <li><strong>Carrito de compra</strong> — recuerda los productos añadidos.</li>
        <li><strong>Preferencia de idioma</strong> — guarda el idioma seleccionado.</li>
        <li><strong>cookie_consent</strong> — recuerda tu decisión sobre cookies.</li>
      </ul>

      <h3>Cookies analíticas (solo con tu consentimiento)</h3>
      <p>
        Usamos Google Analytics para entender cómo se usa el sitio y mejorarlo.
        Solo se activan si aceptas las cookies analíticas en el banner.
      </p>
      <ul>
        <li><strong>_ga, _ga_*</strong> — Google Analytics. Duración: 2 años.</li>
        <li><strong>_gid</strong> — Google Analytics. Duración: 24 horas.</li>
      </ul>
      <p>
        Google Analytics está configurado con anonimización de IP. Los datos se
        procesan en servidores de Google (EEUU) bajo cláusulas contractuales estándar.
        Puedes optar por no participar instalando el{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          complemento de inhabilitación de Google Analytics
        </a>.
      </p>

      <h2>3. Cómo gestionar tus preferencias</h2>
      <p>Tienes varias opciones para controlar las cookies:</p>
      <ul>
        <li>
          <strong>Banner de cookies:</strong> al visitar el sitio por primera vez puedes
          aceptar solo las necesarias o todas. Puedes cambiar tu decisión en cualquier
          momento borrando las cookies de tu navegador.
        </li>
        <li>
          <strong>Configuración del navegador:</strong> puedes bloquear o eliminar cookies
          desde la configuración de tu navegador. Ten en cuenta que esto puede afectar
          al funcionamiento del sitio.
        </li>
      </ul>
      <p>Instrucciones para los navegadores más comunes:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2>4. Actualizaciones de esta política</h2>
      <p>
        Podemos actualizar esta política cuando cambiemos las cookies que utilizamos.
        Te informaremos de cambios significativos a través del banner de cookies.
      </p>

      <h2>5. Contacto</h2>
      <p>
        Para cualquier consulta sobre el uso de cookies escríbenos a{' '}
        <a href="mailto:info@lacasadelosjuegos.com">info@lacasadelosjuegos.com</a>.
      </p>
    </LegalPage>
  )
}