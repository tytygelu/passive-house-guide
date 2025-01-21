// src/app/[lang]/layout.tsx
import ClientNav from '@/components/ClientNav'
import { getDictionary } from '@/dictionaries/dictionaries'
import { LayoutProps } from '@/types/page'

export default async function LanguageLayout({
  children,
  params
}: LayoutProps) {
  const dict = await getDictionary(params.lang)
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-white">
        <nav className="container mx-auto max-w-6xl px-4 flex justify-between items-center">
          <div className="text-xl font-bold">Passive House Guide</div>
          <ClientNav lang={params.lang} menuItems={dict.navigation} />
        </nav>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}