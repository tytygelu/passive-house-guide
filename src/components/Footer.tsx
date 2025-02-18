import { getDictionary } from '@/dictionaries/dictionaries'
import Link from 'next/link'

export default async function Footer({ lang }: { lang: string }) {
  const dict = await getDictionary(lang)

  return (
    <footer className="bg-[#4A5859] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.about.title}</h3>
            <p className="text-gray-300 text-sm">
              {dict.footer.about.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/${lang}/privacy`} 
                  className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                >
                  {dict.footer.quickLinks.privacy}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${lang}/contact`} 
                  className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                >
                  {dict.footer.quickLinks.contact}
                </Link>
              </li>
              <li>
                <div className="flex space-x-2">
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a 
                    href="/api/feed/materials/rss" 
                    className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                    title="Materials RSS Feed"
                  >
                    RSS
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a 
                    href="/api/feed/materials/atom" 
                    className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                    title="Materials Atom Feed"
                  >
                    Atom
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a 
                    href="/api/feed/materials/json" 
                    className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                    title="Materials JSON Feed"
                  >
                    JSON
                  </a>
                </div>
              </li>
              <li>
                <div className="flex space-x-2">
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a 
                    href="/api/feed/principles/rss" 
                    className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                    title="Principles RSS Feed"
                  >
                    RSS
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a 
                    href="/api/feed/principles/atom" 
                    className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                    title="Principles Atom Feed"
                  >
                    Atom
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a 
                    href="/api/feed/principles/json" 
                    className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm"
                    title="Principles JSON Feed"
                  >
                    JSON
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.contact.title}</h3>
            <p className="text-gray-300 text-sm mb-2">
              {dict.footer.contact.email}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/tytygelu/passive-house-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#D9B391] transition-colors duration-200 text-sm inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-400 text-center text-sm text-gray-300">
          <p>&copy; 2025 Passive House Guide. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
