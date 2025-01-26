'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    // Aici poți adăuga logica pentru a dezactiva cookie-urile non-esențiale
  }

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4 md:p-6"
          style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Cookie Settings</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                </p>
              </div>
              <div className="flex flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={declineCookies}
                  className="flex-1 md:flex-initial px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={acceptCookies}
                  className="flex-1 md:flex-initial px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
