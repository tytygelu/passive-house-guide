type Dictionary = {
  navigation: Record<string, string>;
  title: string;
  subtitle: string;
  sections: {
    calculator: {
      title: string;
      description: string;
    };
    materials: {
      title: string;
      description: string;
    };
    case_studies: {
      title: string;
      description: string;
    };
    contact: {
      title: string;
      description: string;
    };
  };
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
    },
    title: 'Passive House Guide',
    subtitle: 'Your comprehensive resource for sustainable building',
    sections: {
      calculator: {
        title: 'Energy Calculator',
        description: 'Calculate the energy efficiency of your building'
      },
      materials: {
        title: 'Building Materials',
        description: 'Discover high-performance building materials and technical systems'
      },
      case_studies: {
        title: 'Case Studies',
        description: 'Real-world examples of passive house projects'
      },
      contact: {
        title: 'Contact Us',
        description: 'Get in touch with our team'
      }
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
    },
    title: 'Ghid Case Pasive',
    subtitle: 'Resursa ta completă pentru construcții sustenabile',
    sections: {
      calculator: {
        title: 'Calculator Energie',
        description: 'Calculează eficiența energetică a clădirii tale'
      },
      materials: {
        title: 'Materiale de Construcție',
        description: 'Descoperă materiale și sisteme tehnice de înaltă performanță'
      },
      case_studies: {
        title: 'Studii de Caz',
        description: 'Exemple reale de case pasive'
      },
      contact: {
        title: 'Contact',
        description: 'Contactează echipa noastră'
      }
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
    },
    title: 'Passivhaus-Leitfaden',
    subtitle: 'Ihre umfassende Ressource für nachhaltiges Bauen',
    sections: {
      calculator: {
        title: 'Energierechner',
        description: 'Berechnen Sie die Energieeffizienz Ihres Gebäudes'
      },
      materials: {
        title: 'Baumaterialien',
        description: 'Entdecken Sie hochleistungsfähige Baumaterialien und technische Systeme'
      },
      case_studies: {
        title: 'Fallstudien',
        description: 'Praxisbeispiele von Passivhausprojekten'
      },
      contact: {
        title: 'Kontakt',
        description: 'Nehmen Sie Kontakt mit unserem Team auf'
      }
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
    },
    title: 'Guide Maison Passive',
    subtitle: 'Votre ressource complète pour la construction durable',
    sections: {
      calculator: {
        title: 'Calculateur Énergie',
        description: 'Calculez l\'efficacité énergétique de votre bâtiment'
      },
      materials: {
        title: 'Matériaux de Construction',
        description: 'Découvrez des matériaux et systèmes techniques haute performance'
      },
      case_studies: {
        title: 'Études de Cas',
        description: 'Exemples réels de maisons passives'
      },
      contact: {
        title: 'Contact',
        description: 'Contactez notre équipe'
      }
    }
  }
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.en;
}
