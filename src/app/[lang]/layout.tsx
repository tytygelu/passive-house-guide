// src/app/[lang]/layout.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import ClientNav from '@/components/ClientNav'
import Footer from '@/components/Footer'
import { LayoutProps } from '@/types/page'
import CookieConsent from '@/components/CookieConsent'
import Analytics from '@/components/Analytics'

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ro' },
    { lang: 'de' },
    { lang: 'fr' },
    { lang: 'it' },
    { lang: 'es' },
    { lang: 'nl' },
    { lang: 'pl' },
    { lang: 'sv' },
    { lang: 'no' },
    { lang: 'da' },
    { lang: 'fi' },
    { lang: 'pt' },
    { lang: 'cs' },
    { lang: 'sk' },
    { lang: 'hu' },
    { lang: 'el' },
    { lang: 'bg' },
    { lang: 'hr' },
    { lang: 'sl' },
    { lang: 'et' },
    { lang: 'lv' },
    { lang: 'lt' },
    { lang: 'ga' },
    { lang: 'is' },
    { lang: 'mt' },
    { lang: 'lb' },
    { lang: 'sq' },
    { lang: 'mk' },
    { lang: 'sr' },
    { lang: 'bs' },
    { lang: 'ua' },
  ]
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