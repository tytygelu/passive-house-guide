// src/app/[lang]/layout.tsx
import ClientNav from '@/components/ClientNav'
import { getDictionary } from '@/dictionaries/dictionaries'
import { LayoutProps } from '@/types/page'
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'

export default async function LanguageLayout({
  children,
  params
}: LayoutProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-white">
        <nav className="container mx-auto max-w-6xl px-4 flex justify-between items-center">
          <div className="text-xl font-bold">Passive House Guide</div>
          <ClientNav lang={lang} menuItems={dict.navigation} />
        </nav>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">{dict.footer.about.title}</h3>
              <p className="text-gray-300">{dict.footer.about.description}</p>
            </div>
            
            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">{dict.footer.social.title}</h3>
              <p className="text-gray-300 mb-4">{dict.footer.social.follow}</p>
              <div className="flex space-x-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <FaTwitter className="text-2xl" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <FaLinkedin className="text-2xl" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <FaGithub className="text-2xl" />
                </a>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">{dict.footer.contact.title}</h3>
              <div className="space-y-2 text-gray-300">
                <p>{dict.footer.contact.email}</p>
                <p>{dict.footer.contact.phone}</p>
                <p>{dict.footer.contact.address}</p>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{dict.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}