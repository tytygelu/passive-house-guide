// src/app/[lang]/page.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import { PageProps } from '@/types/page'
import PageTransition from '@/components/PageTransition'
import AdUnit from '@/components/AdUnit'
import { i18n } from '@/lib/i18n-config'
import Link from 'next/link'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale
  }))
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="text-center py-24">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{dict.home.subtitle}</p>

          {/* Reclamă orizontală sus */}
          <div className="mt-8">
            <AdUnit 
              slot="1234567890"  // Înlocuiește cu ID-ul tău de slot
              format="horizontal"
              style={{ minHeight: '90px' }}
            />
          </div>
        </div>

        {/* Secțiuni principale */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Principii */}
            <Link href={`/${lang}/principles`} className="block">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold mb-4">{dict.home.sections.principles.title}</h2>
                <p className="text-gray-600">{dict.home.sections.principles.description}</p>
              </div>
            </Link>

            {/* Materiale */}
            <Link href={`/${lang}/materials`} className="block">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold mb-4">{dict.home.sections.materials.title}</h2>
                <p className="text-gray-600">{dict.home.sections.materials.description}</p>
              </div>
            </Link>

            {/* Calculator */}
            <Link href={`/${lang}/calculator`} className="block">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold mb-4">{dict.home.sections.calculator.title}</h2>
                <p className="text-gray-600">{dict.home.sections.calculator.description}</p>
              </div>
            </Link>
          </div>

          {/* Reclamă orizontală jos */}
          <div className="mt-8">
            <AdUnit 
              slot="0987654321"  // Înlocuiește cu ID-ul tău de slot
              format="horizontal"
              style={{ minHeight: '90px' }}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
