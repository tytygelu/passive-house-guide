// src/app/[lang]/page.tsx
import { getDictionary } from '@/dictionaries/dictionaries'
import ClientNav from '@/components/ClientNav'
import { PageProps } from '@/types/page'

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ro' },
    { lang: 'de' },
    { lang: 'fr' }
  ]
}

// Componenta principală a paginii
export default async function Page({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{dict.title}</h1>
            <ClientNav 
              lang={lang} 
              menuItems={{
                home: dict.menu.home,
                principles: dict.menu.principles,
                materials: dict.menu.materials,
                calculator: dict.menu.calculator,
                case_studies: dict.menu.projects,
                contact: dict.menu.contact
              }} 
            />
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{dict.title}</h2>
          <p className="text-xl text-gray-600">{dict.subtitle}</p>
        </section>
      </main>
    </div>
  )
}
