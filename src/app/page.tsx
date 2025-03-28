// src/app/page.tsx
import { redirect } from 'next/navigation'
import { i18n } from '@/lib/i18n-config'

// Marcăm pagina ca fiind dinamică pentru a preveni pre-renderizarea
// Acest lucru forțează Vercel să execute middleware-ul la fiecare cerere
export const dynamic = 'force-dynamic';
// Dezactivăm și store-ul pentru a preveni orice caching
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Forțăm limba română doar în mediul de dezvoltare pentru testare
const FORCE_RO_FOR_TESTING = process.env.NODE_ENV !== 'production';

export default function Home() {
  // În mediul de dezvoltare, forțăm limba română pentru testare
  if (FORCE_RO_FOR_TESTING) {
    console.log(`[HomePage-v2] FORCING LOCALE TO RO FOR TESTING`);
    return redirect(`/ro?nocache=${Date.now()}`);
  }
  
  // În producție, redirecționăm către limba implicită
  // Middleware-ul va detecta limba corectă pe baza IP-ului și preferințelor
  console.log(`[HomePage-v2] Redirecting to default locale: /${i18n.defaultLocale}`);
  return redirect(`/${i18n.defaultLocale}?nocache=${Date.now()}`);
}