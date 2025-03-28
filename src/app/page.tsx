// src/app/page.tsx
import { redirect } from 'next/navigation'

// Marcăm pagina ca fiind dinamică pentru a preveni pre-renderizarea
// Acest lucru forțează Vercel să execute middleware-ul la fiecare cerere
export const dynamic = 'force-dynamic';
// Dezactivăm și store-ul pentru a preveni orice caching
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Redirecționăm către engleză implicit
export default function Home() {
  console.log(`[HomePage-v4] REDIRECTING TO EN (DEFAULT)`);
  
  // Adăugăm un timestamp pentru a preveni caching-ul
  return redirect(`/en?nocache=${Date.now()}`);
}