'use client'

import { CldImage } from 'next-cloudinary'

export default function HeroHistoria() {
  return (
    <section 
      className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden "
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 z-0">
        <CldImage
          src="historia/hero-tienda-granada"
          alt="Interior vintage de tienda de juegos con estanterías de madera"
          width={1920}
          height={1080}
          priority
          className="w-full h-full object-cover opacity-100 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-80" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <p className="text-[#c9a84c] font-body italic text-tertiary-container text-sm md:text-base mb-4 tracking-[0.3em] uppercase">
            Est. 1892 · Granada
          </p>
          <h1 
            id="hero-heading"
            className="text-[#c9a84c] font-headline text-5xl md:text-7xl lg:text-8xl text-tertiary-container leading-tight italic font-normal"
          >
            Nuestra Historia
          </h1>
          <div className="w-48 h-1 bg-tertiary-container mt-6" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
