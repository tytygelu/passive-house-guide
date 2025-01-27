import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import PageTransition from '@/components/PageTransition'

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">{dict.home.sections.contact?.title || "Contact Us"}</h1>
          <p className="text-xl text-gray-600 mb-8">{dict.home.sections.contact?.description || "Get in touch with our team"}</p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <EnvelopeIcon className="h-5 w-5" />
            <a 
              href="mailto:zero.energy.passive.house@gmail.com" 
              className="hover:text-primary transition-colors"
            >
              zero.energy.passive.house@gmail.com
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}