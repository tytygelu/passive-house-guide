// src/app/[lang]/layout.tsx
import ClientNav from '@/components/ClientNav'
import { getDictionary } from '@/dictionaries/dictionaries'

export default async function LanguageLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const dict = await getDictionary(params.lang)
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Passive House Guide</div>
          <ClientNav lang={params.lang} menuItems={dict.navigation} />
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}