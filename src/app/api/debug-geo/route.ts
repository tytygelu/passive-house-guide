// Debug endpoint pentru geolocalizare
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/lib/i18n-config';
import type { Locale } from '@/lib/i18n-config';

// Importăm funcția de mapare țară -> locale din middleware
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  // Default English-speaking countries
  US: 'en', UK: 'en', CA: 'en', AU: 'en', NZ: 'en', ZA: 'en', IE: 'en', 
  // Spanish-speaking countries
  ES: 'es', MX: 'es-mx', AR: 'es', CL: 'es', CO: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  // French-speaking countries
  FR: 'fr', BE: 'fr', CH_FR: 'fr', LU: 'fr', MC: 'fr', CD: 'fr', CI: 'fr', MG: 'fr', CM: 'fr', SN: 'fr', NE: 'fr', BF: 'fr', ML: 'fr', TD: 'fr', GN: 'fr', RW: 'fr', HT: 'fr',
  // Romanian-speaking countries
  RO: 'ro', MD: 'ro',
  // Plus alte țări...
};

// Funcție pentru a obține locale din cod de țară
function getLocaleFromCountry(countryCode: string): Locale | null {
  const locale = COUNTRY_LOCALE_MAP[countryCode];
  if (locale && i18n.locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return null;
}

export async function GET(request: NextRequest) {
  // Colectează toate header-ele pentru debugging
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Obține informații IP specifice
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Colectează informații de geo din headere Vercel
  const vercelCountry = request.headers.get('x-vercel-ip-country') || 'none';
  const vercelRegion = request.headers.get('x-vercel-ip-country-region') || 'none';
  const vercelCity = request.headers.get('x-vercel-ip-city') || 'none';
  
  // Detectăm locale-ul corect bazat pe țară (similar cu logica din middleware)
  let detectedLocale: Locale | null = null;
  
  if (vercelCountry && vercelCountry !== 'none') {
    detectedLocale = getLocaleFromCountry(vercelCountry);
  }
  
  // Dacă nu am detectat un locale valid, folosim default
  if (!detectedLocale) {
    detectedLocale = i18n.defaultLocale;
  }
  
  // Formatăm rezultatul
  const result = {
    timestamp: new Date().toISOString(),
    ip,
    headers,
    geo: {
      country: vercelCountry,
      region: vercelRegion,
      city: vercelCity,
    },
    detection: {
      countryCode: vercelCountry,
      expectedLocale: vercelCountry ? getLocaleFromCountry(vercelCountry) : null,
      finalLocale: detectedLocale
    }
  };

  return NextResponse.json(result);
}
