## Modo de trabajo autónomo

Antes de empezar:
1. Ejecuta `find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next` para listar todos los archivos
2. Lee `messages/es.json`, `messages/en.json` y `messages/cat.json` completos para conocer las claves existentes
3. Procesa cada archivo uno por uno en este orden:
   - app/[locale]/**/page.tsx
   - components/**/*.tsx
   - app/[locale]/**/layout.tsx
4. Por cada archivo: analiza → traduce → modifica → verifica → siguiente
5. Al terminar cada archivo actualiza los 3 JSON inmediatamente
6. Genera I18N-REPORT.md con cada archivo procesado y claves añadidas

## Restricción crítica
NO pares a pedir confirmación entre archivos.
NO esperes input del usuario.
Si tienes dudas sobre una clave, elige la opción más semántica y continúa.
Termina solo cuando hayas procesado todos los archivos encontrados.

Actúa como un desarrollador senior experto en **Next.js, App Router, TypeScript, i18n y refactorización de código**.

Tu tarea es trabajar **únicamente sobre los archivos que tengas en el contexto actual** y hacer una migración completa de textos hardcodeados a sistema de traducciones.

## Objetivo

Quiero que analices el código disponible en contexto y hagas lo siguiente:

### 1. Detectar textos hardcodeados

Busca todos los textos visibles para el usuario que estén escritos directamente en el código, por ejemplo:

* títulos
* subtítulos
* labels
* placeholders
* botones
* mensajes de error
* mensajes de éxito
* textos informativos
* textos de formularios
* textos de estado
* textos de navegación
* textos SEO visibles si aplica

No incluyas:

* nombres de variables
* nombres internos de funciones
* claves de configuración
* logs internos de desarrollo que no vea el usuario
* identificadores técnicos
* datos dinámicos que deban seguir siendo dinámicos

### 2. Sistema de traducciones a usar

Ten en cuenta que los archivos JSON de traducción están en esta ruta:

* `messages/en.json`
* `messages/es.json`
* `messages/cat.json`

## Uso obligatorio de i18n en este proyecto

No necesitas analizar otros componentes ni buscar ejemplos en otros archivos del proyecto.

Usa siempre este patrón como fuente de verdad:

### En componentes cliente

```ts
const t = useTranslations("namespace");
```

Uso:

```ts
t("clave")
```

### En componentes servidor

```ts
const t = await getTranslations("namespace");
```

### Reglas obligatorias

* NO busques ejemplos en otros archivos
* NO intentes inferir patrones desde otros componentes
* NO recorras el proyecto para comprobar cómo se usa i18n
* NO cambies el sistema existente
* USA directamente este patrón
* Asume que este documento define la forma correcta de usar i18n en este proyecto

### Namespaces

Si necesitas un namespace:

* usa el nombre del componente o sección cuando tenga sentido
* ejemplos: `cart`, `checkout`, `product`, `order`, `navbar`, `footer`

Debes respetar este patrón directamente.
No inventes una arquitectura nueva.

### 3. Crear las claves de traducción necesarias

Por cada texto hardcodeado que detectes:

* crea una clave semántica, clara y mantenible
* usa nombres consistentes con la estructura ya definida
* agrupa las claves por secciones o componentes si tiene sentido
* evita claves ambiguas como `text1`, `label2`, `title3`

Ejemplo de estilo deseado:

* `checkout.title`
* `checkout.submitButton`
* `cart.empty`
* `product.addToCart`
* `order.successMessage`

### 4. Añadir las traducciones en los JSON correspondientes

Añade cada clave nueva en:

* `messages/en.json`
* `messages/es.json`
* `messages/cat.json`

Reglas:

* inglés natural en `en.json`
* español natural en `es.json`
* catalán natural en `cat.json`
* mantén consistencia de tono y terminología
* no dejes claves incompletas
* no dejes una clave en un idioma y faltando en otro
* no sobrescribas traducciones ya correctas salvo que sea necesario para mantener consistencia

### 5. Reemplazar los textos hardcodeados en el código

Modifica el código para sustituir cada string hardcodeado por su llamada de traducción correspondiente, usando el mecanismo i18n definido arriba.

Hazlo respetando el contexto del archivo:

* si es componente cliente, usa el patrón correcto para cliente
* si es componente servidor, usa el patrón correcto para servidor
* si es metadata o contenido especial, usa el patrón correcto según el proyecto
* conserva toda la lógica existente que no esté relacionada con i18n

### 6. Mantener interpolaciones y textos dinámicos correctamente

Si un texto contiene variables dinámicas, conviértelo correctamente a traducción con interpolación.

Ejemplo:

* `"Hola ${user.name}"` → usar traducción con variable
* `"Tienes 3 productos"` → preparar clave adecuada si el proyecto soporta pluralización o interpolación

No rompas la lógica dinámica del código.

### 7. Revisar imports y dependencias

Después de refactorizar:

* añade imports necesarios
* elimina imports que hayan quedado sin usar
* evita código muerto
* evita duplicaciones

### 8. Validar consistencia

Antes de terminar:

* comprueba que todas las claves usadas en código existan en los 3 JSON
* comprueba que no hayas dejado strings hardcodeados visibles para el usuario en los archivos revisados
* comprueba que no hayas roto el tipado si el proyecto usa TypeScript
* comprueba que no haya errores de sintaxis
* comprueba que no haya imports incorrectos

### 9. Probar y corregir errores

Al terminar los cambios:

* revisa si hay fallos de compilación, lint o tipado en los archivos modificados
* si detectas errores, corrígelos
* no te limites a señalar los errores: arréglalos
* asegúrate de que el resultado final quede funcional

### 10. Restricciones importantes

* Trabaja solo con los archivos presentes en el contexto actual
* No modifiques partes no relacionadas innecesariamente
* No cambies la lógica de negocio salvo que sea imprescindible para integrar traducciones
* No elimines traducciones existentes válidas
* No inventes textos que contradigan el comportamiento real del componente
* Mantén el estilo y arquitectura del proyecto

## Forma de trabajar

Quiero que lo hagas en este orden, uno por uno:

1. Analiza el archivo o archivos del contexto
2. Lista brevemente los textos hardcodeados detectados
3. Propón las claves de traducción
4. Añade las entradas necesarias en `en.json`, `es.json` y `cat.json`
5. Refactoriza el código para usar las traducciones
6. Revisa errores
7. Corrige cualquier fallo encontrado
8. Devuelve el resultado final ya corregido

## Formato de respuesta

Quiero que respondas de forma estructurada:

### A. Análisis

* qué textos hardcodeados encontraste
* en qué archivo están
* qué estrategia de claves vas a usar

### B. Cambios en traducciones

Muestra exactamente qué añadirías en:

* `messages/en.json`
* `messages/es.json`
* `messages/cat.json`

### C. Cambios en el código

Muestra el archivo actualizado completo, o los bloques exactos modificados, según convenga.

### D. Verificación final

Indica:

* si detectaste errores
* cuáles eran
* cómo los corregiste
* si queda algún posible punto a revisar

## Prioridad

Prioriza:

1. exactitud
2. consistencia con el proyecto
3. cero errores
4. traducciones naturales
5. mantener el código limpio

Si en algún caso una traducción o una clave puede resolverse de más de una forma, elige la opción más mantenible y consistente con la estructura ya definida en este documento.
