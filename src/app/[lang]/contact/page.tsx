import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import PageTransition from '@/components/PageTransition'
import AdUnit from '@/components/AdUnit'

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const displayEmail = dict.footer.contact.email
  const realEmail = dict.footer.contact.email

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-6">{dict.home.sections.contact.title}</h1>
          <p className="text-xl text-gray-600 mb-12">{dict.home.sections.contact.description}</p>
          <AdUnit slot="1379423050" />
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <EnvelopeIcon className="h-5 w-5" />
            <a 
              href={`mailto:${realEmail}`}
              className="hover:text-primary transition-colors"
              data-email={realEmail}
            >
              {displayEmail}
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}