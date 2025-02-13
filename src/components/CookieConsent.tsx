'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getDictionary } from '@/dictionaries/dictionaries'

type CookieDict = {
  cookies: {
    title: string
    description: string
    accept: string
    decline: string
  }
}

type Props = {
  lang: string
}

export default function CookieConsent({ lang }: Props) {
  const [showConsent, setShowConsent] = useState(false)
  const [dict, setDict] = useState<CookieDict | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary as unknown as CookieDict)
    }
    loadDictionary()
  }, [lang])

  useEffect(() => {
    if (mounted) {
      const consent = localStorage.getItem('cookie-consent')
      if (!consent) {
        setShowConsent(true)
      }
    }
  }, [mounted])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowConsent(false)
  }

  if (!mounted || !showConsent || !dict) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{dict.cookies.title}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {dict.cookies.description}
              </p>
            </div>
            <div className="flex flex-row gap-3 w-full md:w-auto">
              <button
                onClick={declineCookies}
                id="decline-cookies"
                name="decline-cookies"
                className="flex-1 md:flex-initial min-w-[100px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                {dict.cookies.decline}
              </button>
              <button
                onClick={acceptCookies}
                id="accept-cookies"
                name="accept-cookies"
                className="flex-1 md:flex-initial min-w-[100px] px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                {dict.cookies.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
