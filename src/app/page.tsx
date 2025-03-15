// src/app/page.tsx
import { redirect } from 'next/navigation'
import { i18n } from '@/lib/i18n-config'
import { headers } from 'next/headers'

// Marcăm pagina ca fiind dinamică pentru a preveni pre-renderizarea
// Acest lucru forțează Vercel să execute middleware-ul la fiecare cerere
export const dynamic = 'force-dynamic';
// Dezactivăm și store-ul pentru a preveni orice caching
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Home() {
  try {
    // Obținem header-urile pentru a detecta locația utilizatorului
    const headersList = await headers();
    
    // Detectăm IP-ul și țara
    const country = headersList.get('x-vercel-ip-country') || '';
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    
    // Log pentru debugging - versiunea 2
    console.log(`[HomePage-v2] IP Detection: ${ip}, Country: ${country}`);
    
    // Detectare directă a IP-urilor românești
    const isRomanianIP = country === 'RO';
    
    // Redirecționăm utilizatorii din România direct la versiunea în română
    if (isRomanianIP) {
      console.log(`[HomePage-v2] Redirecting Romanian IP to /ro`);
      // Adăugăm un query parameter pentru a evita caching-ul
      redirect('/ro?nocache=' + Date.now());
    }
  } catch (error) {
    console.error('[HomePage-v2] Error detecting country:', error);
  }
  
  // Pentru alți utilizatori, redirecționăm către limba implicită
  console.log(`[HomePage-v2] Redirecting to /${i18n.defaultLocale}`);
  // Adăugăm un query parameter pentru a evita caching-ul
  redirect(`/${i18n.defaultLocale}?nocache=${Date.now()}`);
}