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

export function middleware(request: NextRequest) {
  try {
    // Extract the pathname from the URL
    const pathname = request.nextUrl.pathname;
    
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
    
    // 3. Verificăm cookie-ul pentru preferința de limbă existentă
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    
    // 4. Verificăm dacă URL-ul are deja un prefix de limbă valid
    if (pathParts.length >= 1 && i18n.locales.includes(pathParts[0] as Locale)) {
      const urlLocale = pathParts[0] as Locale;
      
      // Dacă utilizatorul are deja un cookie de limbă setat, respectăm alegerea din URL
      // (înseamnă că utilizatorul a schimbat limba manual)
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
      
      // Dacă URL-ul are deja un prefix de limbă valid, nu facem nimic
      log.info(`[Middleware] URL already has valid locale prefix: ${urlLocale}`);
      return NextResponse.next();
    }
    
    // 5. Redirecționare pentru ruta principală sau URL-uri fără prefix de limbă
    
    // Determinăm limba preferată (din cookie, sau detectăm)
    let locale: Locale | null = null;
    
    // Prima prioritate: cookie-ul existent
    if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
      locale = cookieLocale as Locale;
      log.info(`[Middleware] Using locale from cookie: ${locale}`);
    } 
    // A doua prioritate: detectarea limbii din headerele Accept-Language
    else {
      locale = getLocaleFromHeaders(request) || i18n.defaultLocale;
      log.info(`[Middleware] Detected locale from headers: ${locale}`);
    }
    
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
