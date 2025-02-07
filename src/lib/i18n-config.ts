import { z } from 'zod'

export const localeSchema = z.enum([
  'en', 'fr', 'de', 'es', 'pt-br', 'ro',
  'af', 'am', 'ar', 'ay', 'az', 'bg', 'bn', 'bs', 'ca', 'cs', 'da', 'el', 'en-us', 'es-ar', 'es-mx', 'et', 'eu', 'fa', 'fi', 'ga', 'gn', 'gu', 'ha', 'he', 'hi', 'hr', 'hu', 'id', 'is', 'it', 'ja', 'kn', 'km', 'ko', 'lb', 'lo', 'lt', 'lv', 'mk', 'ml', 'mr', 'ms', 'mt', 'nl', 'no', 'pa', 'pl', 'pt', 'qu', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'sv', 'sw', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'xh', 'yo', 'zh', 'zu'
])

export const i18n = {
  defaultLocale: 'en' as z.infer<typeof localeSchema>,
  locales: localeSchema.options,
} as const

export type Locale = z.infer<typeof localeSchema>
