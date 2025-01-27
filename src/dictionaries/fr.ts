// src/dictionaries/fr.ts (French - Pentru piața franceză importantă)
import { Dictionary } from './dictionaries'

export const fr: Dictionary = {
  home: {
    title: 'Guide Maison Passive',
    subtitle: 'Votre ressource complète pour la construction durable',
    menu: {
      principles: 'Principes',
      materials: 'Matériaux',
      calculator: 'Calculateur Énergie',
      projects: 'Projets',
      contact: 'Contact'
    },
    sections: {
      principles: {
        title: 'Principes',
        description: 'Découvrez les principes fondamentaux de la conception des maisons passives'
      },
      materials: {
        title: 'Matériaux de Construction',
        description: 'Découvrez des matériaux et systèmes techniques haute performance'
      },
      certification: {
        title: 'Certification',
        description: 'Obtenez la certification et rejoignez la communauté des maisons passives'
      },
      calculator: {
        title: 'Calculateur Énergie',
        description: 'Calculez l\'efficacité énergétique de votre bâtiment'
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
    features: {
      title: 'Caractéristiques Clés',
      items: [
        'Efficacité énergétique supérieure',
        'Excellent confort thermique',
        'Haute qualité de l\'air intérieur',
        'Construction durable'
      ]
    }
  },
  cookies: {
    title: 'Cookies',
    description: 'Nous utilisons des cookies pour améliorer votre expérience.',
    accept: 'Accepter',
    decline: 'Refuser'
  },
  footer: {
    contact: {
      email: 'Email: contact@zeroenergy.casa',
      phone: 'Téléphone: +40 123 456 789',
      address: 'Adresse: Bucarest, Roumanie'
    }
  }
}