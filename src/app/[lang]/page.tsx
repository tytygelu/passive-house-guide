// src/app/[lang]/page.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import { PageProps } from '@/types/page'
import PageTransition from '@/components/PageTransition'
import AdUnit from '@/components/AdUnit'

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ro' },
    { lang: 'de' },
    { lang: 'fr' }
  ]
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">{dict.title}</h1>
          <p className="text-xl text-gray-600">{dict.subtitle}</p>

          {/* Reclamă orizontală sus */}
          <AdUnit 
            slot="1234567890"  // Înlocuiește cu ID-ul tău de slot
            format="horizontal"
            style={{ minHeight: '90px' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Conținut existent */}
          </div>

          {/* Reclamă orizontală jos */}
          <AdUnit 
            slot="0987654321"  // Înlocuiește cu ID-ul tău de slot
            format="horizontal"
            style={{ minHeight: '90px' }}
          />
        </div>
      </div>
    </PageTransition>
  )
}
