import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function Calculator({ params }: PageProps) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Energy Calculator</h1>
        <p className="text-xl text-gray-600">Coming soon...</p>
      </div>
    </div>
  )
}