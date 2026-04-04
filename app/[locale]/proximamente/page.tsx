import { Metadata } from 'next'
import ProximamenteForm from '@/components/proximamente/ProximamenteForm'
import Logo from '@/components/Logo'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Próximamente — La Casa de los Juegos',
  description: 'Sé el primero en enterarte de todo lo que está por venir en La Casa de los Juegos.',
}

export default async function ProximamentePage() {
  const t = await getTranslations('proximamente')

  return (
    <main className="min-h-screen bg-[#2c1810] flex items-center justify-center px-6 py-16 relative overflow-hidden">

      {/* Textura fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }}
      />

      {/* Decoración dorada */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />

      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo
            src="/images/icons/logo_new_sn.svg"
            width={100}
            height={100}
            ariaLabel="La Casa de los Juegos"
          />
        </div>

        {/* Nombre */}
        <h1
          className="text-3xl md:text-4xl text-[#c9a84c] mb-2"
          style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic' }}
        >
          La Casa de los Juegos
        </h1>

        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#c9a84c]/40 mb-10">
          {t('label')}
        </p>

        {/* Separador */}
        <div className="w-12 h-px bg-[#c9a84c]/40 mx-auto mb-10" />

        {/* Mensaje */}
        <p
          className="text-[#fff1ec]/70 text-base leading-relaxed mb-2"
          style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
        >
          {t('message')}
        </p>
        <p
          className="text-[#fff1ec]/50 text-sm leading-relaxed mb-10"
          style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
        >
          {t('desc')}
        </p>

        {/* Formulario */}
        <ProximamenteForm />

        {/* Separador */}
        <div className="w-12 h-px bg-[#c9a84c]/20 mx-auto mt-12 mb-6" />

        {/* Links */}
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://lacasadelosjuegos.com"
            className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c]/30 hover:text-[#c9a84c]/60 transition-colors"
          >
            lacasadelosjuegos.com
          </a>
          <span className="text-[#c9a84c]/20">·</span>
          <a
            href="mailto:hola@lacasadelosjuegos.com"
            className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c]/30 hover:text-[#c9a84c]/60 transition-colors"
          >
            {t('contact_link')}
          </a>
        </div>

      </div>
    </main>
  )
}