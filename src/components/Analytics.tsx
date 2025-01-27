// src/components/Analytics.tsx
'use client'

import Script from 'next/script'

export default function Analytics() {
  // Google Analytics Measurement ID
  const GA_MEASUREMENT_ID = 'G-5CJ5S8N1BD'
  
  // Verificăm dacă suntem în producție
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  
  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4195148067095287"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  )
}
