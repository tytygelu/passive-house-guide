// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';
import type { Locale } from './lib/i18n-config';
import redisClient from './lib/redis';

// Logging utilities
const log = {
  info(message: string, data?: Record<string, unknown>) {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  },
  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, error, data ? JSON.stringify(data) : '');
  },
  warn(message: string, data?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  }
};

/**
 * Comprehensive mapping of countries to their primary language locales.
 * This covers all 73 supported languages.
 */
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  // Default English-speaking countries
  US: 'en', UK: 'en', CA: 'en', AU: 'en', NZ: 'en', ZA: 'en', IE: 'en', 
  // Spanish-speaking countries
  ES: 'es', MX: 'es-mx', AR: 'es', CL: 'es', CO: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  // French-speaking countries
  FR: 'fr', BE: 'fr', CH_FR: 'fr', LU: 'fr', MC: 'fr', CD: 'fr', CI: 'fr', MG: 'fr', CM: 'fr', SN: 'fr', NE: 'fr', BF: 'fr', ML: 'fr', TD: 'fr', GN: 'fr', RW: 'fr', HT: 'fr',
  // Portuguese-speaking countries
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt', GW: 'pt', CV: 'pt', ST: 'pt', TL: 'pt',
  // German-speaking countries
  DE: 'de', AT: 'de', CH: 'de', LI: 'de', LU_DE: 'de',
  // Italian-speaking countries
  IT: 'it', SM: 'it', VA: 'it',
  // Dutch-speaking countries
  NL: 'nl', BE_NL: 'nl', SR: 'nl', CW: 'nl', AW: 'nl', SX: 'nl',
  // Romanian-speaking countries
  RO: 'ro', MD: 'ro',
  // Russian-speaking countries
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  // Arabic-speaking countries
  SA: 'ar', EG: 'ar', DZ: 'ar', SD: 'ar', IQ: 'ar', MA: 'ar', YE: 'ar', SY: 'ar', TN: 'ar', JO: 'ar', LY: 'ar', LB: 'ar', OM: 'ar', AE: 'ar', KW: 'ar', QA: 'ar', BH: 'ar',
  // Chinese-speaking countries
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG_ZH: 'zh',
  // Japanese-speaking countries
  JP: 'ja',
  // Korean-speaking countries
  KR: 'ko', KP: 'ko',
  // Turkish-speaking countries
  TR: 'tr', CY_TR: 'tr',
  // Vietnamese-speaking countries
  VN: 'vi',
  // Polish-speaking countries
  PL: 'pl',
  // Ukrainian-speaking countries
  UA: 'uk',
  // Swedish-speaking countries
  SE: 'sv', FI_SV: 'sv',
  // Greek-speaking countries
  GR: 'el', CY: 'el',
  // Hindi-speaking countries
  IN_HI: 'hi',
  // Bengali-speaking countries
  BD: 'bn', IN_BN: 'bn',
  // Amharic-speaking countries
  ET: 'am'
};

// Helper function for Redis operations
async function getRedisValue(key: string): Promise<string | null> {
  if (!redisClient) return null;
  
  try {
    // Inițializăm conexiunea Redis dacă nu este deja inițializată
    if (!redisClient.isReady) {
      await redisClient.connect();
    }
    // Obținem valoarea din Redis
    return await redisClient.get(key);
  } catch (error) {
    log.error('Error getting value from Redis', error);
    return null;
  }
}

// Helper function for Redis operations
async function setRedisValue(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (!redisClient) return;
  
  try {
    // Inițializăm conexiunea Redis dacă nu este deja inițializată
    if (!redisClient.isReady) {
      await redisClient.connect();
    }
    // Setăm valoarea în Redis cu un TTL
    await redisClient.set(key, value, { EX: ttlSeconds });
  } catch (error) {
    log.error('Error setting value in Redis', error);
  }
}

// Helper function to get locale from country code
function getLocaleFromCountry(country: string | null): Locale | null {
  if (!country) return null;
  
  // Convert country code to uppercase for consistency
  const countryCode = country.toUpperCase();
  
  // Check if country code exists in our mapping
  if (countryCode in COUNTRY_LOCALE_MAP) {
    const locale = COUNTRY_LOCALE_MAP[countryCode];
    
    // Ensure the locale exists in our supported locales
    if (i18n.locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }
  
  return null;
}

// Parse Accept-Language header without external dependencies
function parseAcceptLanguage(acceptLanguage: string): Array<string> {
  // Split on commas and remove spaces
  return acceptLanguage
    .split(',')
    .map(item => item.split(';')[0].trim());
}

// Funcție pentru a obține țara din request folosind headerele Vercel
function getCountryFromRequest(request: NextRequest): string | null {
  // Prima dată verificăm header-ul Vercel specific
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    return vercelCountry;
  }
  
  // Dacă nu avem header-ul Vercel, verificăm alte headere comune
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Implementare simplificată - în realitate ar trebui să verificăm IP-ul
    return null;
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // Add a timestamp to prevent caching issues
  const timestamp = Date.now();
  
  // Avem nevoie de IP pentru logging și cache
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const cacheKey = `locale:${ip}`;
  
  // Check for routes that don't need redirection
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }
  
  try {
    log.info(`[MIDDLEWARE-V4] Processing request for path: ${pathname}`);
    
    // VERIFICĂM DACĂ AVEM DEJA LOCALE PENTRU ACEST IP ÎN CACHE
    const cachedLocale = await getRedisValue(cacheKey);
    if (cachedLocale && i18n.locales.includes(cachedLocale as Locale)) {
      log.info(`Using cached locale for IP ${ip}: ${cachedLocale}`);
      const detectedLocale = cachedLocale as Locale;
      
      return handleRedirection(request, detectedLocale, pathname, timestamp);
    }
    
    // DACĂ NU AVEM CACHE, DETECTĂM ȚARA DIN HEADERS
    // Folosim direct header-ele Vercel în loc de helper-ul @vercel/functions
    const country = getCountryFromRequest(request);
    log.info(`Detected country from headers: ${country || 'unknown'}`);
    
    // DETECTĂM LOCALUL CORECT BAZAT PE ȚARĂ
    let detectedLocale: Locale | null = null;
    
    // Obținem locale bazat pe țară
    if (country) {
      detectedLocale = getLocaleFromCountry(country);
      log.info(`Country ${country} maps to locale: ${detectedLocale || 'none'}`);
    }
    
    // Dacă nu am putut detecta o limbă bazată pe țară, folosim limba browserului
    if (!detectedLocale) {
      const acceptLanguage = request.headers.get('accept-language');
      
      if (acceptLanguage) {
        const browserLanguages = parseAcceptLanguage(acceptLanguage);
        log.info(`Browser languages: ${browserLanguages.join(', ')}`);
        
        // Găsim primul locale suportat din preferințele browserului
        for (const lang of browserLanguages) {
          const languageCode = lang.toLowerCase().split('-')[0];
          
          if (i18n.locales.includes(lang as Locale)) {
            detectedLocale = lang as Locale;
            log.info(`Found exact match for browser language: ${lang}`);
            break;
          }
          
          if (i18n.locales.includes(languageCode as Locale)) {
            detectedLocale = languageCode as Locale;
            log.info(`Found base language match for browser language: ${languageCode}`);
            break;
          }
        }
      }
    }
    
    // Dacă tot nu am găsit un locale, folosim valoarea implicită
    if (!detectedLocale) {
      detectedLocale = i18n.defaultLocale;
      log.info(`Using default locale: ${detectedLocale}`);
    }
    
    // Cache the detected locale for this IP
    if (detectedLocale) {
      await setRedisValue(cacheKey, detectedLocale, 3600); // Cache for 1 hour
    }
    
    return handleRedirection(request, detectedLocale, pathname, timestamp);
  } catch (error) {
    log.error(`[MIDDLEWARE-V4] Error:`, error);
    
    // În caz de eroare, continuăm cererea normală
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }
}

// Helper function to handle redirection logic
function handleRedirection(
  request: NextRequest, 
  detectedLocale: Locale | null, 
  pathname: string, 
  timestamp: number
) {
  // Verificăm dacă path-ul curent are un prefix de locale
  const currentLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // Dacă nu avem un locale detectat, folosim defaultLocale
  if (!detectedLocale) {
    detectedLocale = i18n.defaultLocale;
  }

  // Cazul 1: Suntem pe homepage (/) și trebuie să redirecționăm la versiunea potrivită
  if (pathname === '/') {
    // Redirecționăm la locale-ul detectat cu un timestamp pentru a preveni cache-ul
    const newPathname = `/${detectedLocale}?nocache=${timestamp}`;
    
    log.info(`Homepage redirect: / -> ${newPathname}`);
    
    const response = NextResponse.redirect(new URL(newPathname, request.url), 302);
    
    // Setăm header-uri agresive anti-cache
    setAntiCacheHeaders(response, 'homepage-detection-v3');
    return response;
  }
  
  // Cazul 2: Path-ul are deja un prefix de locale, dar acesta nu se potrivește cu locale-ul detectat
  if (currentLocale && currentLocale !== detectedLocale) {
    // Construim noul pathname înlocuind locale-ul curent cu cel detectat
    const newPathname = pathname.replace(
      new RegExp(`^/${currentLocale}(/|$)`), 
      `/${detectedLocale}$1`
    ) + `?nocache=${timestamp}`;
    
    log.info(`Locale mismatch redirect: ${pathname} -> ${newPathname}`);
    
    const response = NextResponse.redirect(new URL(newPathname, request.url), 302);
    
    // Setăm header-uri agresive anti-cache
    setAntiCacheHeaders(response, 'locale-mismatch-v3');
    return response;
  }
  
  // Cazul 3: Path-ul nu are prefix de locale și nu este homepage
  if (!currentLocale && pathname !== '/') {
    // Adăugăm prefix-ul de locale corect
    const newPathname = `/${detectedLocale}${pathname}?nocache=${timestamp}`;
    
    log.info(`Missing locale redirect: ${pathname} -> ${newPathname}`);
    
    const response = NextResponse.redirect(new URL(newPathname, request.url), 302);
    
    // Setăm header-uri agresive anti-cache
    setAntiCacheHeaders(response, 'missing-locale-prefix-v3');
    return response;
  }
  
  // Cazul 4: Path-ul are deja locale-ul corect, continuăm cererea
  log.info(`No redirect needed, continuing with: ${pathname}`);
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

// Helper function to set anti-cache headers
function setAntiCacheHeaders(response: NextResponse, source: string) {
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('surrogate-control', 'no-store');
  response.headers.set('pragma', 'no-cache');
  response.headers.set('expires', '0');
  response.headers.set('x-redirect-source', source);
}
