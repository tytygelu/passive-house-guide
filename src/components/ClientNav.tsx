'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

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
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${lang}`} className="relative">
            <AnimatePresence mode="wait">
              {isScrolled ? (
                <motion.div
                  key="short"
                  className="font-bold text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  PHG
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  className="font-bold text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Passive House Guide
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {Object.entries(menuItems).map(([key, label]) => (
              <Link
                key={key}
                href={`/${lang}${getRoute(key)}`}
                className={clsx(
                  'hover:text-primary transition-colors',
                  getCurrentRoute() === getRoute(key) && 'text-primary'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="hover:text-primary transition-colors">
                {lang.toUpperCase()}
              </button>
              
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map(language => (
                  <Link
                    key={language.code}
                    href={`/${language.code}${getCurrentRoute()}`}
                    className={clsx(
                      'block px-4 py-2 text-sm hover:bg-gray-100',
                      language.code === lang && 'text-primary'
                    )}
                  >
                    {language.code.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}