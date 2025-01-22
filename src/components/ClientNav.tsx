'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ClientNavProps = {
  lang: string
  menuItems: Record<string, string>
}

export default function ClientNav({ lang, menuItems }: ClientNavProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mapăm cheile din meniu la rute
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

  // Obținem ruta curentă fără prefix-ul limbii
  const getCurrentRoute = () => {
    const parts = pathname.split('/')
    return parts.length > 2 ? '/' + parts.slice(2).join('/') : '/'
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ro', name: 'Română' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' }
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 bg-white z-50`}
      initial={{ height: 80 }}
      animate={{ 
        height: isScrolled ? 64 : 80,
        boxShadow: isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href={`/${lang}`} className="relative">
            <AnimatePresence mode="wait">
              {isScrolled ? (
                <motion.div
                  key="short"
                  className="font-bold text-2xl flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0 }}
                  >
                    P
                  </motion.span>
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    H
                  </motion.span>
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    G
                  </motion.span>
                </motion.div>
              ) : (
                <motion.span
                  key="full"
                  className="font-bold text-2xl block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  Passive House Guide
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="flex items-center gap-6">
            {Object.entries(menuItems).map(([key, value]) => (
              <Link 
                key={key} 
                href={`/${lang}${getRoute(key)}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {value}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 ml-4 border-l pl-4">
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={`/${language.code}${getCurrentRoute()}`}
                  className={`px-2 py-1 rounded ${
                    lang === language.code
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {language.code.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}