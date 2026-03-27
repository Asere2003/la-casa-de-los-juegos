// app/[locale]/devoluciones/page.tsx

import { LegalPage } from '@/components/legal/LegalPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Devoluciones | La Casa de los Juegos',
  description: 'Cómo gestionar devoluciones y reembolsos en La Casa de los Juegos.',
}

export default function DevolucionesPage() { 
  return (
    <LegalPage title="Política de Devoluciones" lastUpdated="Enero 2025">
      <h2>1. Derecho de desistimiento</h2>
      <p>
        Conforme al Real Decreto Legislativo 1/2007, tienes derecho a desistir de tu compra
        en un plazo de <strong>14 días naturales</strong> desde la recepción del pedido,
        sin necesidad de justificación.
      </p>

      <h2>2. Cómo solicitar una devolución</h2>
      <p>Para iniciar una devolución:</p>
      <ol>
        <li>Escríbenos a <a href="mailto:info@lacasadelosjuegos.com">info@lacasadelosjuegos.com</a> indicando tu número de pedido y el motivo.</li>
        <li>Te confirmaremos la devolución en un plazo máximo de 48 horas.</li>
        <li>Envía el producto en su embalaje original al domicilio que te indicaremos.</li>
        <li>Una vez recibido y verificado el producto, procesaremos el reembolso.</li>
      </ol>

      <h2>3. Condiciones del producto devuelto</h2>
      <ul>
        <li>El producto debe estar en perfecto estado, sin usar y con su embalaje original.</li>
        <li>Debe incluir todos los componentes, manuales y accesorios originales.</li>
        <li>No se aceptan devoluciones de productos abiertos salvo defecto de fábrica.</li>
      </ul>

      <h2>4. Gastos de devolución</h2>
      <ul>
        <li><strong>Producto defectuoso o error nuestro:</strong> los gastos de devolución corren a nuestro cargo.</li>
        <li><strong>Desistimiento por cambio de opinión:</strong> los gastos de envío de devolución corren a cargo del cliente.</li>
      </ul>

      <h2>5. Reembolso</h2>
      <p>
        Una vez recibido y verificado el producto devuelto, procesaremos el reembolso
        en un plazo máximo de <strong>14 días</strong> mediante el mismo método de pago
        utilizado en la compra.
      </p>
      <p>
        Si el pedido incluía gastos de envío, estos solo se reembolsarán si la devolución
        es por defecto del producto o error nuestro.
      </p>

      <h2>6. Productos defectuosos o dañados</h2>
      <p>
        Si recibes un producto defectuoso o dañado durante el transporte, contáctanos
        en las primeras <strong>48 horas</strong> tras la recepción enviando fotos del
        daño a <a href="mailto:info@lacasadelosjuegos.com">info@lacasadelosjuegos.com</a>.
        Gestionaremos el cambio o reembolso sin coste alguno para ti.
      </p>

      <h2>7. Excepciones</h2>
      <p>No se admiten devoluciones en los siguientes casos:</p>
      <ul>
        <li>Productos personalizados o hechos a medida.</li>
        <li>Productos que por su naturaleza no puedan ser devueltos.</li>
        <li>Productos con precinto de higiene roto.</li>
      </ul>
    </LegalPage>
  )
}