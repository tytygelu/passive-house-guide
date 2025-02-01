// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { localeSchema } from './lib/i18n-config';
import { log } from './lib/logger';
import { allowedPaths, rateLimitConfig } from './config/middleware';
import redisClient from './lib/redis';

// Rate limiting constants
const RATE_LIMIT = rateLimitConfig.maxRequests; // Max requests per window
const RATE_LIMIT_WINDOW = rateLimitConfig.windowMs; // 1 minute window

// Cache for frequently detected locales
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

async function detectBrowserLanguage(request: NextRequest) {
  const cacheKey = request.headers.get('Accept-Language') ?? 'default';
  log.info(`Detecting browser language for cache key: ${cacheKey}`);

  try {
    const cached = await redisClient.get(`locale_cache:${cacheKey}`);
    if (cached) {
      const { value, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return value;
      }
    }

    const acceptLang = request.headers.get('Accept-Language');
    if (!acceptLang) {
      log.info('No Accept-Language header found');
      return null;
    }
    log.info(`Accept-Language header: ${acceptLang}`);

    const primaryLang = acceptLang.split(',')[0].split('-')[0].toLowerCase();
    const supportedLocales = new Set(Object.values(localeSchema.Values).map(locale => locale.toLowerCase()));

    if (supportedLocales.has(primaryLang)) {
      log.info(`Detected supported language: ${primaryLang}`);
      await redisClient.set(`locale_cache:${cacheKey}`, JSON.stringify({
        value: primaryLang,
        timestamp: Date.now()
      }), {
        EX: Math.ceil(CACHE_TTL / 1000)
      });
      return primaryLang;
    }

    log.info(`Primary language ${primaryLang} is not supported`);
    return null;
  } catch (error) {
    log.error('Error detecting browser language:', error, { request });
    return null;
  }
}

export async function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const key = `rate_limit:${ip}`;

  try {
    const rateLimit = await redisClient.get(key);
    const count = rateLimit ? JSON.parse(rateLimit).count : 0;

    if (count >= RATE_LIMIT) {
      log.warn(`Rate limit exceeded for IP: ${ip}`);
      return new NextResponse('Too many requests', { status: 429 });
    }

    await redisClient.set(key, JSON.stringify({ count: count + 1, lastRequest: now }), {
      EX: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
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

  // Detect browser language
  const detectedLocale = validatedLocale.success ? validatedLocale.data 
    : cookieLocale ? cookieLocale 
    : await detectBrowserLanguage(request) ?? localeSchema.Values.en

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
