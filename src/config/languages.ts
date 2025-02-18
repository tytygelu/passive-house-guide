export const languages = [
  'af', 'am', 'ar', 'ay', 'az', 'bg', 'bn', 'bs', 'cs', 'da', 
  'de', 'el', 'en', 'es', 'es-ar', 'es-mx', 'et', 'eu', 'fa', 
  'fi', 'fr', 'ga', 'gn', 'ha', 'he', 'hi', 'hr', 'hu', 'id', 
  'is', 'it', 'ja', 'ko', 'lb', 'lo', 'lt', 'lv', 'mk', 'ml', 
  'mr', 'ms', 'mt', 'nl', 'no', 'pa', 'pl', 'pt', 'pt-br', 'qu', 
  'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'sv', 'sw', 'ta', 
  'te', 'th', 'tr', 'uk', 'ur', 'vi', 'xh', 'yo', 'zh', 'zu'
] as const

export type Language = typeof languages[number]
