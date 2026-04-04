import { Link } from '@/i18n/navigation'
import Logo from '@/components/Logo'
import { getTranslations } from 'next-intl/server'

export default async function FooterBrand() {
    const t = await getTranslations('footer')

    return (
        <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-5 hover:opacity-80 transition-opacity">
                <Logo
                    src="/images/icons/logo_new_sn.svg"
                    width={64}
                    height={64}
                    ariaLabel="La Casa de los Juegos"
                />
            </Link>

            <p className="font-body text-sm leading-relaxed text-[#c9a84c]/55 max-w-xs mb-6">
                {t('description')}
            </p>

            <ul className="space-y-3 mb-6">
                <li>
                    <a
                        href="tel:+34667385091"
                        className="flex items-center gap-2 text-[#c9a84c]/55 hover:text-[#c9a84c] transition-colors text-sm font-body group"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                            className="flex-shrink-0" aria-hidden="true">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                        </svg>
                        +34 667 385 091
                    </a>
                </li>
                <li>
                    <a
                        href="mailto:hola@lacasadelosjuegos.com"
                        className="flex items-center gap-2 text-[#c9a84c]/55 hover:text-[#c9a84c] transition-colors text-sm font-body"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                            className="flex-shrink-0" aria-hidden="true">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        info@lacasadelosjuegos.com
                    </a>
                </li>
                <li>
                    <a
                        href="https://instagram.com/la_casadelosjuegos"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex items-center gap-2 text-[#c9a84c]/55 hover:text-[#c9a84c] transition-colors text-sm font-body"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        @la_casadelosjuegos
                    </a>
                </li>
            </ul>

        </div>
    )
}