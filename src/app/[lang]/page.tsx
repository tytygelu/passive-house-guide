// src/app/[lang]/page.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import { PageProps } from '@/types/page'
import PageTransition from '@/components/PageTransition'

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ro' },
  ]
}

export default async function Page({ params }: PageProps) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">{dict.title}</h1>
          <p className="text-xl text-gray-600">{dict.subtitle}</p>
        </div>
      </div>
    </PageTransition>
  )
}
