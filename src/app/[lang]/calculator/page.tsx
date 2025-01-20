import { getDictionary } from '../../../dictionaries'

export default async function CalculatorPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dict.home.menu.calculator}</h1>
      <p className="text-gray-600">{dict.home.sections.calculator.description}</p>
      {/* Calculator content will be added here */}
    </div>
  )
}