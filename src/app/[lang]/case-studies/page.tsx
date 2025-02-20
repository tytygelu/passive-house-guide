import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'
import PageTransition from '@/components/PageTransition'
import AdUnit from '@/components/AdUnit'

export default async function CaseStudies({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-6">{dict.home.sections.case_studies.title}</h1>
          <p className="text-xl text-gray-600 mb-12">{dict.home.sections.case_studies.description}</p>
          <AdUnit slot="1379423050" />
        </div>
      </div>
    </PageTransition>
  )
}