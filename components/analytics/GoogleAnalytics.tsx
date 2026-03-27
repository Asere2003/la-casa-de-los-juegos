'use client'

import { useEffect, useState } from 'react'

import Script from 'next/script'

const GA_ID = 'G-JNBLGT2K6N'

export function GoogleAnalytics() {
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    // Comprueba el consentimiento inicial
    const stored = localStorage.getItem('cookie_consent')
    if (stored === 'accepted') setConsent(true)

    // Escucha si el usuario acepta desde el banner
    const handler = () => setConsent(true)
    window.addEventListener('cookie_consent_accepted', handler)
    return () => window.removeEventListener('cookie_consent_accepted', handler)
  }, [])

  if (!consent) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}