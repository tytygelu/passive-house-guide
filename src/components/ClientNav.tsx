'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Mail, Search } from 'lucide-react'
import Flag from 'react-world-flags'
import clsx from 'clsx'
import { localeMetadata, type LocaleMetadata } from '../lib/locale-metadata'

type ClientNavProps = {
  lang: string
  menuItems: Record<string, string>
}

export default function ClientNav({ lang, menuItems }: ClientNavProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 990);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRoute = (key: string) => {
    const routes: Record<string, string> = {
      principles: '/principles',
      materials: '/materials',
      calculator: '/calculator',
      case_studies: '/case-studies',
      contact: '/contact'
    }
    return routes[key] || '/'
  }

  const getCurrentRoute = () => {
    // Split path by '/' and remove empty strings
    const parts = (pathname || '').split('/').filter(Boolean)
    
    // If we have at least 2 parts (lang and route)
    if (parts.length >= 2) {
      // Return everything after the language code
      return '/' + parts.slice(1).join('/')
    }
    
    return '/'
  }

  const languages = localeMetadata

  const currentLanguage = languages.find((l: LocaleMetadata) => l.code === lang);

  return (
    <motion.nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 px-4',
        isScrolled 
          ? 'h-16 bg-[#9EB3B4]/90 backdrop-blur-md shadow-sm' 
          : 'h-20 bg-[#9EB3B4]'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="h-full max-w-6xl mx-auto flex items-center">
        <Link 
          href={`/${lang}`} 
          className="relative group mr-auto"
          prefetch={false}
        >
          <AnimatePresence mode="wait">
            {(isScrolled || isSmallScreen) ? (
              <motion.div
                key="short"
                className="font-bold text-xl relative"
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="text-white transition-all duration-300 group-hover:text-gray-100">P</span>
                <span className="text-white transition-all duration-300 group-hover:text-gray-100">H</span>
                <span className="text-white transition-all duration-300 group-hover:text-gray-100">G</span>
              </motion.div>
            ) : (
              <motion.div
                key="full"
                className="font-bold text-2xl relative"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="text-white transition-all duration-300 group-hover:text-gray-100">Passive House Guide</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <div className="flex items-center space-x-8">
          {Object.entries(menuItems).map(([key, label]) => {
            const currentRoute = getCurrentRoute()
            const targetRoute = getRoute(key)
            const isActive = currentRoute === targetRoute
            
            return (
              <Link
                key={key}
                href={`/${lang}${targetRoute}`}
                prefetch={false}
                className={clsx(
                  'px-4 py-2 rounded-lg transition-all duration-300 text-base font-medium',
                  isActive 
                    ? 'bg-white/90 shadow-lg text-[#4A5859]' 
                    : 'text-white hover:bg-white/20 hover:shadow-md'
                )}
              >
                {key === 'calculator' ? <Calculator size={20} /> : key === 'contact' ? <Mail size={20} /> : label}
              </Link>
            )
          })}

          <Link
            href={`/${lang}/search`}
            prefetch={false}
            className="px-4 py-2 rounded-lg transition-all duration-300 text-base font-medium text-white hover:bg-white/20 hover:shadow-md"
          >
            <Search size={20} />
          </Link>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm hover:text-gray-700"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              <div className="w-4 h-3 flex-shrink-0 overflow-hidden">
                { currentLanguage && currentLanguage.flag ? (
                  <Flag
                    code={currentLanguage.flag}
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : null }
              </div>
              <span>{currentLanguage?.name || 'English'}</span>
              <svg
                className={`h-4 w-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {languages.map(language => (
                  <Link
                    key={language.code}
                    href={`/${language.code}${getCurrentRoute()}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsLanguageMenuOpen(false)}
                  >
                    <div className="w-4 h-3 flex-shrink-0 overflow-hidden">
                      { language.flag && language.flag !== "" ? (
                        <Flag
                          code={language.flag}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : null }
                    </div>
                    <span>{language.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}