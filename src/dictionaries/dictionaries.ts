export type Dictionary = {
  home: {
    title: string;
    subtitle: string;
    menu: Record<string, string>;
    sections: {
      principles: {
        title: string;
        description: string;
      };
      materials: {
        title: string;
        description: string;
      };
      certification: {
        title: string;
        description: string;
      };
      calculator: {
        title: string;
        description: string;
      };
      case_studies?: {
        title: string;
        description: string;
      };
      contact?: {
        title: string;
        description: string;
      };
    };
    features: {
      title: string;
      items: string[];
    };
  };
  cookies: {
    title: string;
    description: string;
    accept: string;
    decline: string;
  };
  footer: {
    social: {
      title: string;
    };
    contact: {
      title: string;
      email: string;
    };
  };
}

import { en } from './en'
import { ro } from './ro'
import { de } from './de'
import { fr } from './fr'

const dictionaries: Record<string, Dictionary> = {
  en,
  ro,
  de,
  fr,
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  switch (locale) {
    case 'en':
      return (await import('./en')).en
    case 'ro':
      return (await import('./ro')).ro
    case 'de':
      return (await import('./de')).de
    case 'fr':
      return (await import('./fr')).fr
    default:
      return (await import('./en')).en
  }
}
