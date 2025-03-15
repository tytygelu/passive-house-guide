// src/app/page.tsx
import { redirect } from 'next/navigation'
import { i18n } from '@/lib/i18n-config'

export default function Home() {
  // Redirecționăm către home page în limba implicită
  // Middleware-ul va intercepta această cerere și va redirecționa către limba corectă detectată
  redirect(`/${i18n.defaultLocale}`)
}