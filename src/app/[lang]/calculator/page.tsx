import { getDictionary } from '../../../dictionaries'
import { PageProps } from '@/types/page'

export default async function CalculatorPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dict.home.menu.calculator}</h1>
      <p className="text-gray-600">{dict.home.sections.calculator.description}</p>
      {/* Calculator content will be added here */}
    </div>
  )
}