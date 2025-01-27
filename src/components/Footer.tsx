import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { getDictionary } from '@/dictionaries/dictionaries'
import Link from 'next/link'

interface FooterProps {
  lang: string
}

export default async function Footer({ lang }: FooterProps) {
  const dict = await getDictionary(lang)

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.about.title}</h3>
            <p className="text-gray-400 text-sm">
              {dict.footer.about.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}/privacy`} className="text-gray-400 hover:text-white text-sm">
                  {dict.footer.quickLinks.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="text-gray-400 hover:text-white text-sm">
                  {dict.footer.quickLinks.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.contact.title}</h3>
            <p className="text-gray-400 text-sm mb-2">
              {dict.footer.contact.email}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/tytygelu/passive-house-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p> 2024 Passive House Guide. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
