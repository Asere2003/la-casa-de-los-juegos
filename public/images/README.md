# 📸 Sistema de Gestión de Imágenes

Este proyecto usa **backup local + Cloudinary CDN** para optimizar imágenes.

## 📁 Estructura de carpetas

```
public/
└── images/
    ├── historia/               ← Imágenes de la página Historia
    │   ├── .gitkeep           ← Mantiene carpeta en Git
    │   ├── hero-tienda-granada.png
    │   ├── taller-1924.jpg
    │   └── ...
    ├── productos/             ← Imágenes de productos (futuro)
    ├── .gitignore             ← Ignora imágenes grandes
    └── cloudinary-urls.json   ← URLs de Cloudinary (SÍ en Git)
```

## 🚀 Cómo usar

### 1️⃣ Añadir imágenes localmente

Guarda tus imágenes en `public/images/historia/` con estos nombres:

- `hero-tienda-granada.png` - Hero principal
- `taller-1924.jpg` - Taller artesanal
- `don-aurelio-2023.jpg` - Don Aurelio
- `coleccion-clasicos-1985.jpg` - Colección de clásicos
- `ajedrez-artesanal.jpg` - Ajedrez
- `puzzles-arte.jpg` - Puzzles

### 2️⃣ Subir a Cloudinary automáticamente

```bash
# Instalar dependencias (solo primera vez)
npm install cloudinary

# Ejecutar script de subida
node scripts/upload-images.js
```

### 3️⃣ Ver resultados

El script genera `public/images/cloudinary-urls.json`:

```json
[
  {
    "localPath": "./public/images/historia/hero-tienda-granada.png",
    "cloudinaryId": "historia/hero-tienda-granada",
    "status": "success",
    "cloudinaryUrl": "https://res.cloudinary.com/tu-cloud/...",
    "width": 1920,
    "height": 1080,
    "format": "png",
    "bytes": 2458392,
    "localFallback": "./public/images/historia/hero-tienda-granada.png"
  }
]
```

## 🔄 Fallback automático

Si Cloudinary falla, el código usa automáticamente las imágenes locales:

```tsx
// Intenta Cloudinary primero
<CldImage src="historia/hero-tienda-granada" />

// Si falla, cae a local
<Image src="/images/historia/hero-tienda-granada.png" />
```

## ⚙️ Variables de entorno necesarias

Asegúrate de tener en tu `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📊 Ventajas de este sistema

✅ **Backup local** - Las imágenes están en tu proyecto
✅ **CDN global** - Cloudinary las sirve rápido
✅ **Optimización automática** - WebP, AVIF, resize
✅ **Fallback** - Si Cloudinary falla, usa local
✅ **Versionado** - El JSON se guarda en Git
✅ **Un solo comando** - `node scripts/upload-images.js`

## 🔧 Troubleshooting

**Error: "Archivo no encontrado"**
→ Verifica que la imagen existe en `public/images/historia/`

**Error: "Invalid cloud_name"**
→ Revisa tus variables de entorno en `.env.local`

**Error: "Unauthorized"**
→ Verifica tu `CLOUDINARY_API_SECRET`

## 📝 Añadir nuevas imágenes

1. Guarda la imagen en `public/images/[categoria]/`
2. Edita `scripts/upload-images.js` y añade:

```js
{
  localPath: './public/images/categoria/nueva-imagen.jpg',
  cloudinaryId: 'categoria/nueva-imagen',
  description: 'Descripción de la imagen'
}
```

3. Ejecuta: `node scripts/upload-images.js`

¡Listo! 🎉
