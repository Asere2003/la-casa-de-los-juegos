import Link from 'next/link'

export const metadata = {
  title: 'Verifica tu email — La Casa de los Juegos',
}

export default function VerificarEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return (
    <main className="min-h-screen bg-[#fff8f6] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">

        {/* Icono */}
        <div
          className="w-16 h-16 bg-[#1a5c2a]/10 flex items-center justify-center mx-auto mb-6"
          style={{ borderRadius: '2px' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#1a5c2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        {/* Texto */}
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#805533]">
          Casi listo
        </span>
        <span className="block w-10 h-0.5 bg-[#c9a84c] mt-2 mb-4 mx-auto" />

        <h1
          className="text-2xl text-[#2a170f] mb-4"
          style={{ fontFamily: 'Noto Serif, serif' }}
        >
          Revisa tu email
        </h1>

        <p
          className="text-sm text-[#717a6f] leading-relaxed mb-2"
          style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
        >
          Te hemos enviado un enlace de confirmación
          {searchParams.email ? (
            <> a <strong className="text-[#2a170f] not-italic">{searchParams.email}</strong></>
          ) : (
            ' a tu email'
          )}.
        </p>

        <p
          className="text-sm text-[#717a6f] leading-relaxed mb-8"
          style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}
        >
          Haz clic en el enlace para activar tu cuenta y empezar a jugar.
        </p>

        {/* Aviso spam */}
        <div
          className="bg-[#fff1ec] border border-[#c0c9bc]/40 px-5 py-4 mb-8 text-left"
          style={{ borderRadius: '2px' }}
        >
          <p className="text-xs text-[#717a6f]" style={{ fontFamily: 'Newsreader, serif' }}>
            💡 Si no ves el email, revisa la carpeta de <strong>spam</strong> o correo no deseado.
          </p>
        </div>

        <Link href="/" className="btn-outline inline-flex">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  )
}