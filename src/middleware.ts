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
    
    // SUPER DEBUG - adaugă detalii esențiale pentru diagnosticare
    console.log(`=== MIDDLEWARE DEBUGGING ===`);
    console.log(`Request URL: ${request.url}`);
    console.log(`Pathname: ${pathname}`);
    
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

    // 2. Verificăm adrese URL malformate cu multiple coduri de limbă
    const pathParts = pathname.split('/').filter(Boolean);
    
    // Adăugăm loguri pentru a vedea exact ce se întâmplă cu pathParts
    console.log(`Path parts: ${JSON.stringify(pathParts)}`);
    
    // 2.1 Verificare EXPLICITĂ pentru /ro/en
    if (pathParts.length >= 2) {
      const firstPart = pathParts[0];
      const secondPart = pathParts[1];
      
      console.log(`First part: ${firstPart}, Second part: ${secondPart}`);
      console.log(`Is first part a locale? ${i18n.locales.includes(firstPart as Locale)}`);
      console.log(`Is second part a locale? ${i18n.locales.includes(secondPart as Locale)}`);
      
      // Verificăm specific pentru `/ro/en` și orice altă combinație de limbi
      if (i18n.locales.includes(firstPart as Locale) && i18n.locales.includes(secondPart as Locale)) {
        console.log(`MATCH! Found language pattern: /${firstPart}/${secondPart}`);
        
        const remainingPath = pathParts.slice(2).join('/'); // Obținem restul segmentelor
        const correctPath = `/${secondPart}${remainingPath ? `/${remainingPath}` : ''}`; // Construim calea corectă
        console.log(`Will redirect to: ${correctPath}`);
        
        // Redirecționare
        const redirectUrl = new URL(correctPath, request.url);
        const response = NextResponse.redirect(redirectUrl, 307);
        
        // Setăm cookie-ul pentru noua limbă
        response.cookies.set('NEXT_LOCALE', secondPart as Locale, { 
          maxAge: 31536000, 
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        
        console.log(`🔴 Redirecting: ${pathname} -> ${correctPath}`);
        return response;
      }
      
      // Vechea logică pentru cazuri complexe - o păstrăm ca backup
      const hasDuplicateLanguages = 
        (pathParts.length >= 3 && secondPart === pathParts[2] && i18n.locales.includes(secondPart as Locale));
      
      if (hasDuplicateLanguages) {
        // Adăugăm logare specifică pentru debugging
        log.info(`[Middleware] Detected malformed URL with duplicate locales: ${pathname}`);
        log.info(`[Middleware] Path parts: ${JSON.stringify(pathParts)}`);
        
        // Determinăm care limbă să folosim (a doua, care este cea selectată de utilizator)
        const targetLocale = secondPart as Locale;
        
        // Eliminăm toate instanțele duplicate de limbi și păstrăm restul căii
        const remainingParts: string[] = [];
        for (let i = 2; i < pathParts.length; i++) {
          // Dacă segmentul curent este o limbă și este aceeași cu targetLocale, îl ignorăm
          if (i18n.locales.includes(pathParts[i] as Locale) && pathParts[i] === targetLocale) {
            log.info(`[Middleware] Skipping duplicate locale at position ${i}: ${pathParts[i]}`);
            continue; 
          }
          remainingParts.push(pathParts[i]);
        }
        
        // Construim noua cale corectă
        const correctPath = `/${targetLocale}${remainingParts.length > 0 ? `/${remainingParts.join('/')}` : ''}`;
        
        // Adăugăm logare pentru debugging
        log.info(`[Middleware] Target locale: ${targetLocale}`);
        log.info(`[Middleware] Remaining parts: ${JSON.stringify(remainingParts)}`);
        log.info(`[Middleware] Correct path: ${correctPath}`);
        
        // Creăm răspunsul de redirecționare
        const redirectUrl = new URL(correctPath, request.url);
        log.info(`[Middleware] Redirect URL: ${redirectUrl.toString()}`);
        const response = NextResponse.redirect(redirectUrl, 307);
        
        // Setăm cookie-ul pentru noua limbă
        response.cookies.set('NEXT_LOCALE', targetLocale, { 
          maxAge: 31536000, 
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        
        log.info(`[Middleware] Redirecting malformed path: ${pathname} -> ${correctPath}`);
        return response;
      }
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
    
    // Lăsăm setarea default, care este engleză
    // Înregistrăm doar informația despre țară în loguri pentru diagnosticare
    if (request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[Middleware] DEBUG: Country from x-vercel-ip-country header: ${country}`);
    } else {
      log.warn(`[Middleware] Missing x-vercel-ip-country header!`);
    }
    
    log.info(`[Middleware] Final locale decision: ${locale} (source: ${localeSource})`);
    
    // Construim noua cale URL
    const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    // Adăugăm un parametru pentru a forța un cache miss
    const urlWithNoCacheParam = new URL(newPathname, request.url);
    urlWithNoCacheParam.searchParams.set('nocache', Date.now().toString());
    
    // Creăm răspunsul de redirecționare cu status 307 (Temporary Redirect) în loc de 302
    // pentru a ne asigura că metoda HTTP și corpul rămân neschimbate
    const response = NextResponse.redirect(urlWithNoCacheParam, 307);
    
    // Setăm cookie-ul pentru noua limbă cu o durată mai scurtă pentru teste
    response.cookies.set('NEXT_LOCALE', locale, { 
      maxAge: 31536000, 
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Adăugăm headere pentru a dezactiva cache-ul
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    log.info(`[Middleware] Redirecting to: ${urlWithNoCacheParam.toString()}`);
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
