import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function CaseStudies({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">{dict.sections.case_studies.title}</h1>
        <p className="text-xl text-gray-600">{dict.sections.case_studies.description}</p>
      </div>
    </div>
  )
}