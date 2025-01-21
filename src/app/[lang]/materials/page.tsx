import { PageProps } from '@/types/page'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function Materials({ params }: PageProps) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Building Materials</h1>
        <p className="text-xl text-gray-600">Discover high-performance building materials and technical systems.</p>
      </div>
    </div>
  )
}