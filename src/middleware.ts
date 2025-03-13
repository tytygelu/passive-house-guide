// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { i18n, Locale } from './lib/i18n-config'
import redisClient from './lib/redis';
import { geolocation } from '@vercel/edge';

// Rate limiting constants
const RATE_LIMIT = 100; // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window in ms
const LOCALE_COOKIE = 'NEXT_LOCALE';
const CACHE_TTL = 300 * 1000; // 5 minutes in ms

// Initialize logger
const log = {
  info: (message: string, data?: Record<string, unknown>) => console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : ''),
  error: (message: string, error?: unknown, data?: Record<string, unknown>) => console.error(`[ERROR] ${message}`, error, data ? JSON.stringify(data) : ''),
  warn: (message: string, data?: Record<string, unknown>) => console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '')
};

/**
 * Comprehensive mapping of countries to their primary language locales.
 * This covers all 73 supported languages.
 * 
 * Format: CountryCode: LocaleCode
 */
const COUNTRY_LOCALE_MAP: Record<string, Locale> = {
  // --- Primary English-speaking countries ---
  US: 'en-us', UK: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', JM: 'en', ZA: 'en',
  
  // --- Spanish-speaking countries ---
  ES: 'es', MX: 'es-mx', AR: 'es-ar', CL: 'es', CO: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es', 
  CU: 'es', DO: 'es', BO: 'es', SV: 'es', HN: 'es', PY: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  
  // --- French-speaking countries ---
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', HT: 'fr', CI: 'fr', CM: 'fr', CD: 'fr', MG: 'fr', 
  SN: 'fr', BF: 'fr', NE: 'fr', ML: 'fr', GA: 'fr', BJ: 'fr', TD: 'fr', DJ: 'fr',
  
  // --- German-speaking countries ---
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  
  // --- Portuguese-speaking countries ---
  PT: 'pt', BR: 'pt-br', AO: 'pt', MZ: 'pt', GW: 'pt', TL: 'pt', CV: 'pt', ST: 'pt',
  
  // --- Romanian-speaking countries ---
  RO: 'ro', MD: 'ro',
  
  // --- Italian-speaking countries ---
  IT: 'it', SM: 'it', VA: 'it',
  
  // --- Chinese-speaking countries/regions ---
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh', MO: 'zh',
  
  // --- Japanese ---
  JP: 'ja',
  
  // --- Korean ---
  KR: 'ko', KP: 'ko',
  
  // --- Russian ---
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  
  // --- Arabic-speaking countries ---
  SA: 'ar', AE: 'ar', QA: 'ar', BH: 'ar', KW: 'ar', OM: 'ar', JO: 'ar', PS: 'ar', LB: 'ar', 
  IQ: 'ar', SY: 'ar', YE: 'ar', EG: 'ar', SD: 'ar', LY: 'ar', TN: 'ar', DZ: 'ar', MA: 'ar', MR: 'ar',
  
  // --- Hindi ---
  IN: 'hi',
  
  // --- Urdu ---
  PK: 'ur',
  
  // --- Bengali ---
  BD: 'bn',
  
  // --- Turkish ---
  TR: 'tr',
  
  // --- Vietnamese ---
  VN: 'vi',
  
  // --- Thai ---
  TH: 'th',
  
  // --- Indonesian ---
  ID: 'id',
  
  // --- Malay ---
  MY: 'ms', BN: 'ms',
  
  // --- Filipino/Tagalog --- (Using 'en' as fallback since 'tl' is not supported)
  PH: 'en',
  
  // --- Dutch ---
  NL: 'nl', SR: 'nl', AW: 'nl', CW: 'nl',
  
  // --- Swedish ---
  SE: 'sv',
  
  // --- Norwegian ---
  NO: 'no',
  
  // --- Danish ---
  DK: 'da',
  
  // --- Finnish ---
  FI: 'fi',
  
  // --- Polish ---
  PL: 'pl',
  
  // --- Czech ---
  CZ: 'cs',
  
  // --- Slovak ---
  SK: 'sk',
  
  // --- Hungarian ---
  HU: 'hu',
  
  // --- Greek ---
  GR: 'el', CY: 'el',
  
  // --- Bulgarian ---
  BG: 'bg',
  
  // --- Ukrainian ---
  UA: 'uk',
  
  // --- Hebrew ---
  IL: 'he',
  
  // --- Croatian ---
  HR: 'hr',
  
  // --- Serbian ---
  RS: 'sr', ME: 'sr',
  
  // --- Slovenian ---
  SI: 'sl',
  
  // --- Lithuanian ---
  LT: 'lt',
  
  // --- Latvian ---
  LV: 'lv',
  
  // --- Estonian ---
  EE: 'et',
  
  // --- Albanian ---
  AL: 'sq', XK: 'sq',
  
  // --- Macedonian ---
  MK: 'mk',
  
  // --- African languages ---
  ET: 'am',  // Amharic - Ethiopia
  TZ: 'sw', KE: 'sw', UG: 'sw',  // Swahili
  NG: 'yo',  // Yoruba - Nigeria
  ZA_ZULU: 'zu',  // Zulu - South Africa
  ZA_XHOSA: 'xh',  // Xhosa - South Africa
  NG_HAUSA: 'ha',  // Hausa - Nigeria
  ZA_AFRIKAANS: 'af',  // Afrikaans - South Africa
  
  // --- Central Asian languages ---
  AZ: 'az',  // Azerbaijani
  GE: 'en',  // Georgian (using English fallback as 'ka' is not supported)
  AM: 'ru',  // Armenian (using Russian fallback as 'hy' is not supported)
  
  // --- European regional languages ---
  ES_BASQUE: 'eu',  // Basque
  ES_CATALAN: 'ca',  // Catalan
  ES_GALICIAN: 'ga',  // Galician
  IE_IRISH: 'ga',  // Irish
  IS: 'is',  // Icelandic
  MT: 'mt',  // Maltese
  LU_LUX: 'lb',  // Luxembourgish
  
  // --- Indian subcontinent languages ---
  IN_PUNJAB: 'pa', PK_PUNJAB: 'pa',  // Punjabi
  IN_GUJARAT: 'gu',  // Gujarati
  IN_MAHARASHTRA: 'mr',  // Marathi
  IN_KERALA: 'ml',  // Malayalam
  IN_TAMIL: 'ta', LK_TAMIL: 'ta',  // Tamil
  IN_ANDHRA: 'te', IN_TELANGANA: 'te',  // Telugu
  IN_KARNATAKA: 'kn',  // Kannada
  LK: 'si',  // Sinhala - Sri Lanka
  
  // --- Middle Eastern/Central Asian languages ---
  IR: 'fa', AF_DARI: 'fa',  // Farsi/Persian
  AF: 'fa',  // Pashto - Afghanistan (using Farsi fallback as 'ps' is not supported)
  
  // --- Southeast Asian languages ---
  KH: 'km',  // Khmer - Cambodia
  LA: 'lo',  // Lao
  MM: 'th',  // Burmese - Myanmar (using Thai fallback as 'my' is not supported)
  
  // --- East Asian languages ---
  MN: 'zh',  // Mongolian (using Chinese fallback as 'mn' is not supported)
  
  // --- Indigenous American languages ---
  PE_QUECHUA: 'qu', BO_QUECHUA: 'qu', EC_QUECHUA: 'qu',  // Quechua
  BO_AYMARA: 'ay', PE_AYMARA: 'ay',  // Aymara
  PY_GUARANI: 'gn',  // Guarani
  
  // --- Balkan languages ---
  BA: 'bs'  // Bosnian
};

// Helper function for Redis operations
async function getRedisValue(key: string): Promise<string | null> {
  if (!redisClient) return null;
  
  try {
    const cached = await redisClient.get(`locale_cache:${key}`);
    if (cached) {
      const { value, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return value;
      }
    }
  } catch (error) {
    log.error(`Error getting Redis value: ${error}`);
  }
  
  return null;
}

async function setRedisValue(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (!redisClient) return;
  
  try {
    await redisClient.set(`locale_cache:${key}`, JSON.stringify({
      value,
      timestamp: Date.now()
    }), {
      EX: ttlSeconds
    });
  } catch (error) {
    log.error(`Error setting Redis value: ${error}`);
  }
}

// Helper function to get locale from country code
function getLocaleFromCountry(country: string | null): Locale | null {
  if (!country) return null;
  
  log.info(`Getting locale for country: ${country}`);
  
  // Special case for regional languages
  if (country.includes('_')) {
    const locale = COUNTRY_LOCALE_MAP[country] as Locale;
    if (locale && i18n.locales.includes(locale)) {
      log.info(`Found locale for special region ${country}: ${locale}`);
      return locale;
    }
  }
  
  // Standard country code mapping
  const mappedLocale = COUNTRY_LOCALE_MAP[country] as Locale;
  if (mappedLocale && i18n.locales.includes(mappedLocale)) {
    log.info(`Country ${country} maps to locale: ${mappedLocale}`);
    return mappedLocale;
  }
  
  log.info(`No locale mapping found for country: ${country}`);
  return null;
}

// Parse Accept-Language header without external dependencies
function parseAcceptLanguage(acceptLanguage: string): Array<string> {
  // Simple parser that extracts languages from Accept-Language header
  return acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim())
    .filter(Boolean)
    .map(lang => lang.toLowerCase());
}

async function detectUserLocale(request: NextRequest): Promise<Locale> {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const cacheKey = `${ip}_${request.headers.get('Accept-Language') || 'unknown'}`;
  log.info(`Detecting user locale for IP: ${ip}, cache key: ${cacheKey}`);

  try {
    // Check if we have a cached result
    const cached = await getRedisValue(cacheKey);
    if (cached && i18n.locales.includes(cached as Locale)) {
      log.info(`Found cached locale: ${cached}`);
      return cached as Locale;
    }

    // Try geolocation if not found in cache
    try {
      // Get geolocation data
      const { country } = geolocation(request);
      log.info(`Detected country from IP ${ip}: ${country}`);
      
      // Get locale from country code
      if (country) {
        const localeFromCountry = getLocaleFromCountry(country);
        if (localeFromCountry) {
          log.info(`Found locale from country ${country}: ${localeFromCountry}`);
          
          // Cache result
          await setRedisValue(cacheKey, localeFromCountry, 300);
          
          return localeFromCountry;
        } else {
          log.info(`No locale mapping found for country: ${country}`);
        }
      }
    } catch (error) {
      log.error(`Error with geolocation for IP ${ip}: ${error}`);
    }

    // Try browser language as fallback
    const acceptLang = request.headers.get('Accept-Language');
    if (acceptLang) {
      log.info(`Accept-Language header: ${acceptLang}`);
      
      const languages = parseAcceptLanguage(acceptLang);
      log.info(`Parsed languages: ${JSON.stringify(languages)}`);
      
      // Try to match against our supported locales
      for (const lang of languages) {
        const exactMatch = lang as Locale;
        if (i18n.locales.includes(exactMatch)) {
          log.info(`Direct match found for ${lang}`);
          await setRedisValue(cacheKey, lang, 300);
          return exactMatch;
        }
        
        // Handle hyphenated formats (e.g. en-US)
        const baseLang = lang.split('-')[0]; 
        const baseLangAsLocale = baseLang as Locale;
        
        // Try base language match
        if (i18n.locales.includes(baseLangAsLocale)) {
          log.info(`Base language match found for ${baseLang}`);
          await setRedisValue(cacheKey, baseLang, 300);
          return baseLangAsLocale;
        }
        
        // Try finding a locale that starts with this language
        const matchingLocale = i18n.locales.find(
          locale => locale.startsWith(baseLang)
        ) as Locale | undefined;
        
        if (matchingLocale) {
          log.info(`Partial match found: ${lang} -> ${matchingLocale}`);
          await setRedisValue(cacheKey, matchingLocale, 300);
          return matchingLocale;
        }
      }
      
      log.info(`No locale match found for Accept-Language: ${acceptLang}`);
    } else {
      log.info('No Accept-Language header found');
    }
    
    // Default to English if no match found
    return i18n.defaultLocale;
  } catch (error) {
    log.error('Error detecting user locale:', error);
    return i18n.defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  log.info('Middleware executing', { url: request.url });

  // Extract pathname and search params
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams.toString();
  const searchParamsSuffix = searchParams ? `?${searchParams}` : '';

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Handling static files
  ) {
    log.info('Skipping middleware for non-HTML route', { pathname });
    return NextResponse.next();
  }
  
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  
  try {
    if (redisClient) {
      const rateData = await redisClient.get(`rate_limit:${ip}`);
      
      if (rateData) {
        const parsed = JSON.parse(rateData);
        const { count, timestamp } = parsed;
        
        // Reset counter if outside window
        if (now - timestamp > RATE_LIMIT_WINDOW) {
          await redisClient.set(`rate_limit:${ip}`, JSON.stringify({ count: 1, timestamp: now }), {
            EX: Math.ceil(RATE_LIMIT_WINDOW / 1000) * 2
          });
        } 
        // Increment counter if within window and below limit
        else if (count < RATE_LIMIT) {
          await redisClient.set(`rate_limit:${ip}`, JSON.stringify({ count: count + 1, timestamp }), {
            EX: Math.ceil(RATE_LIMIT_WINDOW / 1000) * 2
          });
        }
        // Rate limit exceeded
        else {
          log.warn(`Rate limit exceeded for IP: ${ip}`);
          return new NextResponse('Too Many Requests', { status: 429 });
        }
      } else {
        // First request
        await redisClient.set(`rate_limit:${ip}`, JSON.stringify({ count: 1, timestamp: now }), {
          EX: Math.ceil(RATE_LIMIT_WINDOW / 1000) * 2
        });
      }
    }
  } catch (error) {
    log.error('Error in rate limiting:', error);
  }

  log.info('Processing locale redirection for', { pathname });
  
  // Add special debug for geolocation to diagnose country detection
  try {
    const { country } = geolocation(request);
    log.info('Geolocation debug info:', { 
      ip,
      country,
      mappedLocale: country ? COUNTRY_LOCALE_MAP[country] || 'not mapped' : 'no country detected'
    });
  } catch (error) {
    log.error('Error getting geolocation debug info:', error);
  }

  // Check if path already contains a locale
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Get locale from cookie if available
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  log.info('Cookie locale:', { cookieLocale });

  // If pathname is missing locale, redirect to appropriate locale
  if (!pathnameHasLocale) {
    log.info('No locale in pathname, detecting user locale');
    
    // Detect user locale based on IP and browser language
    const detectedLocale = (cookieLocale as Locale) || await detectUserLocale(request);
    log.info('Final detected locale for redirect:', { detectedLocale });
    
    // Create redirect URL
    const redirectPathname = pathname === '/' 
      ? `/${detectedLocale}` 
      : `/${detectedLocale}${pathname}`;
      
    log.info(`Redirecting to: ${redirectPathname}`);
    return NextResponse.redirect(new URL(redirectPathname + searchParamsSuffix, request.url));
  }

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  
  // Validate locale
  const localeTyped = locale as Locale;
  const isValidLocale = i18n.locales.includes(localeTyped);
  log.info('Locale validation:', { locale, isValid: isValidLocale });
  
  // If invalid locale in path, redirect to default or detected locale
  if (!isValidLocale) {
    log.info('Invalid locale in pathname, redirecting to valid locale');
    
    // Detect appropriate locale
    const detectedLocale = (cookieLocale as Locale) || await detectUserLocale(request);
    const newPathname = pathname.replace(/^\/[^/]+/, `/${detectedLocale}`);
    
    log.info(`Redirecting invalid locale to: ${newPathname}`);
    return NextResponse.redirect(new URL(newPathname + searchParamsSuffix, request.url));
  }

  return NextResponse.next();
}
