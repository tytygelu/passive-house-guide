// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';
import type { Locale } from './lib/i18n-config';
import Negotiator from 'negotiator';

// Logging utilities
const log = {
  info(message: string, data?: Record<string, unknown>) {
    console.log(`[MW-Check] ${message}`, data ? JSON.stringify(data) : '');
  },
  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    console.error(`[MW-Check] ${message}`, error, data ? JSON.stringify(data) : '');
  },
  warn(message: string, data?: Record<string, unknown>) {
    console.warn(`[MW-Check] ${message}`, data ? JSON.stringify(data) : '');
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

    log.info(`[MW-Check] Request pathname: ${pathname}`);

    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/fonts/') ||
      pathname.startsWith('/static/') ||
      PUBLIC_FILE.test(pathname)
    ) {
      log.info(`[MW-Check] Skipping redirection for static/public resource: ${pathname}`);
      return NextResponse.next();
    }

    const pathParts = pathname.split('/').filter(Boolean);
    log.info(`[MW-Check] Path parts: ${JSON.stringify(pathParts)}`);

    if (pathParts.length >= 2) {
      const firstPart = pathParts[0];
      const secondPart = pathParts[1];
      log.info(`[MW-Check] Checking double locale: /${firstPart}/${secondPart}`);

      if (i18n.locales.includes(firstPart as Locale) && i18n.locales.includes(secondPart as Locale)) {
        log.info(`[MW-Check] MATCH! Found double locale pattern: /${firstPart}/${secondPart}`);

        const remainingPath = pathParts.slice(2).join('/');
        const correctPath = `/${firstPart}${remainingPath ? `/${remainingPath}` : ''}`;
        log.info(`[MW-Check] Correct path determined: ${correctPath}`);

        const redirectUrl = new URL(correctPath, request.url);
        log.info(`[MW-Check] 🔴 Attempting REDIRECT: ${pathname} -> ${correctPath}`);

        const response = NextResponse.redirect(redirectUrl, 307);

        response.cookies.set('NEXT_LOCALE', firstPart as Locale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        log.info(`[MW-Check] Set NEXT_LOCALE cookie to: ${firstPart}`);

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');
        log.info(`[MW-Check] Added no-cache headers to redirect response`);

        return response;
      }
    }

    if (pathParts.length >= 1 && i18n.locales.includes(pathParts[0] as Locale)) {
      const urlLocale = pathParts[0] as Locale;
      const currentCookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

      log.info(`[MW-Check] Path has locale: ${urlLocale}. Cookie locale: ${currentCookieLocale || 'Not set'}`);

      if (currentCookieLocale && i18n.locales.includes(currentCookieLocale as Locale) && currentCookieLocale !== urlLocale) {
        log.info(`[MW-Check] URL locale (${urlLocale}) differs from cookie (${currentCookieLocale}). Prioritizing URL.`);
        const response = NextResponse.redirect(request.nextUrl);
        response.cookies.set('NEXT_LOCALE', urlLocale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        log.info(`[MW-Check] Redirecting to ${request.nextUrl.pathname} to set cookie to ${urlLocale}`);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
      }

      if (!currentCookieLocale || !i18n.locales.includes(currentCookieLocale as Locale) || currentCookieLocale !== urlLocale) {
        log.info(`[MW-Check] Setting/updating cookie to match URL locale: ${urlLocale}`);
        const response = NextResponse.next();
        response.cookies.set('NEXT_LOCALE', urlLocale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        return response;
      }

      log.info(`[MW-Check] URL locale (${urlLocale}) matches cookie (${currentCookieLocale}). Proceeding.`);
      return NextResponse.next();
    }

    log.info(`[MW-Check] URL does not have a locale prefix. Detecting locale for redirect...`);

    let locale: Locale = i18n.defaultLocale; // Începem cu default ('en')
    let localeSource = 'default'; // Sursa din care am determinat limba

    // 1. Prioritate: Detectare bazată pe IP (doar pe Vercel)
    if (request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      log.info(`[MW-Check] GeoIP: Found country header: ${country}`);
      if (country && COUNTRY_LOCALE_MAP[country] && i18n.locales.includes(COUNTRY_LOCALE_MAP[country])) {
        locale = COUNTRY_LOCALE_MAP[country];
        localeSource = 'country';
        log.info(`[MW-Check] GeoIP: Using locale from country: ${country} -> ${locale}`);
      } else {
        log.warn(`[MW-Check] GeoIP: Country '${country}' not in map or locale not supported.`);
      }
    } else {
      // Acest mesaj va apărea local, dar nu ar trebui să apară pe Vercel
      log.warn('[MW-Check] GeoIP: Missing x-vercel-ip-country header (expected in Vercel env).');
    }

    // 2. Dacă IP-ul nu a determinat limba, încercăm Cookie
    if (localeSource === 'default' && request.cookies.has('NEXT_LOCALE')) {
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      log.info(`[MW-Check] Cookie: Found cookie value: ${cookieLocale}`);
      if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
        locale = cookieLocale as Locale;
        localeSource = 'cookie';
        log.info(`[MW-Check] Cookie: Using locale from cookie: ${locale}`);
      } else {
        log.warn(`[MW-Check] Cookie: Invalid or unsupported locale value in cookie: ${cookieLocale}`);
        // Opțional: am putea șterge cookie-ul invalid aici
        // response.cookies.delete('NEXT_LOCALE');
      }
    } else if (localeSource === 'default') {
      log.info('[MW-Check] Cookie: No NEXT_LOCALE cookie found or IP already determined locale.');
    }

    // 3. Dacă nici IP, nici Cookie nu au funcționat, încercăm Accept-Language Header
    if (localeSource === 'default') {
      log.info('[MW-Check] Headers: Attempting locale detection from Accept-Language.');
      const headerLocale = getLocaleFromHeaders(request);
      if (headerLocale) {
        locale = headerLocale;
        localeSource = 'accept-language';
        log.info(`[MW-Check] Headers: Using locale from Accept-Language: ${locale}`);
      } else {
        log.info('[MW-Check] Headers: Could not determine valid locale from Accept-Language.');
      }
    }

    // 4. Log final înainte de redirect
    log.info(`[MW-Check] Final locale decision for redirect: ${locale} (source: ${localeSource})`);

    // Construim și executăm redirect-ul
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

    log.info(`[MW-Check] Redirecting path without prefix: ${pathname} -> ${redirectUrl.toString()}`);
    return response;

  } catch (error) {
    log.error('[MW-Check] Error:', error);
    return NextResponse.next();
  }
}

export const config = {
  // Matcher specifică căile unde va rula middleware-ul
  // Este crucial să NU includem căile pentru resurse statice sau API aici
  matcher: [
    // Rulează pe toate căile care NU încep cu /api/, /_next/static/, /_next/image/, sau nu au extensie de fișier (ex: .ico, .png)
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|apple-touch-icon-precomposed.png|icon.svg|icon-192.png|icon-512.png|manifest.json|robots.txt|sitemap.xml|sitemap-0.xml).*)",
  ],
};
