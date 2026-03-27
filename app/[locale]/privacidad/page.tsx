// app/[locale]/privacidad/page.tsx

import { LegalPage } from '@/components/legal/LegalPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | La Casa de los Juegos',
  description: 'Información sobre el tratamiento de tus datos personales.',
  robots: 'noindex',
}

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" lastUpdated="Enero 2025">
      <h2>1. Responsable del tratamiento</h2>
      <p>
        En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD),
        te informamos que el responsable del tratamiento de tus datos es:
      </p>
      <ul>
        <li><strong>Nombre:</strong> [NOMBRE Y APELLIDOS]</li>
        <li><strong>NIF:</strong> [NIF]</li>
        <li><strong>Dirección:</strong> [DIRECCIÓN FISCAL], Granada, España</li>
        <li><strong>Email:</strong> info@lacasadelosjuegos.com</li>
        <li><strong>Web:</strong> lacasadelosjuegos.com</li>
      </ul>

      <h2>2. Datos que recopilamos</h2>
      <p>Recopilamos los siguientes datos personales:</p>
      <ul>
        <li><strong>Registro:</strong> nombre, correo electrónico y contraseña.</li>
        <li><strong>Pedidos:</strong> nombre, dirección de envío, correo y datos de pago (procesados por Stripe, nunca almacenamos datos de tarjeta).</li>
        <li><strong>Navegación:</strong> cookies técnicas y, con tu consentimiento, cookies analíticas (Google Analytics).</li>
      </ul>

      <h2>3. Finalidad y base jurídica</h2>
      <ul>
        <li><strong>Gestionar tu cuenta y pedidos</strong> — ejecución del contrato (art. 6.1.b RGPD).</li>
        <li><strong>Enviarte emails transaccionales</strong> (confirmación de pedido, recuperar contraseña) — ejecución del contrato.</li>
        <li><strong>Analítica web</strong> — interés legítimo / consentimiento.</li>
        <li><strong>Cumplimiento fiscal y legal</strong> — obligación legal (art. 6.1.c RGPD).</li>
      </ul>

      <h2>4. Conservación de datos</h2>
      <p>
        Conservamos tus datos mientras mantengas una cuenta activa o mientras sea necesario
        para cumplir obligaciones legales (mínimo 5 años para datos fiscales según la Ley General Tributaria).
      </p>

      <h2>5. Destinatarios</h2>
      <p>Compartimos datos únicamente con los proveedores necesarios para prestar el servicio:</p>
      <ul>
        <li><strong>Stripe</strong> — procesamiento de pagos (EEUU, cláusulas contractuales estándar).</li>
        <li><strong>Supabase</strong> — base de datos (UE).</li>
        <li><strong>Resend</strong> — envío de emails transaccionales.</li>
        <li><strong>Cloudinary</strong> — almacenamiento de imágenes.</li>
        <li><strong>Google Analytics</strong> — analítica web (con tu consentimiento).</li>
      </ul>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento los derechos de acceso, rectificación, supresión,
        oposición, limitación y portabilidad escribiendo a{' '}
        <a href="mailto:info@lacasadelosjuegos.com">info@lacasadelosjuegos.com</a>.
        También tienes derecho a reclamar ante la{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agencia Española de Protección de Datos (AEPD)
        </a>.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas para proteger tus datos: conexiones cifradas (HTTPS),
        contraseñas hasheadas y acceso restringido a datos personales.
      </p>
    </LegalPage>
  )
}