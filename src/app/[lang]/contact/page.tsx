import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">{dict.home.menu.contact}</h1>
        <p className="text-xl text-gray-600">Get in touch with our team.</p>
      </div>
    </div>
  )
}