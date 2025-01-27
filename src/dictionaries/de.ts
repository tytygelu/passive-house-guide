// src/dictionaries/de.ts (German - Pentru piața germană)
import { Dictionary } from './dictionaries'

export const de: Dictionary = {
  home: {
    title: 'Passivhaus-Leitfaden',
    subtitle: 'Ihre umfassende Ressource für nachhaltiges Bauen',
    menu: {
      principles: 'Prinzipien',
      materials: 'Materialien',
      calculator: 'Energierechner',
      projects: 'Projekte',
      contact: 'Kontakt'
    },
    sections: {
      principles: {
        title: 'Prinzipien',
        description: 'Lernen Sie die grundlegenden Prinzipien des Passivhausbaus kennen'
      },
      materials: {
        title: 'Baumaterialien',
        description: 'Entdecken Sie hochwertige Baumaterialien und technische Systeme'
      },
      certification: {
        title: 'Zertifizierung',
        description: 'Lassen Sie sich zertifizieren und werden Sie Teil der Passivhaus-Gemeinschaft'
      },
      calculator: {
        title: 'Energierechner',
        description: 'Berechnen Sie die Energieeffizienz Ihres Gebäudes'
      },
      case_studies: {
        title: 'Fallstudien',
        description: 'Reale Beispiele von Passivhausprojekten'
      },
      contact: {
        title: 'Kontakt',
        description: 'Kontaktieren Sie unser Team'
      }
    },
    features: {
      title: 'Hauptmerkmale',
      items: [
        'Überlegene Energieeffizienz',
        'Ausgezeichneter thermischer Komfort',
        'Hohe Raumluftqualität',
        'Nachhaltiges Bauen'
      ]
    }
  },
  privacy: {
    title: 'Datenschutzerklärung',
    introduction: {
      title: 'Einführung',
      content: 'Diese Datenschutzerklärung erläutert, wie wir Ihre personenbezogenen Daten bei der Nutzung unserer Website erfassen, verwenden und schützen.'
    },
    dataCollection: {
      title: 'Datenerfassung und -verwendung',
      content: 'Wir erfassen und verarbeiten bestimmte Informationen, wenn Sie unsere Website besuchen. Dazu gehören:',
      items: [
        'Informationen über Ihre Besuche durch Google Analytics',
        'Ihre Präferenzen und Einstellungen',
        'Technische Informationen über Ihr Gerät und Ihre Internetverbindung',
        'Informationen, die Sie uns bei der Kontaktaufnahme zur Verfügung stellen'
      ]
    },
    cookies: {
      title: 'Cookies und Werbung',
      content: 'Wir verwenden Cookies und ähnliche Technologien, um Ihr Browsing-Erlebnis zu verbessern und Ihnen personalisierte Inhalte und Anzeigen durch Google AdSense anzuzeigen.',
      googleLink: 'Um mehr darüber zu erfahren, wie Google Daten verwendet, wenn Sie unsere Website nutzen, besuchen Sie bitte:',
      linkText: 'Wie Google Daten verwendet, wenn Sie die Websites oder Apps unserer Partner nutzen'
    },
    contact: {
      title: 'Kontakt',
      content: 'Wenn Sie Fragen zu unserer Datenschutzerklärung haben, kontaktieren Sie uns bitte über unsere Kontaktseite.'
    }
  },
  cookies: {
    title: 'Cookie-Zustimmung',
    description: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen'
  },
  footer: {
    about: {
      title: 'Über Uns',
      description: 'Ihr umfassender Leitfaden für den Passivhausbau, der Ihnen hilft, nachhaltige und energieeffiziente Häuser zu bauen.'
    },
    quickLinks: {
      title: 'Schnellzugriff',
      privacy: 'Datenschutzerklärung',
      contact: 'Kontakt'
    },
    contact: {
      title: 'Kontakt',
      email: 'contact@passivehouseguide.com'
    },
    rights: 'Alle Rechte vorbehalten.'
  }
}