// src/app/page.tsx
import { redirect } from 'next/navigation'
import { i18n } from '@/lib/i18n-config'

// Marcăm pagina ca fiind dinamică pentru a preveni pre-renderizarea
// Acest lucru forțează Vercel să execute middleware-ul la fiecare cerere
export const dynamic = 'force-dynamic';

export default function Home() {
  // Redirecționăm către home page în limba implicită
  // Middleware-ul va intercepta această cerere și va redirecționa către limba corectă detectată
  redirect(`/${i18n.defaultLocale}`)
}