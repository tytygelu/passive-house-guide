export const i18n = {
  defaultLocale: 'en',
  locales: [
    // Main languages
    'en', 'fr', 'de', 'es', 'pt-br', 'ro',
    
    // Other languages (alphabetically ordered)
    'af', 'am', 'ar', 'ay', 'bg', 'bn', 'bs', 'cs', 'da', 'el', 'en-us', 'es-ar',
    'es-mx', 'et', 'fa', 'fi', 'ga', 'gn', 'ha', 'he', 'hi', 'hr', 'hu', 'id',
    'is', 'it', 'ja', 'ko', 'lb', 'lt', 'lv', 'mk', 'ms', 'mt', 'nl', 'no', 'pl',
    'pt', 'qu', 'ru', 'sk', 'sl', 'sq', 'sr', 'sv', 'sw', 'th', 'ua', 'ur', 'vi', 'xh',
    'yo', 'zh', 'zu'
  ],
} as const

export type Locale = typeof i18n['locales'][number]
