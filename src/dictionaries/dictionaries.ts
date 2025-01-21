type Dictionary = {
  navigation: Record<string, string>;
}

const dictionaries: Record<string, Dictionary> = {
  en: {
    navigation: {
      home: 'Home',
      principles: 'Principles',
      materials: 'Materials',
      calculator: 'Energy Calculator',
      case_studies: 'Case Studies',
      contact: 'Contact'
    }
  },
  ro: {
    navigation: {
      home: 'Acasă',
      principles: 'Principii',
      materials: 'Materiale',
      calculator: 'Calculator Energie',
      case_studies: 'Studii de Caz',
      contact: 'Contact'
    }
  },
  de: {
    navigation: {
      home: 'Startseite',
      principles: 'Prinzipien',
      materials: 'Materialien',
      calculator: 'Energierechner',
      case_studies: 'Fallstudien',
      contact: 'Kontakt'
    }
  },
  fr: {
    navigation: {
      home: 'Accueil',
      principles: 'Principes',
      materials: 'Matériaux',
      calculator: 'Calculateur Énergie',
      case_studies: 'Études de Cas',
      contact: 'Contact'
    }
  }
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.en;
}
