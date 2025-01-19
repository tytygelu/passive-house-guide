// src/components/ClientNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type ClientNavProps = {
  lang: string
  menuItems: Record<string, string>
}

export default function ClientNav({ lang, menuItems }: ClientNavProps) {
  const pathname = usePathname()
  
  // Mapăm cheile din meniu la rute
  const getRoute = (key: string) => {
    const routes: Record<string, string> = {
      home: '/',
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
  )
}