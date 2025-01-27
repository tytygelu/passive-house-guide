// src/dictionaries/en.ts (English - Limba principală)
import { Dictionary } from './dictionaries'

export const en: Dictionary = {
  home: {
    title: 'Passive House Guide',
    subtitle: 'Your comprehensive resource for sustainable building',
    menu: {
      principles: 'Principles',
      materials: 'Materials',
      calculator: 'Energy Calculator',
      projects: 'Projects',
      contact: 'Contact'
    },
    sections: {
      principles: {
        title: 'Principles',
        description: 'Learn about the fundamental principles of passive house design'
      },
      materials: {
        title: 'Building Materials',
        description: 'Discover high-performance building materials and technical systems'
      },
      certification: {
        title: 'Certification',
        description: 'Get certified and join the passive house community'
      },
      calculator: {
        title: 'Energy Calculator',
        description: 'Calculate the energy efficiency of your building'
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
    features: {
      title: 'Key Features',
      items: [
        'Superior energy efficiency',
        'Excellent thermal comfort',
        'High indoor air quality',
        'Sustainable construction'
      ]
    }
  },
  cookies: {
    title: 'Cookies',
    description: 'We use cookies to improve your experience.',
    accept: 'Accept',
    decline: 'Decline'
  },
  footer: {
    contact: {
      email: 'Email: contact@zeroenergy.casa',
      phone: 'Phone: +40 123 456 789',
      address: 'Address: Bucharest, Romania'
    }
  }
}