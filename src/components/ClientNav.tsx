'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import Flag from 'react-world-flags'

type ClientNavProps = {
  lang: string
  menuItems: Record<string, string>
}

export default function ClientNav({ lang, menuItems }: ClientNavProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    return pathname.substring(3)
  }

  const languages = [
    // Europa
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'ro', name: 'Română', flag: 'RO' },
    { code: 'de', name: 'Deutsch', flag: 'DE' },
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'it', name: 'Italiano', flag: 'IT' },
    { code: 'es', name: 'Español', flag: 'ES' },
    { code: 'nl', name: 'Nederlands', flag: 'NL' },
    { code: 'pl', name: 'Polski', flag: 'PL' },
    { code: 'sv', name: 'Svenska', flag: 'SE' },
    { code: 'no', name: 'Norsk', flag: 'NO' },
    { code: 'da', name: 'Dansk', flag: 'DK' },
    { code: 'fi', name: 'Suomi', flag: 'FI' },
    { code: 'pt', name: 'Português', flag: 'PT' },
    { code: 'cs', name: 'Čeština', flag: 'CZ' },
    { code: 'sk', name: 'Slovenčina', flag: 'SK' },
    { code: 'hu', name: 'Magyar', flag: 'HU' },
    { code: 'el', name: 'Ελληνικά', flag: 'GR' },
    { code: 'bg', name: 'Български', flag: 'BG' },
    { code: 'hr', name: 'Hrvatski', flag: 'HR' },
    { code: 'sl', name: 'Slovenščina', flag: 'SI' },
    { code: 'et', name: 'Eesti', flag: 'EE' },
    { code: 'lv', name: 'Latviešu', flag: 'LV' },
    { code: 'lt', name: 'Lietuvių', flag: 'LT' },
    { code: 'ga', name: 'Gaeilge', flag: 'IE' },
    { code: 'is', name: 'Íslenska', flag: 'IS' },
    { code: 'mt', name: 'Malti', flag: 'MT' },
    { code: 'lb', name: 'Lëtzebuergesch', flag: 'LU' },
    { code: 'sq', name: 'Shqip', flag: 'AL' },
    { code: 'mk', name: 'Македонски', flag: 'MK' },
    { code: 'sr', name: 'Српски', flag: 'RS' },
    { code: 'bs', name: 'Bosanski', flag: 'BA' },
    { code: 'ua', name: 'Українська', flag: 'UA' },
    
    // Asia
    { code: 'zh', name: '中文', flag: 'CN' },
    { code: 'ja', name: '日本語', flag: 'JP' },
    { code: 'ko', name: '한국어', flag: 'KR' },
    { code: 'hi', name: 'हिन्दी', flag: 'IN' },
    { code: 'bn', name: 'বাংলা', flag: 'BD' },
    { code: 'ur', name: 'اردو', flag: 'PK' },
    { code: 'ar', name: 'العربية', flag: 'SA' },
    { code: 'fa', name: 'فارسی', flag: 'IR' },
    { code: 'he', name: 'עברית', flag: 'IL' },
    { code: 'th', name: 'ไทย', flag: 'TH' },
    { code: 'vi', name: 'Tiếng Việt', flag: 'VN' },
    { code: 'id', name: 'Bahasa Indonesia', flag: 'ID' },
    { code: 'ms', name: 'Bahasa Melayu', flag: 'MY' },
    
    // Africa
    { code: 'sw', name: 'Kiswahili', flag: 'TZ' },
    { code: 'am', name: 'አማርኛ', flag: 'ET' },
    { code: 'ha', name: 'Hausa', flag: 'NG' },
    { code: 'yo', name: 'Yorùbá', flag: 'NG' },
    { code: 'zu', name: 'isiZulu', flag: 'ZA' },
    { code: 'xh', name: 'isiXhosa', flag: 'ZA' },
    { code: 'af', name: 'Afrikaans', flag: 'ZA' },
    
    // America
    { code: 'en-us', name: 'English (US)', flag: 'US' },
    { code: 'es-mx', name: 'Español (México)', flag: 'MX' },
    { code: 'pt-br', name: 'Português (Brasil)', flag: 'BR' },
    { code: 'es-ar', name: 'Español (Argentina)', flag: 'AR' },
    { code: 'qu', name: 'Quechua', flag: 'PE' },
    { code: 'ay', name: 'Aymara', flag: 'BO' },
    { code: 'gn', name: 'Guaraní', flag: 'PY' }
  ]

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
            {isScrolled ? (
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
                {label}
              </Link>
            )
          })}

          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm hover:text-gray-700"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              <div className="w-4 h-3 flex-shrink-0 overflow-hidden">
                <Flag
                  code={languages.find(l => l.code === lang)?.flag || 'GB'}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              <span>{languages.find(l => l.code === lang)?.name || 'English'}</span>
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
                      <Flag
                        code={language.flag}
                        className="w-full h-full object-cover rounded-sm"
                      />
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