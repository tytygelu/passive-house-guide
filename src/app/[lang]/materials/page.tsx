import { getDictionary } from '../../../dictionaries'

export default async function MaterialsPage({ params }: { params: { lang: string } }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dict.home.menu.materials}</h1>
      <p className="text-gray-600">{dict.home.sections.materials.description}</p>
      {/* Materials content will be added here */}
    </div>
  )
}