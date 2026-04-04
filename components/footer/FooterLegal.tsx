import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function FooterLegal() {
  const t = useTranslations('footer')

  return (
    <div className="border-t border-[#c9a84c]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
      <p className="font-mono text-[10px] text-[#c9a84c]/30">
        {t('rights')}
      </p>
      <nav aria-label="Links legales" className="flex flex-wrap justify-center gap-5">
        {[
          { href: '/legal'        as const, label: t('legal')   },
          { href: '/privacidad'   as const, label: t('privacy') },
          { href: '/cookies'      as const, label: t('cookies') },
          { href: '/terminos'     as const, label: t('terms')   },
          { href: '/devoluciones' as const, label: t('returns') },
          { href: '/contacto'     as const, label: t('contact') },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-[10px] text-[#c9a84c]/30 hover:text-[#c9a84c]/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}