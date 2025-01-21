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
  footer: {
    about: {
      title: string;
      description: string;
    };
    social: {
      title: string;
      follow: string;
      twitter: string;
      linkedin: string;
      github: string;
    };
    contact: {
      title: string;
      email: string;
      phone: string;
      address: string;
    };
    copyright: string;
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
    },
    footer: {
      about: {
        title: 'About Us',
        description: 'We help you build sustainable, energy-efficient homes that respect the environment and reduce energy costs.'
      },
      social: {
        title: 'Connect',
        follow: 'Follow us',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        github: 'GitHub'
      },
      contact: {
        title: 'Contact',
        email: 'Email: contact@zeroenergy.casa',
        phone: 'Phone: +40 123 456 789',
        address: 'Address: Bucharest, Romania'
      },
      copyright: ' 2025 Passive House Guide. All rights reserved.'
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
    },
    footer: {
      about: {
        title: 'Despre Noi',
        description: 'Te ajutăm să construiești case sustenabile și eficiente energetic care respectă mediul și reduc costurile cu energia.'
      },
      social: {
        title: 'Conectează-te',
        follow: 'Urmărește-ne',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        github: 'GitHub'
      },
      contact: {
        title: 'Contact',
        email: 'Email: contact@zeroenergy.casa',
        phone: 'Telefon: +40 123 456 789',
        address: 'Adresă: București, România'
      },
      copyright: ' 2025 Ghid Case Pasive. Toate drepturile rezervate.'
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
    },
    footer: {
      about: {
        title: 'Über Uns',
        description: 'Wir helfen Ihnen beim Bau nachhaltiger, energieeffizienter Häuser, die die Umwelt respektieren und Energiekosten senken.'
      },
      social: {
        title: 'Verbinden',
        follow: 'Folgen Sie uns',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        github: 'GitHub'
      },
      contact: {
        title: 'Kontakt',
        email: 'E-Mail: contact@zeroenergy.casa',
        phone: 'Telefon: +40 123 456 789',
        address: 'Adresse: Bukarest, Rumänien'
      },
      copyright: ' 2025 Passivhaus-Leitfaden. Alle Rechte vorbehalten.'
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
    },
    footer: {
      about: {
        title: 'À Propos',
        description: 'Nous vous aidons à construire des maisons durables et économes en énergie qui respectent l\'environnement et réduisent les coûts énergétiques.'
      },
      social: {
        title: 'Connectez-vous',
        follow: 'Suivez-nous',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        github: 'GitHub'
      },
      contact: {
        title: 'Contact',
        email: 'Email: contact@zeroenergy.casa',
        phone: 'Téléphone: +40 123 456 789',
        address: 'Adresse: Bucarest, Roumanie'
      },
      copyright: ' 2025 Guide Maison Passive. Tous droits réservés.'
    }
  }
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale]
}
