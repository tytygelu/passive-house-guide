// src/middleware.ts
console.log('--- Middleware Invoked ---');

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

export async function middleware(request: NextRequest): Promise<NextResponse> {
  console.log(`--- Middleware Execution Started for URL: ${request.url} ---`);

  try {
    const pathname = request.nextUrl.pathname;
    
    // DEBUG: Log all headers for diagnosis
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    log.info(`[Middleware] All request headers:`, allHeaders);
    log.info(`[Middleware] Request pathname: ${pathname}`);
    
    // SUPER DEBUG - add essential details for diagnosis
    console.log(`=== MIDDLEWARE DEBUGGING ===`);
    console.log(`Request URL: ${request.url}`);
    console.log(`Pathname: ${pathname}`);
    
    // 1. Exclude static resources - HIGHEST PRIORITY
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
      pathname.includes('.ico') || // Includes favicon.ico implicitly
      pathname.includes('.json') // Includes manifest.json
      // Removed explicit favicon.ico check as .ico covers it
    ) {
      // Allow static resources to load without redirection
      log.info(`[Middleware] Skipping redirection for static resource: ${pathname}`);
      return NextResponse.next();
    }

    // 2. Check for malformed URLs with multiple language codes - NOW HIGHER PRIORITY
    const pathParts = pathname.split('/').filter(Boolean);
    log.info(`[Middleware] Path parts: ${JSON.stringify(pathParts)}`); // Keep this log

    if (pathParts.length >= 2) {
      const firstPart = pathParts[0];
      const secondPart = pathParts[1];
      log.info(`[Middleware] Checking double locale: /${firstPart}/${secondPart}`); // Keep this log

      if (i18n.locales.includes(firstPart as Locale) && i18n.locales.includes(secondPart as Locale)) {
        log.info(`[Middleware] MATCH! Found double locale pattern: /${firstPart}/${secondPart}`); // Keep this log

        const remainingPath = pathParts.slice(2).join('/');
        const correctPath = `/${secondPart}${remainingPath ? `/${remainingPath}` : ''}`;
        log.info(`[Middleware] Correct path determined: ${correctPath}`); // Keep this log

        const redirectUrl = new URL(correctPath, request.url);
        log.info(`[Middleware] 🔴 Attempting REDIRECT: ${pathname} -> ${correctPath}`); // Keep this log

        const response = NextResponse.redirect(redirectUrl, 307); // Use 307 Temporary Redirect

        // Set cookie for the *correct* locale
        response.cookies.set('NEXT_LOCALE', secondPart as Locale, {
          maxAge: 31536000, // 1 year
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        log.info(`[Middleware] Set NEXT_LOCALE cookie to: ${secondPart}`); // Keep this log

        // Add AGGRESSIVE no-cache headers to THIS redirect response
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');
        log.info(`[Middleware] Added no-cache headers to redirect response`); // Keep this log

        // Ensure we RETURN the response
        return response;
      }
       log.info(`[Middleware] No double locale pattern detected at start.`); // Add log for else case
    }
    
    // OLD BLOCK FOR COMPLEX DUPLICATES - Can be removed or kept commented if needed
    /*
    if (pathParts.length >= 2) {
      const firstPart = pathParts[0];
      const secondPart = pathParts[1];
      const hasDuplicateLanguages = 
        (pathParts.length >= 3 && secondPart === pathParts[2] && i18n.locales.includes(secondPart as Locale));
      
      if (hasDuplicateLanguages) {
        // ... (previous logic for complex duplicates) ...
        log.info(`[Middleware] Redirecting malformed path (complex): ${pathname} -> ${correctPath}`);
        return response;
      }
    }
    */
    
    // 3. Check if URL already has a valid language prefix
    if (pathParts.length >= 1 && i18n.locales.includes(pathParts[0] as Locale)) {
      const urlLocale = pathParts[0] as Locale;
      
      // If user has a language cookie set, respect the choice in the URL
      // (means user changed language manually)
      if (request.cookies.has('NEXT_LOCALE')) {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        
        if (cookieLocale && urlLocale !== cookieLocale) {
          // Update cookie according to the new choice in the URL
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
      
      // If URL already has a valid language prefix and cookie matches or is absent, do nothing
      log.info(`[Middleware] URL already has valid locale prefix: ${urlLocale}`);
      return NextResponse.next();
    }
    
    // 4. Redirect for root path or URLs without a language prefix
    
    // Determine preferred locale using multiple methods
    let locale: Locale = i18n.defaultLocale;
    let localeSource = 'default';
    
    // Priority 1: Existing cookie (user's explicit choice)
    if (request.cookies.has('NEXT_LOCALE')) {
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
        locale = cookieLocale as Locale;
        localeSource = 'cookie';
        log.info(`[Middleware] Using locale from cookie: ${locale}`);
      }
    }
    
    // Priority 2: Locale from country (using x-vercel-ip-country header)
    if (localeSource === 'default' && request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[Middleware] Country from header: ${country}`);
      
      if (country && COUNTRY_LOCALE_MAP[country] && i18n.locales.includes(COUNTRY_LOCALE_MAP[country])) {
        locale = COUNTRY_LOCALE_MAP[country];
        localeSource = 'country';
        log.info(`[Middleware] Detected locale from country: ${country} -> ${locale}`);
      }
    }
    
    // Priority 3: Locale from Accept-Language headers
    if (localeSource === 'default') {
      const headerLocale = getLocaleFromHeaders(request);
      if (headerLocale) {
        locale = headerLocale;
        localeSource = 'accept-language';
        log.info(`[Middleware] Detected locale from headers: ${locale}`);
      }
    }
    
    // Log country info for diagnostics regardless of source used
    if (request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[Middleware] DEBUG: Country from x-vercel-ip-country header: ${country}`);
    } else {
      log.warn(`[Middleware] Missing x-vercel-ip-country header!`);
    }
    
    log.info(`[Middleware] Final locale decision for redirect: ${locale} (source: ${localeSource})`);
    
    // Construct the new URL path
    const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    // Add a parameter to force a cache miss (optional, but can help during debugging)
    const urlWithNoCacheParam = new URL(newPathname, request.url);
    // urlWithNoCacheParam.searchParams.set('nocache', Date.now().toString()); // Can uncomment if needed
    
    // Create the redirect response (307 Temporary Redirect)
    const response = NextResponse.redirect(urlWithNoCacheParam, 307);
    
    // Set the language cookie
    response.cookies.set('NEXT_LOCALE', locale, { 
      maxAge: 31536000, 
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Add cache-disabling headers (might be redundant with 307 but good practice)
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    log.info(`[Middleware] Redirecting path without prefix: ${pathname} -> ${urlWithNoCacheParam.toString()}`);
    return response;
    
  } catch (error) {
    log.error('[Middleware] Error:', error);
    // Fallback to allow the request to proceed in case of middleware error
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
  // Folosim un matcher simplificat temporar pentru debugging
  // Acesta ar trebui să prindă TOATE rutele
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] // Păstrăm excluderile de bază
  // matcher: ['/:path*'] // Alternativă super-simplă dacă cea de sus tot nu merge
};
