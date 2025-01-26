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
        'fixed top-0 left-0 right-0 z-50',
        isScrolled 
          ? 'h-16 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'h-20 bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href={`/${lang}`} className="relative">
            <AnimatePresence mode="wait">
              {isScrolled ? (
                <motion.div
                  key="short"
                  className="font-bold"
                  initial={{ 
                    opacity: 0,
                    x: -20,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1,
                    x: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0,
                    x: -20,
                    scale: 0.8
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <span className="text-xl text-primary">P</span>
                  <span className="text-xl">H</span>
                  <span className="text-xl text-primary">G</span>
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  className="font-bold text-2xl"
                  initial={{ 
                    opacity: 0,
                    x: 20,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1,
                    x: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0,
                    x: 20,
                    scale: 0.8
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <span className="text-primary">Passive</span> House Guide
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
                  'hover:text-primary transition-colors duration-300',
                  getCurrentRoute() === getRoute(key) 
                    ? 'text-primary font-medium' 
                    : 'text-gray-600'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button 
                className={clsx(
                  'px-3 py-1.5 rounded-md transition-all duration-300',
                  'hover:bg-gray-100'
                )}
              >
                {lang.toUpperCase()}
              </button>
              
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all duration-200
                            border border-gray-100">
                {languages.map(language => (
                  <Link
                    key={language.code}
                    href={`/${language.code}${getCurrentRoute()}`}
                    className={clsx(
                      'block px-4 py-2 text-sm transition-colors duration-200',
                      language.code === lang 
                        ? 'bg-gray-50 text-primary font-medium' 
                        : 'hover:bg-gray-50'
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