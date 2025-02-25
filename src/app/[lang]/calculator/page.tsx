import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'
import PageTransition from '@/components/PageTransition'

export async function generateStaticParams() {
  // Folosim doar limbile pentru care avem conținut real
  return ['en', 'ro', 'am'].map((locale) => ({
    lang: locale
  }))
}

export default async function Calculator({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">{dict.home.sections.calculator.title}</h1>
          <p className="text-xl text-gray-600">{dict.home.sections.calculator.description}</p>
        </div>
      </div>
    </PageTransition>
  )
}