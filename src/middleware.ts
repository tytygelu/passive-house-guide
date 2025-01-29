import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './lib/i18n-config'

// Lista limbilor suportate
const locales = i18n.locales

// Middleware care se ocupă de redirecționarea către pagina principală în limba corectă
export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)', '/principles']
}

// Verifică dacă o limbă este suportată
function isLocaleSupported(locale: string) {
  return locales.includes(locale as typeof locales[number])
}

export function middleware(request: NextRequest) {
  // Obține pathname-ul din URL
  const { pathname } = request.nextUrl

  // Dacă suntem pe ruta principală, redirecționăm către /principles în limba potrivită
  if (pathname === '/') {
    // Obține limba preferată din header-ul Accept-Language
    const acceptLanguage = request.headers.get('Accept-Language') || ''
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0]

    // Folosește limba preferată dacă este suportată, altfel folosește limba implicită
    const locale = isLocaleSupported(preferredLocale) ? preferredLocale : i18n.defaultLocale

    // Redirecționează către pagina /principles în limba corectă
    return NextResponse.redirect(new URL(`/${locale}/principles`, request.url))
  }

  // Pentru alte rute, verifică dacă au prefix de limbă
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Dacă nu au prefix de limbă, adaugă limba implicită
  return NextResponse.redirect(
    new URL(`/${i18n.defaultLocale}${pathname}`, request.url)
  )
}
