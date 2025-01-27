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
  privacy: {
    title: 'Privacy Policy',
    introduction: {
      title: 'Introduction',
      content: 'This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.'
    },
    dataCollection: {
      title: 'Data Collection and Use',
      content: 'We collect and process certain information when you visit our website. This includes:',
      items: [
        'Information about your visits through Google Analytics',
        'Your preferences and settings',
        'Technical information about your device and internet connection',
        'Information you provide when contacting us'
      ]
    },
    cookies: {
      title: 'Cookies and Advertising',
      content: 'We use cookies and similar technologies to improve your browsing experience and to show you personalized content and advertisements through Google AdSense.',
      googleLink: 'To learn more about how Google uses data when you use our site, please visit:',
      linkText: 'How Google uses data when you use our partners\' sites or apps'
    },
    contact: {
      title: 'Contact Us',
      content: 'If you have any questions about our Privacy Policy, please contact us through our contact page.'
    }
  },
  cookies: {
    title: 'Cookie Consent',
    description: 'We use cookies to enhance your experience.',
    accept: 'Accept',
    decline: 'Decline'
  },
  footer: {
    about: {
      title: 'About Us',
      description: 'Your comprehensive guide to passive house construction, helping you build sustainable and energy-efficient homes.'
    },
    quickLinks: {
      title: 'Quick Links',
      privacy: 'Privacy Policy',
      contact: 'Contact Us'
    },
    contact: {
      title: 'Contact',
      email: 'contact@passivehouseguide.com'
    },
    rights: 'All rights reserved.'
  }
}