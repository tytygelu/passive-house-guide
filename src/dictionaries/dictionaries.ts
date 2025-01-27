export type Dictionary = {
  home: {
    title: string
    subtitle: string
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

import { en } from './en'
import { ro } from './ro'
import { de } from './de'
import { fr } from './fr'

const dictionaries = {
  en,
  ro,
  de,
  fr,
}

export const getDictionary = async (locale: string) => dictionaries[locale as keyof typeof dictionaries]
