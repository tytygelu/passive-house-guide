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
  cookies: {
    title: 'Consimțământ Cookie',
    description: 'Folosim cookie-uri pentru a îmbunătăți experiența dvs.',
    accept: 'Accept',
    decline: 'Refuz'
  },
  footer: {
    social: {
      title: 'Social Media'
    },
    contact: {
      title: 'Contact',
      email: 'zero.energy.passive.house@gmail.com'
    }
  }
}