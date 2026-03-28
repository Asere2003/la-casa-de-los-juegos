// app/[locale]/terminos/page.tsx

import { LegalPage } from '@/components/legal/LegalPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | La Casa de los Juegos',
  description: 'Condiciones generales de venta de La Casa de los Juegos.',
  robots: 'noindex',
}

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y Condiciones" lastUpdated="Enero 2025">
      <h2>1. Identificación del vendedor</h2>
      <ul>
        <li><strong>Nombre:</strong> [NOMBRE Y APELLIDOS]</li>
        <li><strong>NIF:</strong> [NIF]</li>
        <li><strong>Dirección:</strong> [DIRECCIÓN FISCAL], Granada, España</li>
        <li><strong>Email:</strong> {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Estas condiciones regulan la relación contractual entre el vendedor y el cliente
        derivada de la compra de productos a través de lacasadelosjuegos.com,
        conforme a la Ley 34/2002 (LSSI-CE) y el Real Decreto Legislativo 1/2007 (LGDCU).
      </p>

      <h2>3. Proceso de compra</h2>
      <p>
        El cliente selecciona los productos, accede al carrito y completa el pago
        a través de Stripe. Una vez confirmado el pago, recibirá un email de confirmación.
        El contrato se perfecciona en el momento de dicha confirmación.
      </p>

      <h2>4. Precios y pagos</h2>
      <ul>
        <li>Todos los precios incluyen IVA aplicable.</li>
        <li>El pago se realiza mediante tarjeta bancaria a través de Stripe (entorno seguro PCI-DSS).</li>
        <li>No almacenamos datos de tarjeta en ningún momento.</li>
      </ul>

      <h2>5. Envíos</h2>
      <ul>
        <li>Realizamos envíos a España peninsular, Baleares, Canarias, Ceuta y Melilla, y a la Unión Europea.</li>
        <li>El plazo de entrega estimado es de <strong>3 a 7 días hábiles</strong> para España peninsular.</li>
        <li>Los gastos de envío se calculan y muestran antes de confirmar el pedido.</li>
      </ul>

      <h2>6. Disponibilidad y stock</h2>
      <p>
        El stock se actualiza en tiempo real. En el improbable caso de que un producto
        no esté disponible tras confirmar el pedido, contactaremos al cliente para
        ofrecer un reembolso completo o producto alternativo.
      </p>

      <h2>7. Devoluciones</h2>
      <p>
        Consulta nuestra{' '}
        <a href="/devoluciones">Política de Devoluciones</a>{' '}
        para información detallada.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Los contenidos de lacasadelosjuegos.com (textos, imágenes, diseño, código) son
        propiedad del titular o se usan con licencia. Queda prohibida su reproducción
        sin autorización expresa.
      </p>

      <h2>9. Legislación aplicable</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier controversia,
        las partes se someten a los juzgados y tribunales de Granada, sin perjuicio
        del fuero que pueda corresponder al consumidor según la LGDCU.
      </p>
    </LegalPage>
  )
}