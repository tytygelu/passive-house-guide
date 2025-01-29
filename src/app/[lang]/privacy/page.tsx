import { getDictionary } from '@/dictionaries/dictionaries'
import { PageProps } from '@/types/page'
import PageTransition from '@/components/PageTransition'

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{dict.privacy.title}</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacy.introduction.title}</h2>
            <p>{dict.privacy.introduction.content}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacy.dataCollection.title}</h2>
            <p>{dict.privacy.dataCollection.content}</p>
            <ul className="list-disc pl-6 mt-4">
              {dict.privacy.dataCollection.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacy.cookies.title}</h2>
            <p>{dict.privacy.cookies.content}</p>
            <p className="mt-4">
              {dict.privacy.cookies.googleLink}{' '}
              <a
                href="http://www.google.com/policies/privacy/partners/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {dict.privacy.cookies.linkText}
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacy.contact.title}</h2>
            <p>{dict.privacy.contact.content}</p>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
