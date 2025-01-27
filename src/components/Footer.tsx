import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { Dictionary } from '@/dictionaries/dictionaries'

interface FooterProps {
  dict: Dictionary
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
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
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <EnvelopeIcon className="h-5 w-5" />
                <span>{dict.footer.contact.email}</span>
              </div>
              <div className="text-gray-300">
                {dict.footer.contact.phone}
              </div>
              <div className="text-gray-300">
                {dict.footer.contact.address}
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Passive House Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
