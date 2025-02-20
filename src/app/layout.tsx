// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { i18n } from '@/lib/i18n-config'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'
import { Metadata } from 'next'
import { LayoutProps } from '@/types/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Passive House Guide',
  description: 'Your guide to building passive houses',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png' }]
  },
  manifest: '/manifest.json'
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params
  
  return (
    <html lang={lang}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* RSS Feeds */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Passive House Guide - Materials RSS Feed"
          href="/api/feed/materials/rss"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Passive House Guide - Materials Atom Feed"
          href="/api/feed/materials/atom"
        />
        <link
          rel="alternate"
          type="application/json"
          title="Passive House Guide - Materials JSON Feed"
          href="/api/feed/materials/json"
        />
        
        {/* Principles Feeds */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Passive House Guide - Principles RSS Feed"
          href="/api/feed/principles/rss"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Passive House Guide - Principles Atom Feed"
          href="/api/feed/principles/atom"
        />
        <link
          rel="alternate"
          type="application/json"
          title="Passive House Guide - Principles JSON Feed"
          href="/api/feed/principles/json"
        />
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4195148067095287"
          crossOrigin="anonymous"
        ></script>
        
        <Analytics />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent lang={lang} />
      </body>
    </html>
  )
}