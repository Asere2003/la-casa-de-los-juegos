// app/[locale]/legal/page.tsx

import { LegalPage } from '@/components/legal/LegalPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal | La Casa de los Juegos',
  description: 'Aviso legal e información sobre el titular de lacasadelosjuegos.com.',
  robots: 'noindex',
}

export default function LegalPage_() {
  return (
    <LegalPage title="Aviso Legal" lastUpdated="Enero 2025">
      <h2>1. Titular del sitio web</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios
        de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:
      </p>
      <ul>
        <li><strong>Nombre:</strong> [NOMBRE Y APELLIDOS]</li>
        <li><strong>NIF:</strong> [NIF]</li>
        <li><strong>Dirección:</strong> [DIRECCIÓN FISCAL], Granada, España</li>
        <li><strong>Email:</strong> {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</li>
        <li><strong>Web:</strong> lacasadelosjuegos.com</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        El presente Aviso Legal regula el acceso y uso del sitio web lacasadelosjuegos.com,
        titularidad del responsable indicado anteriormente. El acceso al sitio implica la
        aceptación plena de las condiciones aquí expuestas.
      </p>

      <h2>3. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio web — incluyendo textos, fotografías, gráficos,
        imágenes, iconos, tecnología, software, enlaces y demás contenidos audiovisuales
        o sonoros, así como su diseño gráfico y código fuente — son propiedad intelectual
        del titular o de terceros que han autorizado su uso, y están protegidos por la
        legislación española e internacional sobre propiedad intelectual e industrial.
      </p>
      <p>
        Queda expresamente prohibida la reproducción, distribución, comunicación pública
        y transformación de cualquier parte de los contenidos sin autorización expresa
        y por escrito del titular.
      </p>

      <h2>4. Condiciones de uso</h2>
      <p>El usuario se compromete a:</p>
      <ul>
        <li>Hacer un uso lícito del sitio web, conforme a la ley y al presente Aviso Legal.</li>
        <li>No realizar actividades que dañen, inutilicen o deterioren el sitio web.</li>
        <li>No introducir ni difundir contenidos falsos, ofensivos o que vulneren derechos de terceros.</li>
        <li>No utilizar el sitio con fines comerciales sin autorización expresa.</li>
      </ul>

      <h2>5. Exclusión de responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños y perjuicios que pudieran
        derivarse de interferencias, interrupciones, virus informáticos, averías
        telefónicas o desconexiones en el funcionamiento operativo del sistema electrónico.
      </p>
      <p>
        El titular tampoco se responsabiliza de los daños que puedan ocasionarse por
        demoras, interrupciones, errores o desconexiones en el funcionamiento de este
        sistema electrónico causados por terceros ajenos al mismo.
      </p>

      <h2>6. Enlaces a terceros</h2>
      <p>
        El sitio web puede contener enlaces a páginas de terceros. El titular no controla
        ni se responsabiliza del contenido de dichos sitios, y su inclusión no implica
        recomendación ni relación con sus titulares.
      </p>

      <h2>7. Legislación aplicable y jurisdicción</h2>
      <p>
        El presente Aviso Legal se rige en todo momento por la legislación española
        vigente. Para la resolución de cualquier controversia derivada del acceso o
        uso de este sitio web, las partes se someten a la jurisdicción de los Juzgados
        y Tribunales de Granada, sin perjuicio del fuero que pueda corresponder
        al consumidor según la normativa aplicable.
      </p>
    </LegalPage>
  )
}