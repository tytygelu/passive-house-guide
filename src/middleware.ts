import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { localeSchema } from './lib/i18n-config'

const allowedPaths = [
  '/api/contact',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/site.webmanifest'
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Bypass middleware for static files and API routes
  if (allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Try to get locale from URL path
  const pathLocale = pathname.split('/')[1]
  const validatedLocale = localeSchema.safeParse(pathLocale)

  // Redirect to default locale if invalid locale in path
  if (!validatedLocale.success) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || localeSchema.Values.en
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  // Set validated locale in cookies
  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', validatedLocale.data)
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
}
