// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Passive House Guide',
  description: 'Your comprehensive resource for sustainable living',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/web-app-manifest-192x192.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/web-app-manifest-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/web-app-manifest-512x512.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}