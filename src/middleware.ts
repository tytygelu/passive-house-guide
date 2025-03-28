// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';
import type { Locale } from './lib/i18n-config';
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
 * Mapping pentru țări la limba preferată bazată pe locație
 */
const COUNTRY_LOCALE_MAP: Record<string, Locale> = {
  // English-speaking countries
  US: 'en', UK: 'en', CA: 'en', AU: 'en', NZ: 'en', ZA: 'en', IE: 'en',
  // Spanish-speaking countries
  ES: 'es', MX: 'es', AR: 'es', CL: 'es', CO: 'es', PE: 'es', VE: 'es',
  // French-speaking countries
  FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr',
  // Portuguese-speaking countries
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt',
  // German-speaking countries
  DE: 'de', AT: 'de', LI: 'de',
  // Italian-speaking countries
  IT: 'it', SM: 'it', VA: 'it',
  // Dutch-speaking countries
  NL: 'nl',
  // Romanian-speaking countries
  RO: 'ro', MD: 'ro',
  // Russian-speaking countries
  RU: 'ru', BY: 'ru', KZ: 'ru',
  // Polish-speaking countries
  PL: 'pl',
  // Amharic-speaking countries
  ET: 'am'
};

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    
    // DEBUG: Log toate headerele pentru diagnosticare
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    log.info(`[Middleware] All request headers:`, allHeaders);
    log.info(`[Middleware] Request pathname: ${pathname}`);
    
    // 1. Excluderea resurselor statice - PRIORITATE MAXIMĂ
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/fonts/') ||
      pathname.startsWith('/static/') ||
      pathname.includes('.svg') ||
      pathname.includes('.jpg') ||
      pathname.includes('.jpeg') ||
      pathname.includes('.png') ||
      pathname.includes('.css') ||
      pathname.includes('.js') ||
      pathname.includes('.ico') ||
      pathname.includes('.json') ||
      pathname === '/favicon.ico'
    ) {
      // Permitem încărcarea resurselor statice fără redirecționare
      log.info(`[Middleware] Skipping redirection for static resource: ${pathname}`);
      return NextResponse.next();
    }

    // 2. Verificăm modelul de URL cu dublă specificare a limbii (ex: /fr/en/page)
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2 && 
        i18n.locales.includes(pathParts[0] as Locale) && 
        i18n.locales.includes(pathParts[1] as Locale)) {
      
      // Extragem noua limbă și restul căii
      const targetLocale = pathParts[1];
      const remainingPath = pathParts.slice(2).join('/');
      const correctPath = `/${targetLocale}${remainingPath ? `/${remainingPath}` : ''}`;
      
      // Creăm răspunsul de redirecționare
      const response = NextResponse.redirect(new URL(correctPath, request.url), 302);
      
      // Setăm cookie-ul pentru noua limbă
      response.cookies.set('NEXT_LOCALE', targetLocale, { 
        maxAge: 31536000, 
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      log.info(`[Middleware] Detected double locale path: ${pathname} -> ${correctPath}`);
      return response;
    }
    
    // 3. Verificăm dacă URL-ul are deja un prefix de limbă valid
    if (pathParts.length >= 1 && i18n.locales.includes(pathParts[0] as Locale)) {
      const urlLocale = pathParts[0] as Locale;
      
      // Dacă utilizatorul are deja un cookie de limbă setat, respectăm alegerea din URL
      // (înseamnă că utilizatorul a schimbat limba manual)
      if (request.cookies.has('NEXT_LOCALE')) {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        
        if (cookieLocale && urlLocale !== cookieLocale) {
          // Actualizăm cookie-ul conform noii alegeri din URL
          const response = NextResponse.next();
          response.cookies.set('NEXT_LOCALE', urlLocale, { 
            maxAge: 31536000, 
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          });
          log.info(`[Middleware] Updating language preference from ${cookieLocale} to ${urlLocale}`);
          return response;
        }
      }
      
      // Dacă URL-ul are deja un prefix de limbă valid, nu facem nimic
      log.info(`[Middleware] URL already has valid locale prefix: ${urlLocale}`);
      return NextResponse.next();
    }
    
    // 5. Redirecționare pentru ruta principală sau URL-uri fără prefix de limbă
    
    // Determinăm limba preferată folosind mai multe metode
    let locale: Locale = i18n.defaultLocale;
    let localeSource = 'default';
    
    // Prima prioritate: cookie-ul existent (alegerea explicită a utilizatorului)
    if (request.cookies.has('NEXT_LOCALE')) {
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
        locale = cookieLocale as Locale;
        localeSource = 'cookie';
        log.info(`[Middleware] Using locale from cookie: ${locale}`);
      }
    }
    
    // A doua prioritate: detectarea limbii din țară (folosind headerul x-vercel-ip-country)
    if (localeSource === 'default' && request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[Middleware] Country from header: ${country}`);
      
      if (country && COUNTRY_LOCALE_MAP[country] && i18n.locales.includes(COUNTRY_LOCALE_MAP[country])) {
        locale = COUNTRY_LOCALE_MAP[country];
        localeSource = 'country';
        log.info(`[Middleware] Detected locale from country: ${country} -> ${locale}`);
      }
    }
    
    // A treia prioritate: detectarea limbii din headerele Accept-Language
    if (localeSource === 'default') {
      const headerLocale = getLocaleFromHeaders(request);
      if (headerLocale) {
        locale = headerLocale;
        localeSource = 'accept-language';
        log.info(`[Middleware] Detected locale from headers: ${locale}`);
      }
    }
    
    // Forțăm limba română doar în mediul de dezvoltare
    if (process.env.NODE_ENV !== 'production') {
      locale = 'ro';
      localeSource = 'forced';
      log.info(`[Middleware] FORCING LOCALE TO RO FOR TESTING`);
    }
    
    log.info(`[Middleware] Final locale decision: ${locale} (source: ${localeSource})`);
    
    // Construim noua cale URL
    const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    // Creăm răspunsul de redirecționare
    const response = NextResponse.redirect(new URL(newPathname, request.url), 302);
    
    // Setăm cookie-ul pentru noua limbă
    response.cookies.set('NEXT_LOCALE', locale, { 
      maxAge: 31536000, 
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    log.info(`[Middleware] Redirecting to: ${newPathname}`);
    return response;
    
  } catch (error) {
    log.error('[Middleware] Error:', error);
    return NextResponse.next();
  }
}

// Helper function to get locale from Accept-Language headers
function getLocaleFromHeaders(request: NextRequest): Locale | null {
  // Get Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'accept-language') {
      negotiatorHeaders[key] = value;
    }
  });
  
  // No Accept-Language header
  if (Object.keys(negotiatorHeaders).length === 0) {
    return null;
  }
  
  // Create negotiator instance
  const negotiator = new Negotiator({ headers: negotiatorHeaders });
  
  // Get languages from negotiator
  const locales = negotiator.languages() as string[];
  
  // Find best matching locale
  for (const locale of locales) {
    // Try exact match
    if (i18n.locales.includes(locale as Locale)) {
      return locale as Locale;
    }
    
    // Try base language match (e.g., 'en-US' -> 'en')
    const baseLocale = locale.split('-')[0];
    if (i18n.locales.includes(baseLocale as Locale)) {
      return baseLocale as Locale;
    }
  }
  
  return null;
}

// Specificăm pe ce rute să se aplice middleware-ul
// Aceasta este o configurație CRITICĂ pentru ca middleware-ul să funcționeze
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
};
