// European languages
import { en } from './en'
import { ro } from './ro'
import { de } from './de'
import { fr } from './fr'
import { it } from './it'
import { es } from './es'
import { nl } from './nl'
import { pl } from './pl'
import { sv } from './sv'
import { no } from './no'
import { da } from './da'
import { fi } from './fi'
import { pt } from './pt'
import { cs } from './cs'
import { sk } from './sk'
import { hu } from './hu'
import { el } from './el'
import { bg } from './bg'
import { hr } from './hr'
import { sl } from './sl'
import { et } from './et'
import { lv } from './lv'
import { lt } from './lt'
import { ga } from './ga'
import { is } from './is'
import { mt } from './mt'
import { lb } from './lb'
import { sq } from './sq'
import { mk } from './mk'
import { sr } from './sr'
import { bs } from './bs'
import { ua } from './ua'

// Asian languages
import { zh } from './zh'
import { ja } from './ja'
import { ko } from './ko'
import { hi } from './hi'
import { bn } from './bn'
import { ur } from './ur'
import { ar } from './ar'
import { fa } from './fa'
import { he } from './he'
import { th } from './th'
import { vi } from './vi'
import { id } from './id'
import { ms } from './ms'

// African languages
import { sw } from './sw'
import { am } from './am'
import { ha } from './ha'
import { yo } from './yo'
import { zu } from './zu'
import { xh } from './xh'
import { af } from './af'

// American languages
import { enUs } from './en-us'
import { esMx } from './es-mx'
import { ptBR as ptBr } from './pt-br'
import { esAr } from './es-ar'
import { qu } from './qu'
import { ay } from './ay'
import { gn } from './gn'

export type Dictionary = {
  home: {
    title: string
    subtitle: string
    description: string
    learnMore: string
    readMore: string
    latestArticles: string
    viewAll: string
    menu: {
      principles: string
      materials: string
      calculator: string
      projects: string
      contact: string
    }
    sections: {
      principles: {
        title: string
        description: string
      }
      materials: {
        title: string
        description: string
      }
      certification: {
        title: string
        description: string
      }
      calculator: {
        title: string
        description: string
      }
      case_studies: {
        title: string
        description: string
      }
      contact: {
        title: string
        description: string
      }
    }
    features: {
      title: string
      items: string[]
    }
  }
  privacy: {
    title: string
    introduction: {
      title: string
      content: string
    }
    dataCollection: {
      title: string
      content: string
      items: string[]
    }
    cookies: {
      title: string
      content: string
      googleLink: string
      linkText: string
    }
    contact: {
      title: string
      content: string
    }
  }
  cookies: {
    title: string
    description: string
    accept: string
    decline: string
  }
  footer: {
    about: {
      title: string
      description: string
    }
    quickLinks: {
      title: string
      privacy: string
      contact: string
    }
    contact: {
      title: string
      email: string
    }
    rights: string
  }
}

type LocaleType = 'en' | 'ro' | 'de' | 'fr' | 'it' | 'es' | 'nl' | 'pl' | 'sv' | 'no' | 'da' | 'fi' | 'pt' | 'cs' | 'sk' | 'hu' | 'el' | 'bg' | 'hr' | 'sl' | 'et' | 'lv' | 'lt' | 'ga' | 'is' | 'mt' | 'lb' | 'sq' | 'mk' | 'sr' | 'bs' | 'ua' | 'zh' | 'ja' | 'ko' | 'hi' | 'bn' | 'ur' | 'ar' | 'fa' | 'he' | 'th' | 'vi' | 'id' | 'ms' | 'sw' | 'am' | 'ha' | 'yo' | 'zu' | 'xh' | 'af' | 'en-us' | 'es-mx' | 'pt-br' | 'es-ar' | 'qu' | 'ay' | 'gn';

const dictionaries: Record<LocaleType, Dictionary> = {
  en,
  ro,
  de,
  fr,
  it,
  es,
  nl,
  pl,
  sv,
  no,
  da,
  fi,
  pt,
  cs,
  sk,
  hu,
  el,
  bg,
  hr,
  sl,
  et,
  lv,
  lt,
  ga,
  is,
  mt,
  lb,
  sq,
  mk,
  sr,
  bs,
  ua,
  zh,
  ja,
  ko,
  hi,
  bn,
  ur,
  ar,
  fa,
  he,
  th,
  vi,
  id,
  ms,
  sw,
  am,
  ha,
  yo,
  zu,
  xh,
  af,
  'en-us': enUs,
  'es-mx': esMx,
  'pt-br': ptBr,
  'es-ar': esAr,
  qu,
  ay,
  gn,
}

export function getDictionary(locale: string) {
  return (dictionaries[locale as LocaleType] ?? dictionaries.en)
}
