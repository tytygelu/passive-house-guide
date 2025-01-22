import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'
import PageTransition from '@/components/PageTransition'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import ContactForm from '@/components/ContactForm'

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">{dict.sections.contact.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{dict.sections.contact.description}</p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-12">
            <EnvelopeIcon className="h-6 w-6" />
            <a href="mailto:zero.energy.passive.house@gmail.com" 
               className="text-lg hover:text-blue-600 transition-colors">
              zero.energy.passive.house@gmail.com
            </a>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactForm translations={dict.sections.contact} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}