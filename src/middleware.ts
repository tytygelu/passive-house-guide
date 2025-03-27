// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';
import type { Locale } from './lib/i18n-config';
import redisClient from './lib/redis';
import Negotiator from 'negotiator';

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

// Parse Accept-Language header using negotiator library
function parseAcceptLanguage(acceptLanguage: string): Array<string> {
  const negotiator = new Negotiator({ headers: { 'accept-language': acceptLanguage } });
  return negotiator.languages(i18n.locales as string[]);
}

export async function middleware(request: NextRequest) {
  log.info(`[MIDDLEWARE-DEBUG] Processing request for: ${request.nextUrl.pathname}, URL: ${request.url}`);
  
  // Pentru debugging, logăm toate headerele
  const allHeadersForLog: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    allHeadersForLog[key] = value;
  });
  log.info(`[MIDDLEWARE-DEBUG] All headers:`, allHeadersForLog);
  
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // Skip for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }
  
  try {
    // Pentru debugging, logăm toate headerele
    const allHeadersForLog: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      allHeadersForLog[key] = value;
    });
    log.info(`[MIDDLEWARE-V5] Headers for ${pathname}:`, allHeadersForLog);
    
    // Obținem IP-ul pentru cache și logging
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const country = request.headers.get('x-vercel-ip-country');
    const overrideForFR = country && country.toUpperCase() === 'FR';

    // Creăm cheia de cache
    const cacheKey = `locale:${ip}`;
    
    const cachedLocale = await getRedisValue(cacheKey);
    if (cachedLocale && !overrideForFR && i18n.locales.includes(cachedLocale as Locale)) {
      log.info(`Using cached locale for IP ${ip}: ${cachedLocale}`);
      return handleRedirection(request, cachedLocale as Locale, pathname);
    }
    
    // IMPORTANT: Folosim direct headerele Vercel pentru geolocation
    // Headerul X-Vercel-IP-Country este mai fiabil decât helper-ul geolocation
    log.info(`[MIDDLEWARE-V5] Country from header: ${country || 'null'}`);
    
    // Logăm toate headerele relevante pentru geolocation
    const geoHeaders = {
      country: request.headers.get('x-vercel-ip-country'),
      region: request.headers.get('x-vercel-ip-country-region'),
      city: request.headers.get('x-vercel-ip-city')
    };
    log.info(`[MIDDLEWARE-V5] Geolocation headers:`, geoHeaders);
    
    // Detectăm locale-ul bazat pe țară
    let detectedLocale: Locale | null = null;
    
    // Dacă avem un cod de țară valid, îl folosim pentru a determina locale-ul
    if (country) {
      const upperCountry = country.toUpperCase();
      
      // Tratare specială pentru locații complexe
      if (upperCountry === 'IN') {
        // Pentru India, avem mai multe limbi posibile (hi, bn etc.)
        // Alegeți hindi ca default, în special în regiunile nordice
        detectedLocale = 'hi';
        log.info(`[MIDDLEWARE] Setting default locale for IN to hi`);
      } else if (upperCountry === 'CH') {
        // Pentru Elveția, alegem limba în funcție de regiune dacă este disponibilă
        const region = request.headers.get('x-vercel-ip-country-region');
        if (region) {
          // Verificăm regiunea pentru a alege între germană, franceză, italiană
          const regionLowerCase = region.toLowerCase();
          if (regionLowerCase.includes('geneva') || regionLowerCase.includes('vaud') || 
              regionLowerCase.includes('neuchatel') || regionLowerCase.includes('jura')) {
            detectedLocale = 'fr';
          } else if (regionLowerCase.includes('ticino')) {
            detectedLocale = 'it';
          } else {
            // Default la germană pentru restul Elveției
            detectedLocale = 'de';
          }
          log.info(`[MIDDLEWARE] Detected locale for CH region ${region}: ${detectedLocale}`);
        } else {
          // Default la germană dacă nu avem informații despre regiune
          detectedLocale = 'de';
        }
      } else if (upperCountry === 'BE') {
        // Pentru Belgia, alegem limba în funcție de regiune
        const region = request.headers.get('x-vercel-ip-country-region');
        if (region) {
          const regionLowerCase = region.toLowerCase();
          if (regionLowerCase.includes('flanders') || regionLowerCase.includes('antwerp') || 
              regionLowerCase.includes('limburg') || regionLowerCase.includes('flemish')) {
            detectedLocale = 'nl';
          } else {
            // Default la franceză pentru Wallonia și Bruxelles
            detectedLocale = 'fr';
          }
          log.info(`[MIDDLEWARE] Detected locale for BE region ${region}: ${detectedLocale}`);
        } else {
          // Default la franceză dacă nu avem informații despre regiune
          detectedLocale = 'fr';
        }
      } else if (upperCountry === 'CA') {
        // Pentru Canada, verificăm regiunea pentru Quebec
        const region = request.headers.get('x-vercel-ip-country-region');
        if (region && (region.toLowerCase().includes('quebec') || region === 'QC')) {
          detectedLocale = 'fr';
          log.info(`[MIDDLEWARE] Detected locale for CA Quebec: fr`);
        } else {
          detectedLocale = 'en';
        }
      } else if (upperCountry in COUNTRY_LOCALE_MAP) {
        // Verificăm dacă avem o mapare directă în COUNTRY_LOCALE_MAP
        const mappedLocale = COUNTRY_LOCALE_MAP[upperCountry];
        if (i18n.locales.includes(mappedLocale as Locale)) {
          detectedLocale = mappedLocale as Locale;
          log.info(`[MIDDLEWARE] Country ${upperCountry} maps to locale: ${detectedLocale}`);
        }
      } else {
        // Verificăm dacă avem o mapare pentru coduri speciale (ex. "IN_HI", "CH_FR")
        // Format: COUNTRY_SPECIFICLANG
        const specialCodes = Object.keys(COUNTRY_LOCALE_MAP).filter(key => key.startsWith(upperCountry + '_'));
        if (specialCodes.length > 0) {
          // Folosim prima mapare specială găsită pentru țara respectivă
          const mappedLocale = COUNTRY_LOCALE_MAP[specialCodes[0]];
          if (i18n.locales.includes(mappedLocale as Locale)) {
            detectedLocale = mappedLocale as Locale;
            log.info(`[MIDDLEWARE] Country ${upperCountry} special code ${specialCodes[0]} maps to locale: ${detectedLocale}`);
          }
        } else {
          log.info(`[MIDDLEWARE] Country ${upperCountry} not found in mapping`);
        }
      }
    }
    
    // Dacă nu am putut determina un locale din țară, încercăm cu Accept-Language
    if (!detectedLocale) {
      const acceptLanguage = request.headers.get('accept-language');
      log.info(`[MIDDLEWARE-V5] Accept-Language header: ${acceptLanguage || 'null'}`);
      
      if (acceptLanguage) {
        const browserLanguages = parseAcceptLanguage(acceptLanguage);
        log.info(`[MIDDLEWARE-V5] Browser languages: ${browserLanguages.join(', ')}`);
        
        // Găsim primul locale suportat
        for (const lang of browserLanguages) {
          const normalizedLang = lang.toLowerCase();
          const baseLanguage = normalizedLang.split('-')[0];
          
          // Verificăm mai întâi potrivirea exactă
          if (i18n.locales.includes(normalizedLang as Locale)) {
            detectedLocale = normalizedLang as Locale;
            log.info(`[MIDDLEWARE-V5] Found exact match for browser language: ${normalizedLang}`);
            break;
          }
          
          // Apoi verificăm potrivirea cu limba de bază
          if (i18n.locales.includes(baseLanguage as Locale)) {
            detectedLocale = baseLanguage as Locale;
            log.info(`[MIDDLEWARE-V5] Found base language match for browser language: ${baseLanguage}`);
            break;
          }
        }
      }
    }
    
    // Dacă tot nu am găsit un locale, folosim valoarea implicită
    if (!detectedLocale) {
      detectedLocale = i18n.defaultLocale;
      log.info(`[MIDDLEWARE-V5] Using default locale: ${detectedLocale}`);
    }
    
    // Salvăm locale-ul detectat în cache
    if (detectedLocale) {
      await setRedisValue(cacheKey, detectedLocale, 3600); // Cache pentru 1 oră
    }
    
    return handleRedirection(request, detectedLocale, pathname);
  } catch (error) {
    log.error(`[MIDDLEWARE-V5] Error:`, error);
    
    // În caz de eroare, continuăm cererea normală
    const response = NextResponse.next();
    setAntiCacheHeaders(response, 'error-v5');
    return response;
  }
}

// Helper function to handle redirection logic
function handleRedirection(
  request: NextRequest,
  detectedLocale: Locale | null,
  pathname: string
) {
  // Excludem toate resursele statice și imaginile de la redirecționare
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') || // Excludem toate fișierele cu extensie (.jpg, .png, .css, .js, etc.)
    pathname === '/favicon.ico'
  ) {
    log.info(`[handleRedirection] Static resource ${pathname}, skipping redirection`);
    return NextResponse.next();
  }

  // Verificăm cazul special în care avem o dublă specificare a limbii (ex: /fr/en/principles)
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length >= 2 && i18n.locales.includes(pathParts[0] as Locale) && i18n.locales.includes(pathParts[1] as Locale)) {
    // Avem o cale de forma /{locale1}/{locale2}/... - eliminăm primul locale și păstrăm al doilea
    const newTargetLocale = pathParts[1];
    const remainingPath = pathParts.slice(2).join('/');
    const correctPath = `/${newTargetLocale}${remainingPath ? `/${remainingPath}` : ''}`;
    
    log.info(`[handleRedirection] Detected double locale path: ${pathname}, redirecting to ${correctPath}`);
    const response = NextResponse.redirect(new URL(correctPath, request.url), 302);
    setAntiCacheHeaders(response, 'double-locale-fix');
    return response;
  }

  // Verificăm dacă locale-ul detectat este același cu cel din URL
  const currentLocale = pathParts[0]; // First path segment
  if (currentLocale === detectedLocale) {
    log.info(`[handleRedirection] Locale ${detectedLocale} is the same as current locale, skipping redirection`);
    return NextResponse.next();
  }

  // Construim noua cale URL corect, fără a folosi /_next/cache/
  let newPathname;
  if (pathname === '/') {
    newPathname = `/${detectedLocale}`;
  } else if (i18n.locales.includes(currentLocale as Locale)) {
    // Dacă URL-ul actual are deja un locale, îl înlocuim
    newPathname = `/${detectedLocale}${pathname.substring(currentLocale.length + 1)}`;
  } else {
    // Dacă URL-ul nu are locale, adăugăm
    newPathname = `/${detectedLocale}${pathname}`;
  }

  log.info(`Redirecting ${pathname} to ${newPathname}`);
  const response = NextResponse.redirect(new URL(newPathname, request.url), 302);
  setAntiCacheHeaders(response, 'locale-redirect');
  response.headers.set('Cache-Tag', `${detectedLocale}, ${pathname}`);
  return response
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
