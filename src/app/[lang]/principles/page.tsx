import { getDictionary } from '../../../dictionaries'

export default async function PrinciplesPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dict.home.menu.principles}</h1>
      <p className="text-gray-600">{dict.home.sections.principles.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">{dict.home.features.insulation}</h3>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">{dict.home.features.windows}</h3>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">{dict.home.features.ventilation}</h3>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">{dict.home.features.airtightness}</h3>
        </div>
      </div>
    </div>
  )
}