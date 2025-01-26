// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { i18n } from '@/lib/i18n-config'
import ClientNav from '@/components/ClientNav'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Passive House Guide',
  description: 'Your guide to building passive houses',
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

const menuItems = {
  principles: 'Principles',
  materials: 'Materials',
  calculator: 'Calculator',
  case_studies: 'Case Studies',
  contact: 'Contact'
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <head>
        <Analytics />
      </head>
      <body className={inter.className}>
        <ClientNav lang={params.lang} menuItems={menuItems} />
        {children}
        <CookieConsent lang={params.lang} />
      </body>
    </html>
  )
}