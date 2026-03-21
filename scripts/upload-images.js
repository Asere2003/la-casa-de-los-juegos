require('dotenv').config({ path: '.env.local' })
const cloudinary = require('cloudinary').v2
const fs = require('node:fs')
const path = require('node:path')

// Configurar Cloudinary desde variables de entorno
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Verificar configuración
if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
  console.error('❌ Error: Variables de entorno no configuradas')
  console.error('Asegúrate de tener en .env.local:')
  console.error('  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...')
  console.error('  CLOUDINARY_API_KEY=...')
  console.error('  CLOUDINARY_API_SECRET=...')
  process.exit(1)
}

// Directorio base de imágenes a subir
const IMAGES_DIR = './public/images'
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']

// Escanear recursivamente la carpeta y generar la lista de imágenes
function scanImages(dir, baseFolder = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let images = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      images = images.concat(scanImages(fullPath, path.join(baseFolder, entry.name)))
    } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      const nameWithoutExt = path.parse(entry.name).name
      const cloudinaryId = path.join(baseFolder, nameWithoutExt).replace(/\\/g, '/')

      images.push({
        localPath: fullPath.replace(/\\/g, '/'),
        cloudinaryId,
        description: `${nameWithoutExt} (${baseFolder || 'root'})`
      })
    }
  }

  return images
}

const images = scanImages(IMAGES_DIR)

// Cargar imágenes ya subidas del JSON para no repetir
const OUTPUT_PATH = './public/images/cloudinary-urls.json'
let alreadyUploaded = new Set()
let previousResults = []

if (fs.existsSync(OUTPUT_PATH)) {
  try {
    previousResults = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'))
    alreadyUploaded = new Set(
      previousResults
        .filter(r => r.status === 'success')
        .map(r => r.localPath)
    )
    console.log(`📋 ${alreadyUploaded.size} imágenes ya subidas (se saltarán)\n`)
  } catch {
    console.log('⚠️  No se pudo leer cloudinary-urls.json, se subirán todas\n')
  }
}

async function uploadImages() {
  console.log('🚀 Iniciando subida de imágenes a Cloudinary...\n')

  const results = [...previousResults]
  let successCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const image of images) {
    // Saltar si ya fue subida con éxito
    if (alreadyUploaded.has(image.localPath)) {
      console.log(`⏭️  Ya subida: ${image.cloudinaryId}`)
      skippedCount++
      continue
    }

    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(image.localPath)) {
        console.log(`⚠️  Archivo no encontrado: ${image.localPath}`)
        results.push({
          ...image,
          status: 'error',
          error: 'Archivo no encontrado',
          cloudinaryUrl: null,
          localFallback: image.localPath
        })
        errorCount++
        continue
      }

      console.log(`📤 Subiendo: ${image.cloudinaryId}...`)

      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(image.localPath, {
        public_id: image.cloudinaryId,
        overwrite: true,
        invalidate: true,
        resource_type: 'auto'
      })

      console.log(`   ✅ Subida exitosa`)
      console.log(`   📍 URL: ${result.secure_url}`)
      console.log(`   📊 Tamaño: ${(result.bytes / 1024).toFixed(2)} KB\n`)

      results.push({
        ...image,
        status: 'success',
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        localFallback: image.localPath
      })

      successCount++

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`)
      results.push({
        ...image,
        status: 'error',
        error: error.message,
        cloudinaryUrl: null,
        localFallback: image.localPath
      })
      errorCount++
    }
  }

  // Generar JSON con los resultados (anteriores + nuevos)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))

  console.log('─'.repeat(50))
  console.log(`📊 RESUMEN:`)
  console.log(`   ✅ Nuevas subidas: ${successCount}`)
  console.log(`   ⏭️  Saltadas: ${skippedCount}`)
  console.log(`   ❌ Errores: ${errorCount}`)
  console.log(`   📄 JSON actualizado: ${OUTPUT_PATH}`)
  console.log('─'.repeat(50))

  return results
}

// Ejecutar
uploadImages()
  .then(results => {
    console.log('\n🎉 Proceso completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
