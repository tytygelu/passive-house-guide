// src/app/page.tsx
import { redirect } from 'next/navigation'

// Marcăm pagina ca fiind dinamică pentru a preveni pre-renderizarea
// Acest lucru forțează Vercel să execute middleware-ul la fiecare cerere
export const dynamic = 'force-dynamic';
// Dezactivăm și store-ul pentru a preveni orice caching
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// FORȚĂM ROMÂNA ÎN TOATE MEDIILE - SOLUȚIE TEMPORARĂ
// Forțăm româna în toate mediile pentru a confirma dacă problema este în middleware
// sau în alte părți ale aplicației

export default function Home() {
  // FORȚĂM LIMBA ROMÂNĂ ÎN TOATE MEDIILE TEMPORAR
  // Această schimbare drastică va forța site-ul să încarce în română indiferent de middleware
  console.log(`[HomePage-v2] FORCING LOCALE TO RO (ALL ENVIRONMENTS)`);
  return redirect(`/ro?nocache=${Date.now()}`);
}