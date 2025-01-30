import { z } from 'zod'

export const localeSchema = z.enum([
  'en', 'fr', 'de', 'es', 'pt-br', 'ro',
  'af', 'am', 'ar', 'ay', 'bg', 'bn', 'bs', 'cs', 'da', 'el', 'en-us', 'es-ar',
  'es-mx', 'et', 'fa', 'fi', 'ga', 'gn', 'ha', 'he', 'hi', 'hr', 'hu', 'id',
  'is', 'it', 'ja', 'ko', 'lb', 'lt', 'lv', 'mk', 'ms', 'mt', 'nl', 'no', 'pl',
  'pt', 'qu', 'ru', 'sk', 'sl', 'sq', 'sr', 'sv', 'sw', 'th', 'ua', 'ur', 'vi', 'xh',
  'yo', 'zh', 'zu'
])

export const i18n = {
  defaultLocale: 'en' as z.infer<typeof localeSchema>,
  locales: localeSchema.options,
} as const

export type Locale = z.infer<typeof localeSchema>
