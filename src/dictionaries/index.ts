// src/dictionaries/index.ts (Fișierul principal care gestionează toate traducerile)
import { en } from './en'
import { de } from './de'
import { ro } from './ro'
import { fr } from './fr'

const dictionaries = {
  en,
  de,
  ro,
  fr
}

export type Locale = keyof typeof dictionaries

// Funcție helper pentru a verifica dacă o limbă este suportată
export const isValidLocale = (locale: string): locale is Locale => {
  return locale in dictionaries
}

// Funcția principală pentru obținerea traducerilor
export const getDictionary = (locale: string) => {
  if (isValidLocale(locale)) {
    return dictionaries[locale]
  }
  // Fallback la engleză dacă limba nu este suportată
  return dictionaries.en
}