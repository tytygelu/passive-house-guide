// src/dictionaries/ro.ts (Romanian - Pentru piața locală)
import { Dictionary } from './dictionaries'

export const ro: Dictionary = {
  home: {
    title: 'Ghid Case Pasive',
    subtitle: 'Resursa ta completă pentru construcții sustenabile',
    menu: {
      principles: 'Principii',
      materials: 'Materiale',
      calculator: 'Calculator Energie',
      projects: 'Proiecte',
      contact: 'Contact'
    },
    sections: {
      principles: {
        title: 'Principii',
        description: 'Află despre principiile fundamentale ale caselor pasive'
      },
      materials: {
        title: 'Materiale de Construcție',
        description: 'Descoperă materiale și sisteme tehnice de înaltă performanță'
      },
      certification: {
        title: 'Certificare',
        description: 'Obține certificarea și alătură-te comunității caselor pasive'
      },
      calculator: {
        title: 'Calculator Energie',
        description: 'Calculează eficiența energetică a clădirii tale'
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
    features: {
      title: 'Caracteristici Cheie',
      items: [
        'Eficiență energetică superioară',
        'Confort termic excelent',
        'Calitate ridicată a aerului interior',
        'Construcție sustenabilă'
      ]
    }
  },
  privacy: {
    title: 'Politica de Confidențialitate',
    introduction: {
      title: 'Introducere',
      content: 'Această Politică de Confidențialitate explică modul în care colectăm, folosim și protejăm informațiile dvs. personale atunci când utilizați site-ul nostru.'
    },
    dataCollection: {
      title: 'Colectarea și Utilizarea Datelor',
      content: 'Colectăm și procesăm anumite informații atunci când vizitați site-ul nostru. Acestea includ:',
      items: [
        'Informații despre vizitele dvs. prin Google Analytics',
        'Preferințele și setările dvs.',
        'Informații tehnice despre dispozitivul și conexiunea dvs. la internet',
        'Informațiile pe care ni le furnizați când ne contactați'
      ]
    },
    cookies: {
      title: 'Cookie-uri și Publicitate',
      content: 'Folosim cookie-uri și tehnologii similare pentru a îmbunătăți experiența dvs. de navigare și pentru a vă arăta conținut și reclame personalizate prin Google AdSense.',
      googleLink: 'Pentru a afla mai multe despre modul în care Google folosește datele când utilizați site-ul nostru, vă rugăm să vizitați:',
      linkText: 'Cum folosește Google datele când utilizați site-urile sau aplicațiile partenerilor noștri'
    },
    contact: {
      title: 'Contact',
      content: 'Dacă aveți întrebări despre Politica noastră de Confidențialitate, vă rugăm să ne contactați prin pagina de contact.'
    }
  },
  cookies: {
    title: 'Consimțământ Cookie',
    description: 'Folosim cookie-uri pentru a îmbunătăți experiența dvs.',
    accept: 'Accept',
    decline: 'Refuz'
  },
  footer: {
    about: {
      title: 'Despre Noi',
      description: 'Ghidul tău complet pentru construcția caselor pasive, ajutându-te să construiești case sustenabile și eficiente energetic.'
    },
    quickLinks: {
      title: 'Link-uri Rapide',
      privacy: 'Politica de Confidențialitate',
      contact: 'Contact'
    },
    contact: {
      title: 'Contact',
      email: 'contact@passivehouseguide.com'
    },
    rights: 'Toate drepturile rezervate.'
  }
}