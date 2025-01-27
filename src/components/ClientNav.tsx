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
        'fixed top-0 left-0 right-0 z-50 px-4',
        isScrolled 
          ? 'h-16 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'h-20 bg-transparent'
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
                className="font-bold relative"
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="text-xl text-gray-900 transition-all duration-300 group-hover:text-gray-600">P</span>
                <span className="text-xl text-gray-900 transition-all duration-300 group-hover:text-gray-600">H</span>
                <span className="text-xl text-gray-900 transition-all duration-300 group-hover:text-gray-600">G</span>
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
                <span className="text-gray-900 transition-all duration-300 group-hover:text-gray-600">Passive House Guide</span>
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
                  'px-4 py-2 rounded-lg transition-all duration-300 text-sm',
                  isActive 
                    ? 'bg-white shadow-lg text-gray-900' 
                    : 'text-gray-600 hover:bg-white/50 hover:shadow-md hover:text-gray-900'
                )}
              >
                {label}
              </Link>
            )
          })}

          <div className="relative group">
            <motion.button 
              className={clsx(
                'px-3 py-1.5 rounded-md transition-all duration-300 text-sm',
                'relative overflow-hidden group text-gray-600 hover:text-gray-900'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gray-100 rounded-md -z-10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {lang?.toUpperCase()}
            </motion.button>
            
            <motion.div 
              className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg opacity-0 invisible 
                        group-hover:opacity-100 group-hover:visible transition-all duration-200
                        border border-gray-100 overflow-hidden"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {languages.map(language => (
                <Link
                  key={language.code}
                  href={`/${language.code}${getCurrentRoute()}`}
                  prefetch={false}
                  className={clsx(
                    'block px-4 py-2 text-sm transition-all duration-200 relative overflow-hidden',
                    language.code === lang 
                      ? 'bg-gray-50 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <motion.div
                    className="absolute inset-0 bg-gray-50"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">{language.code.toUpperCase()}</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}