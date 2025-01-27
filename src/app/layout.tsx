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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  }
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

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  return (
    <html lang={params.lang}>
      <head>
        <Analytics />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent lang={params.lang} />
      </body>
    </html>
  )
}