// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { localeSchema } from './lib/i18n-config';
import { log } from './lib/logger';
import { allowedPaths, rateLimitConfig } from './config/middleware';
import redisClient from './lib/redis';
import { geolocation } from '@vercel/edge';

// Rate limiting constants
const RATE_LIMIT = rateLimitConfig.maxRequests; // Max requests per window
const RATE_LIMIT_WINDOW = rateLimitConfig.windowMs; // 1 minute window

// Cache for frequently detected locales
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

// Map of countries to languages
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  // English-speaking countries
  US: 'en', UK: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', JM: 'en', ZA: 'en',
  // Spanish-speaking countries
  ES: 'es', MX: 'es-mx', AR: 'es-ar', CL: 'es', CO: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es', 
  CU: 'es', DO: 'es', BO: 'es', SV: 'es', HN: 'es', PY: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  // French-speaking countries
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', HT: 'fr', CI: 'fr', CM: 'fr', CD: 'fr', MG: 'fr', 
  SN: 'fr', BF: 'fr', NE: 'fr', ML: 'fr', GA: 'fr', BJ: 'fr', TD: 'fr', DJ: 'fr',
  // German-speaking countries
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  // Portuguese-speaking countries
  PT: 'pt', BR: 'pt-br', AO: 'pt', MZ: 'pt', GW: 'pt', TL: 'pt', CV: 'pt', ST: 'pt',
  // Romanian-speaking countries
  RO: 'ro', MD: 'ro',
  // Italian-speaking countries
  IT: 'it', SM: 'it', VA: 'it',
  // Chinese-speaking countries/regions
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh', MO: 'zh',
  // Japanese
  JP: 'ja',
  // Korean
  KR: 'ko', KP: 'ko',
  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  // Arabic-speaking countries
  SA: 'ar', AE: 'ar', QA: 'ar', BH: 'ar', KW: 'ar', OM: 'ar', JO: 'ar', PS: 'ar', LB: 'ar', 
  IQ: 'ar', SY: 'ar', YE: 'ar', EG: 'ar', SD: 'ar', LY: 'ar', TN: 'ar', DZ: 'ar', MA: 'ar', MR: 'ar',
  // Hindi
  IN: 'hi',
  // Urdu
  PK: 'ur',
  // Bengali
  BD: 'bn',
  // Turkish
  TR: 'tr',
  // Vietnamese
  VN: 'vi',
  // Thai
  TH: 'th',
  // Indonesian
  ID: 'id',
  // Malay
  MY: 'ms', BN: 'ms',
  // Filipino/Tagalog
  PH: 'tl',
  // Dutch
  NL: 'nl', SR: 'nl', AW: 'nl', CW: 'nl',
  // Swedish
  SE: 'sv',
  // Norwegian
  NO: 'no',
  // Danish
  DK: 'da',
  // Finnish
  FI: 'fi',
  // Polish
  PL: 'pl',
  // Czech
  CZ: 'cs',
  // Slovak
  SK: 'sk',
  // Hungarian
  HU: 'hu',
  // Greek
  GR: 'el', CY: 'el',
  // Bulgarian
  BG: 'bg',
  // Ukrainian
  UA: 'uk',
  // Hebrew
  IL: 'he',
  // Croatian
  HR: 'hr',
  // Serbian
  RS: 'sr', ME: 'sr',
  // Slovenian
  SI: 'sl',
  // Lithuanian
  LT: 'lt',
  // Latvian
  LV: 'lv',
  // Estonian
  EE: 'et',
  // Albanian
  AL: 'sq', XK: 'sq',
  // Macedonian
  MK: 'mk',
  // Amharic
  ET: 'am',
  // Swahili
  TZ: 'sw', KE: 'sw', UG: 'sw',
  // Azerbaijani
  AZ: 'az',
  // Georgian
  GE: 'ka',
  // Armenian
  AM: 'hy',
  // Basque region
  ES_BASQUE: 'eu',
  // Catalan region
  ES_CATALAN: 'ca',
  // Galician region
  ES_GALICIAN: 'ga',
  // Irish
  IE_IRISH: 'ga',
  // Icelandic
  IS: 'is',
  // Maltese
  MT: 'mt',
  // Luxembourgish
  LU_LUX: 'lb',
  // Zulu
  ZA_ZULU: 'zu',
  // Xhosa
  ZA_XHOSA: 'xh',
  // Yoruba
  NG: 'yo',
  // Hausa
  NG_HAUSA: 'ha',
  // Punjabi regions
  IN_PUNJAB: 'pa', PK_PUNJAB: 'pa',
  // Gujarati regions
  IN_GUJARAT: 'gu',
  // Marathi regions
  IN_MAHARASHTRA: 'mr',
  // Malayalam regions
  IN_KERALA: 'ml',
  // Tamil regions
  IN_TAMIL: 'ta', LK_TAMIL: 'ta',
  // Telugu regions
  IN_ANDHRA: 'te', IN_TELANGANA: 'te',
  // Kannada regions
  IN_KARNATAKA: 'kn',
  // Sinhala
  LK: 'si',
  // Farsi/Persian
  IR: 'fa', AF_DARI: 'fa',
  // Pashto
  AF: 'ps',
  // Khmer
  KH: 'km',
  // Lao
  LA: 'lo',
  // Burmese
  MM: 'my',
  // Mongolian
  MN: 'mn',
  // Quechua regions
  PE_QUECHUA: 'qu', BO_QUECHUA: 'qu', EC_QUECHUA: 'qu',
  // Aymara regions
  BO_AYMARA: 'ay', PE_AYMARA: 'ay',
  // Guarani regions
  PY_GUARANI: 'gn',
  // Bosnian
  BA: 'bs',
};

// Helper function to get locale from country code
async function getLocaleFromCountry(country: string | null): Promise<string | null> {
  if (!country) return null;
  
  // Special case for regional languages
  if (country.includes('_')) {
    const locale = COUNTRY_LOCALE_MAP[country];
    if (locale) return locale;
  }
  
  // Standard country code mapping
  return COUNTRY_LOCALE_MAP[country] || null;
}

async function detectUserLocale(request: NextRequest, locale: string | undefined): Promise<string> {
  const cacheKey = `${request.headers.get('x-forwarded-for') || 'unknown'}_${request.headers.get('Accept-Language') || 'unknown'}`;
  log.info(`Detecting user locale for cache key: ${cacheKey}`);

  try {
    const cached = redisClient ? await redisClient.get(`locale_cache:${cacheKey}`) : null;
    if (cached) {
      const { value, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        log.info(`Using cached locale: ${value}`);
        return value;
      }
    }

    // 1. First try geolocation (IP-based)
    try {
      const { country } = geolocation(request);
      log.info(`Detected country from IP: ${country}`);
      
      const localeFromCountry = await getLocaleFromCountry(country || null);
      if (localeFromCountry) {
        log.info(`Found locale from country: ${localeFromCountry}`);
        
        // Cache result
        if (redisClient) {
          await redisClient.set(`locale_cache:${cacheKey}`, JSON.stringify({
            value: localeFromCountry,
            timestamp: Date.now()
          }), {
            EX: Math.ceil(CACHE_TTL / 1000)
          });
        }
        
        return localeFromCountry;
      }
    } catch (geoError) {
      log.error('Error in geolocation:', geoError);
      // Continue to other detection methods
    }

    // 2. Try browser language as fallback
    const acceptLang = request.headers.get('Accept-Language');
    if (!acceptLang) {
      log.info('No Accept-Language header found');
      return locale ?? localeSchema.Values.en;
    }
    log.info(`Accept-Language header: ${acceptLang}`);

    const primaryLang = acceptLang.split(',')[0].split('-')[0].toLowerCase();
    const supportedLocales = new Set(Object.values(localeSchema.Values).map(locale => locale.toLowerCase()));

    if (supportedLocales.has(primaryLang)) {
      log.info(`Detected supported language: ${primaryLang}`);
      if (redisClient) {
        await redisClient.set(`locale_cache:${cacheKey}`, JSON.stringify({
          value: primaryLang,
          timestamp: Date.now()
        }), {
          EX: Math.ceil(CACHE_TTL / 1000)
        });
      }
      return primaryLang;
    }

    log.info(`Primary language ${primaryLang} is not supported`);
    return locale ?? localeSchema.Values.en;
  } catch (error) {
    log.error('Error detecting user locale:', error, { request });
    return locale ?? localeSchema.Values.en;
  }
}

export async function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const key = `rate_limit:${ip}`;

  try {
    if (redisClient) {
      const rateLimit = await redisClient.get(key);
      const count = rateLimit ? JSON.parse(rateLimit).count : 0;

      if (count >= RATE_LIMIT) {
        log.warn(`Rate limit exceeded for IP: ${ip}`);
        return new NextResponse('Too many requests', { status: 429 });
      }

      await redisClient.set(key, JSON.stringify({ count: count + 1, lastRequest: now }), {
        EX: Math.ceil(RATE_LIMIT_WINDOW / 1000)
      });
    }
  } catch (error) {
    log.error('Error in rate limiting:', error);
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname

  // Bypass middleware for static files and API routes
  if (allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Try to get locale from URL path
  const pathLocale = pathname.split('/')[1]
  const validatedLocale = localeSchema.safeParse(pathLocale)

  // Get locale from cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  // Detect user locale based on IP and browser language
  const detectedLocale = validatedLocale.success ? validatedLocale.data 
    : cookieLocale ? cookieLocale 
    : await detectUserLocale(request, localeSchema.Values.en) ?? localeSchema.Values.en

  // Redirect to default locale if invalid locale in path
  if (!validatedLocale.success) {
    try {
      const url = request.nextUrl.clone()
      url.pathname = `/${detectedLocale}${pathname}`
      return NextResponse.redirect(url)
    } catch (error) {
      log.error('Error redirecting to default locale:', error)
      return NextResponse.next()
    }
  }

  // Set validated locale in cookies
  try {
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', detectedLocale)
    log.info(`Set locale cookie to ${detectedLocale}`)
    return response
  } catch (error) {
    log.error('Error setting locale cookie:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
}
