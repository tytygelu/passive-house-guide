// src/app/[lang]/page.tsx
import { getDictionary } from '../../dictionaries'
import ClientNav from '@/components/ClientNav'

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'ro' },
    { lang: 'de' },
    { lang: 'fr' }
  ]
}

// Componenta principală a paginii
export default async function Page({ params }: { params: { lang: string } }) {
  // Folosim await pentru a accesa params
  const lang = (await params).lang;
  // Apoi folosim valoarea extrasă
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{dict.home.title}</h1>
            <ClientNav 
              lang={lang} 
              menuItems={{
                home: dict.home.menu.home,
                principles: dict.home.menu.principles,
                materials: dict.home.menu.materials,
                calculator: dict.home.menu.calculator,
                case_studies: dict.home.menu.projects,
                contact: dict.home.menu.contact
              }} 
            />
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{dict.home.title}</h2>
          <p className="text-xl text-gray-600">{dict.home.subtitle}</p>
        </section>
      </main>
    </div>
  )
}
