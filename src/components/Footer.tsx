import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { Dictionary } from '@/dictionaries/dictionaries'

interface FooterProps {
  dict: Dictionary
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Social Links */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{dict.footer.social.title}</h3>
            <div className="flex space-x-6">
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
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{dict.footer.contact.title}</h3>
            <div className="flex items-center gap-2 text-gray-300">
              <EnvelopeIcon className="h-5 w-5" />
              <a 
                href={`mailto:${dict.footer.contact.email}`}
                className="hover:text-white transition-colors"
              >
                {dict.footer.contact.email}
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/40 shadow-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Passive House Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
