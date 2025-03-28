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

// Helper function to get locale from Accept-Language headers
function getLocaleFromHeaders(request: NextRequest): Locale | null {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'accept-language') {
      negotiatorHeaders[key] = value;
    }
  });

  if (Object.keys(negotiatorHeaders).length === 0) {
    return null;
  }

  const negotiator = new Negotiator({ headers: negotiatorHeaders });
  const locales = negotiator.languages() as string[];

  for (const locale of locales) {
    if (i18n.locales.includes(locale as Locale)) {
      return locale as Locale;
    }
    const baseLocale = locale.split('-')[0];
    if (i18n.locales.includes(baseLocale as Locale)) {
      return baseLocale as Locale;
    }
  }

  return null;
}

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const pathname = request.nextUrl.pathname;

    log.info(`[Middleware] Request pathname: ${pathname}`);

    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/fonts/') ||
      pathname.startsWith('/static/') ||
      PUBLIC_FILE.test(pathname)
    ) {
      log.info(`[Middleware] Skipping redirection for static/public resource: ${pathname}`);
      return NextResponse.next();
    }

    const pathParts = pathname.split('/').filter(Boolean);
    log.info(`[Middleware] Path parts: ${JSON.stringify(pathParts)}`);

    if (pathParts.length >= 2) {
      const firstPart = pathParts[0];
      const secondPart = pathParts[1];
      log.info(`[Middleware] Checking double locale: /${firstPart}/${secondPart}`);

      if (i18n.locales.includes(firstPart as Locale) && i18n.locales.includes(secondPart as Locale)) {
        log.info(`[Middleware] MATCH! Found double locale pattern: /${firstPart}/${secondPart}`);

        const remainingPath = pathParts.slice(2).join('/');
        const correctPath = `/${firstPart}${remainingPath ? `/${remainingPath}` : ''}`;
        log.info(`[Middleware] Correct path determined: ${correctPath}`);

        const redirectUrl = new URL(correctPath, request.url);
        log.info(`[Middleware] 🔴 Attempting REDIRECT: ${pathname} -> ${correctPath}`);

        const response = NextResponse.redirect(redirectUrl, 307);

        response.cookies.set('NEXT_LOCALE', firstPart as Locale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        log.info(`[Middleware] Set NEXT_LOCALE cookie to: ${firstPart}`);

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');
        log.info(`[Middleware] Added no-cache headers to redirect response`);

        return response;
      }
      log.info(`[Middleware] No double locale pattern detected at start.`);
    }

    if (pathParts.length >= 1 && i18n.locales.includes(pathParts[0] as Locale)) {
      const urlLocale = pathParts[0] as Locale;

      if (request.cookies.has('NEXT_LOCALE')) {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

        if (cookieLocale && urlLocale !== cookieLocale) {
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

      log.info(`[Middleware] URL already has valid locale prefix: ${urlLocale}`);
      return NextResponse.next();
    }

    let locale: Locale = i18n.defaultLocale;
    let localeSource = 'default';

    if (request.cookies.has('NEXT_LOCALE')) {
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
        locale = cookieLocale as Locale;
        localeSource = 'cookie';
        log.info(`[Middleware] Using locale from cookie: ${locale}`);
      }
    }

    if (localeSource === 'default' && request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[Middleware] Country from header: ${country}`);

      if (country && COUNTRY_LOCALE_MAP[country] && i18n.locales.includes(COUNTRY_LOCALE_MAP[country])) {
        locale = COUNTRY_LOCALE_MAP[country];
        localeSource = 'country';
        log.info(`[Middleware] Detected locale from country: ${country} -> ${locale}`);
      }
    }

    if (localeSource === 'default') {
      const headerLocale = getLocaleFromHeaders(request);
      if (headerLocale) {
        locale = headerLocale;
        localeSource = 'accept-language';
        log.info(`[Middleware] Detected locale from headers: ${locale}`);
      }
    }

    if (request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[Middleware] DEBUG: Country from x-vercel-ip-country header: ${country}`);
    } else {
      log.warn(`[Middleware] Missing x-vercel-ip-country header!`);
    }

    log.info(`[Middleware] Final locale decision for redirect: ${locale} (source: ${localeSource})`);

    const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    const redirectUrl = new URL(newPathname, request.url);

    const response = NextResponse.redirect(redirectUrl, 307);

    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 31536000,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    log.info(`[Middleware] Redirecting path without prefix: ${pathname} -> ${redirectUrl.toString()}`);
    return response;

  } catch (error) {
    log.error('[Middleware] Error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
};
