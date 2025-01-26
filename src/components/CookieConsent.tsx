'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Verificăm dacă utilizatorul a acceptat deja cookie-urile
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowConsent(false)
  }

  if (!showConsent) return null

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
              <h3 className="text-lg font-semibold text-gray-900">Cookie Settings</h3>
              <p className="mt-1 text-sm text-gray-600">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              </p>
            </div>
            <div className="flex flex-row gap-3 w-full md:w-auto">
              <button
                onClick={declineCookies}
                className="flex-1 md:flex-initial min-w-[100px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 md:flex-initial min-w-[100px] px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
