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
        <Analytics />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent lang={lang} />
      </body>
    </html>
  )
}