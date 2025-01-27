import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'
import PageTransition from '@/components/PageTransition'

export default async function CaseStudies({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">{dict.home.sections.case_studies?.title || "Case Studies"}</h1>
          <p className="text-xl text-gray-600">{dict.home.sections.case_studies?.description || "Real-world examples of passive house projects"}</p>
        </div>
      </div>
    </PageTransition>
  )
}