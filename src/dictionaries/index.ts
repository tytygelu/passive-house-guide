// src/dictionaries/index.ts (Fișierul principal care gestionează toate traducerile)
export type DictionaryType = {
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
  contact: {
    title: string
    description: string
    name: string
    email: string
    message: string
    send: string
  }
  principles: {
    title: string
    description: string
  }
  materials: {
    title: string
    description: string
  }
  calculator: {
    title: string
    description: string
  }
  caseStudies: {
    title: string
    description: string
  }
  privacy: {
    title: string
    description: string
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
    allRightsReserved: string
  }
}

import { en } from './en'
import { de } from './de'
import { ro } from './ro'
import { fr } from './fr'

const dictionaries = {
  en,
  de,
  ro,
  fr
}

export type Locale = keyof typeof dictionaries

// Funcție helper pentru a verifica dacă o limbă este suportată
export const isValidLocale = (locale: string): locale is Locale => {
  return locale in dictionaries
}

// Funcția principală pentru obținerea traducerilor
export const getDictionary = (locale: string) => {
  if (isValidLocale(locale)) {
    return dictionaries[locale]
  }
  // Fallback la engleză dacă limba nu este suportată
  return dictionaries.en
}