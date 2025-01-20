import { getDictionary } from '../../../dictionaries'
import { PageProps } from '@/types/page'

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dict.home.menu.contact}</h1>
      {/* Contact form will be added here */}
    </div>
  )
}