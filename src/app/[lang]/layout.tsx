// src/app/[lang]/layout.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import ClientNav from '@/components/ClientNav'
import Footer from '@/components/Footer'
import { LayoutProps } from '@/types/page'
import CookieConsent from '@/components/CookieConsent'
import Analytics from '@/components/Analytics'
import { Metadata } from 'next'

export async function generateStaticParams() {
  // Folosim doar limbile pentru care avem conținut real
  return ['en', 'ro', 'am'].map((locale) => ({
    lang: locale
  }))
}

export const metadata: Metadata = {
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: 'Zero Energy Casa - Materials RSS Feed',
          url: '/api/feed/materials',
        },
        {
          title: 'Zero Energy Casa - Principles RSS Feed',
          url: '/api/feed/principles',
        },
      ],
    },
  },
}

export default async function LanguageLayout({
  children,
  params
}: LayoutProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  
  return (
    <div className="flex flex-col min-h-screen bg-[#E8E8E8]">
      <ClientNav lang={lang} menuItems={dict.home.menu} />
      <Analytics />
      <main className="flex-grow pt-24">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
      <Footer lang={lang} />
      <CookieConsent lang={lang} />
    </div>
  )
}