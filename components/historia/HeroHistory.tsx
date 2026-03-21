'use client'

import { CldImage } from 'next-cloudinary'

export default function HeroHistory() {
  return (
    <section 
      className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 z-0">
        <CldImage
          src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937"
          alt="Interior vintage de tienda de juegos con estanterías de madera"
          width={1920}
          height={1080}
          priority
          className="w-full h-full object-cover opacity-60 mix-blend-multiply"
          deliveryType="fetch"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-primary-fixed to-transparent opacity-80" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <p className="font-body italic text-tertiary-fixed text-lg md:text-xl mb-4 tracking-widest uppercase">
            Est. 1892 · Granada
          </p>
          <h1 
            id="hero-heading"
            className="font-headline text-5xl md:text-7xl lg:text-8xl text-surface leading-tight italic"
          >
            Nuestra Historia
          </h1>
          <div className="w-48 h-1 bg-tertiary-container mt-6" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
