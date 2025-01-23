// src/app/[lang]/page.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import { PageProps } from '@/types/page'
import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Principles from '@/components/Principles'

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ro' },
    { lang: 'de' },
    { lang: 'fr' }
  ]
}

export default async function Page({ params }: PageProps) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <main>
        <Hero dict={dict} />
        <Features dict={dict} />
        <Principles dict={dict} lang={lang} />
      </main>
    </PageTransition>
  )
}
