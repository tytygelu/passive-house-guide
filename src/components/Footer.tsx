import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-gray-300">
            <EnvelopeIcon className="h-5 w-5" />
            <a 
              href="mailto:zero.energy.passive.house@gmail.com" 
              className="hover:text-white transition-colors"
            >
              zero.energy.passive.house@gmail.com
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Passive House Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
