import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function FooterLinks() {
  const tNav = useTranslations('nav')
  const t    = useTranslations('footer')

  return (
    <div>
      <h2 className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] mb-5">
        {t('shop')}
      </h2>
      <ul className="space-y-2.5">
        {[
          { href: '/catalogo' as const, label: tNav('catalogue') },
          { href: '/historia' as const, label: tNav('history')   },
          { href: '/contacto' as const, label: t('contact')      },
        ].map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[#c9a84c]/55 hover:text-[#fff1ec] transition-colors font-body text-sm focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}