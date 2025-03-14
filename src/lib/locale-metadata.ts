import { i18n } from './i18n-config'

export type LocaleMetadata = {
  code: typeof i18n.locales[number]
  name: string
  flag: string
  rtl?: boolean
}

export const localeMetadata: LocaleMetadata[] = [
  { code: 'en', name: 'English', flag: 'GB' },
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'pt-br', name: 'Português (Brasil)', flag: 'BR' },
  { code: 'ro', name: 'Română', flag: 'RO' },
  { code: 'af', name: 'Afrikaans', flag: 'ZA' },
  { code: 'am', name: 'አማርኛ', flag: 'ET' },
  { code: 'ar', name: 'العربية', flag: 'SA', rtl: true },
  { code: 'ay', name: 'Aymara', flag: 'BO' },
  { code: 'az', name: 'Azərbaycan', flag: 'AZ' },
  { code: 'bg', name: 'Български', flag: 'BG' },
  { code: 'bn', name: 'বাংলা', flag: 'BD' },
  { code: 'bs', name: 'Bosanski', flag: 'BA' },
  { code: 'ca', name: 'Català', flag: 'ES' },
  { code: 'cs', name: 'Čeština', flag: 'CZ' },
  { code: 'da', name: 'Dansk', flag: 'DK' },
  { code: 'el', name: 'Ελληνικά', flag: 'GR' },
  { code: 'en-us', name: 'English (US)', flag: 'US' },
  { code: 'es-ar', name: 'Español (Argentina)', flag: 'AR' },
  { code: 'es-mx', name: 'Español (México)', flag: 'MX' },
  { code: 'et', name: 'Eesti', flag: 'EE' },
  { code: 'eu', name: 'Euskara', flag: 'EU' },
  { code: 'fa', name: 'فارسی', flag: 'IR', rtl: true },
  { code: 'fi', name: 'Suomi', flag: 'FI' },
  { code: 'ga', name: 'Gaeilge', flag: 'IE' },
  { code: 'gn', name: 'Guaraní', flag: 'PY' },
  { code: 'gu', name: 'ગુજરાતી', flag: 'IN' },
  { code: 'ha', name: 'Hausa', flag: 'NG' },
  { code: 'he', name: 'עברית', flag: 'IL', rtl: true },
  { code: 'hi', name: 'हिन्दी', flag: 'IN' },
  { code: 'hr', name: 'Hrvatski', flag: 'HR' },
  { code: 'hu', name: 'Magyar', flag: 'HU' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'ID' },
  { code: 'is', name: 'Íslenska', flag: 'IS' },
  { code: 'it', name: 'Italiano', flag: 'IT' },
  { code: 'ja', name: '日本語', flag: 'JP' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: 'IN' },
  { code: 'km', name: 'ខ្មែរ', flag: 'KH' },
  { code: 'ko', name: '한국어', flag: 'KR' },
  { code: 'lb', name: 'Lëtzebuergesch', flag: 'LU' },
  { code: 'lo', name: 'ລາວ', flag: 'LA' },
  { code: 'lt', name: 'Lietuvių', flag: 'LT' },
  { code: 'lv', name: 'Latviešu', flag: 'LV' },
  { code: 'mk', name: 'Македонски', flag: 'MK' },
  { code: 'ml', name: 'മലയാളം', flag: 'IN' },
  { code: 'mr', name: 'मराठी', flag: 'IN' },
  { code: 'ms', name: 'Bahasa Melayu', flag: 'MY' },
  { code: 'mt', name: 'Malti', flag: 'MT' },
  { code: 'nl', name: 'Nederlands', flag: 'NL' },
  { code: 'no', name: 'Norsk', flag: 'NO' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: 'IN' },
  { code: 'pl', name: 'Polski', flag: 'PL' },
  { code: 'pt', name: 'Português', flag: 'PT' },
  { code: 'qu', name: 'Quechua', flag: 'PE' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
  { code: 'si', name: 'සිංහල', flag: 'LK' },
  { code: 'sk', name: 'Slovenčina', flag: 'SK' },
  { code: 'sl', name: 'Slovenščina', flag: 'SI' },
  { code: 'sq', name: 'Shqip', flag: 'AL' },
  { code: 'sr', name: 'Српски', flag: 'RS' },
  { code: 'sv', name: 'Svenska', flag: 'SE' },
  { code: 'sw', name: 'Kiswahili', flag: 'TZ' },
  { code: 'ta', name: 'தமிழ்', flag: 'IN' },
  { code: 'te', name: 'తెలుగు', flag: 'IN' },
  { code: 'th', name: 'ไทย', flag: 'TH' },
  { code: 'tr', name: 'Türkçe', flag: 'TR' },
  { code: 'uk', name: 'Українська', flag: 'UA' },
  { code: 'ur', name: 'اردو', flag: 'PK', rtl: true },
  { code: 'vi', name: 'Tiếng Việt', flag: 'VN' },
  { code: 'xh', name: 'isiXhosa', flag: 'ZA' },
  { code: 'yo', name: 'Yorùbá', flag: 'NG' },
  { code: 'zh', name: '中文', flag: 'CN' },
  { code: 'zu', name: 'isiZulu', flag: 'ZA' }
];