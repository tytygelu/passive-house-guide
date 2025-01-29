export const i18n = {
  defaultLocale: 'en',
  locales: [
    // European languages
    'en', 'ro', 'de', 'fr', 'it', 'es', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'pt',
    'cs', 'sk', 'hu', 'el', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'ga', 'is', 'mt',
    'lb', 'sq', 'mk', 'sr', 'bs', 'ua',
    
    // Asian languages
    'zh', 'ja', 'ko', 'hi', 'bn', 'ur', 'ar', 'fa', 'he', 'th', 'vi', 'id', 'ms',
    
    // African languages
    'sw', 'am', 'ha', 'yo', 'zu', 'xh', 'af',
    
    // American languages
    'en-us', 'es-mx', 'pt-br', 'es-ar', 'qu', 'ay', 'gn'
  ],
} as const

export type Locale = typeof i18n['locales'][number]
