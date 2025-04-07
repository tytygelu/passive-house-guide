// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';
import type { Locale } from './lib/i18n-config';
import Negotiator from 'negotiator';

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
    console.warn('[MW] Headers: No Accept-Language header found.');
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

  console.log('[MW] Headers: Could not determine valid locale from Accept-Language.');
  return null;
}

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const pathname = request.nextUrl.pathname;

    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/fonts/') ||
      pathname.startsWith('/static/') ||
      PUBLIC_FILE.test(pathname)
    ) {
      console.log(`[MW-Check] Skipping redirection for static/public resource: ${pathname}`);
      return NextResponse.next();
    }

    const pathParts = pathname.split('/').filter(Boolean);

    if (pathParts.length >= 2) {
      const firstPart = pathParts[0];
      const secondPart = pathParts[1];

      if (i18n.locales.includes(firstPart as Locale) && i18n.locales.includes(secondPart as Locale)) {
        console.warn(`[MW-Check] Detected multiple locales in path: ${pathname}. Redirecting to assumed correct locale.`);
        const remainingPath = pathParts.slice(2).join('/');
        const correctPath = `/${firstPart}${remainingPath ? `/${remainingPath}` : ''}`;
        const redirectUrl = new URL(correctPath, request.url);
        console.log(`[MW-Check] Redirecting path without prefix: ${pathname} -> ${correctPath}`);

        const response = NextResponse.redirect(redirectUrl, 307);

        response.cookies.set('NEXT_LOCALE', firstPart as Locale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');

        return response;
      }
    }

    if (pathParts.length >= 1 && i18n.locales.includes(pathParts[0] as Locale)) {
      const urlLocale = pathParts[0] as Locale;
      const currentCookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

      if (currentCookieLocale && i18n.locales.includes(currentCookieLocale as Locale) && currentCookieLocale !== urlLocale) {
        console.warn(`[MW-Check] URL locale (${urlLocale}) differs from cookie (${currentCookieLocale}). Prioritizing URL.`);
        const response = NextResponse.redirect(request.nextUrl);
        response.cookies.set('NEXT_LOCALE', urlLocale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        console.log(`[MW-Check] Redirecting to ${request.nextUrl.pathname} to set cookie to ${urlLocale}`);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
      }

      if (!currentCookieLocale || !i18n.locales.includes(currentCookieLocale as Locale) || currentCookieLocale !== urlLocale) {
        console.log(`[MW-Check] Setting/updating cookie to match URL locale: ${urlLocale}`);
        const response = NextResponse.next();
        response.cookies.set('NEXT_LOCALE', urlLocale, {
          maxAge: 31536000,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        return response;
      }

      console.log(`[MW-Check] URL locale (${urlLocale}) matches cookie (${currentCookieLocale}). Proceeding.`);
      return NextResponse.next();
    }

    console.log(`[MW-Check] URL does not have a locale prefix. Detecting locale for redirect...`);

    let locale: Locale = i18n.defaultLocale; // Începem cu default ('en')
    let localeSource = 'default'; // Sursa din care am determinat limba

    // 1. Prioritate: Detectare bazată pe IP (doar pe Vercel)
    if (request.headers.has('x-vercel-ip-country')) {
      const country = request.headers.get('x-vercel-ip-country');
      if (country && COUNTRY_LOCALE_MAP[country] && i18n.locales.includes(COUNTRY_LOCALE_MAP[country])) {
        locale = COUNTRY_LOCALE_MAP[country];
        localeSource = 'country';
      } else {
        console.warn(`[MW-Check] GeoIP: Country '${country}' not in map or locale not supported.`);
      }
    } else {
      console.warn('[MW-Check] GeoIP: Missing x-vercel-ip-country header (expected in Vercel env).');
    }

    // 2. Dacă IP-ul nu a determinat limba, încercăm Cookie
    if (localeSource === 'default' && request.cookies.has('NEXT_LOCALE')) {
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
        locale = cookieLocale as Locale;
        localeSource = 'cookie';
      } else {
        console.warn(`[MW-Check] Cookie: Invalid or unsupported locale value in cookie: ${cookieLocale}`);
      }
    }

    // 3. Dacă nici IP, nici Cookie nu au funcționat, încercăm Accept-Language Header
    if (localeSource === 'default') {
      const headerLocale = getLocaleFromHeaders(request);
      if (headerLocale) {
        locale = headerLocale;
        localeSource = 'accept-language';
      }
    }

    console.log(`[MW-Check] Final locale decision for redirect: ${locale} (source: ${localeSource})`);

    // Construim și executăm redirect-ul
    const newPathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    const redirectUrl = new URL(newPathname, request.url);
    console.log(`[MW-Check] Redirecting path without prefix: ${pathname} -> ${redirectUrl.toString()}`);

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

    return response;

  } catch (error) {
    console.error('[MW-Check] Error:', error);
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
