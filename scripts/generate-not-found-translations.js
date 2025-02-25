// Script pentru generarea mesajelor de not-found în toate limbile
const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const nodeFetch = require('node-fetch');
const fetch = nodeFetch.default ? nodeFetch.default : nodeFetch;

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Maparea codurilor de limbă la nume de limbă pentru prompt
const languageNames = {
  'en': 'English',
  'ro': 'Romanian',
  'de': 'German',
  'fr': 'French',
  'it': 'Italian',
  'es': 'Spanish',
  'nl': 'Dutch',
  'pl': 'Polish',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'pt': 'Portuguese',
  'cs': 'Czech',
  'sk': 'Slovak',
  'hu': 'Hungarian',
  'el': 'Greek',
  'bg': 'Bulgarian',
  'hr': 'Croatian',
  'sl': 'Slovenian',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'ga': 'Irish',
  'is': 'Icelandic',
  'mt': 'Maltese',
  'lb': 'Luxembourgish',
  'sq': 'Albanian',
  'mk': 'Macedonian',
  'sr': 'Serbian',
  'bs': 'Bosnian',
  'ru': 'Russian',
  'uk': 'Ukrainian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'hi': 'Hindi',
  'bn': 'Bengali',
  'ur': 'Urdu',
  'ar': 'Arabic',
  'fa': 'Persian',
  'he': 'Hebrew',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ms': 'Malay',
  'sw': 'Swahili',
  'am': 'Amharic',
  'ha': 'Hausa',
  'yo': 'Yoruba',
  'zu': 'Zulu',
  'xh': 'Xhosa',
  'af': 'Afrikaans',
  'es-mx': 'Mexican Spanish',
  'pt-br': 'Brazilian Portuguese',
  'es-ar': 'Argentinian Spanish',
  'qu': 'Quechua',
  'ay': 'Aymara',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'lo': 'Lao',
  'ml': 'Malayalam',
  'mr': 'Marathi',
  'pa': 'Punjabi',
  'si': 'Sinhala',
  'ta': 'Tamil',
  'te': 'Telugu',
  'tr': 'Turkish',
  'gn': 'Guarani'
};

// Mesaje de tradus
const notFoundMessages = {
  title: 'Page Not Found',
  description: 'Sorry, the page you are looking for does not exist.',
  homeButton: 'Return Home'
};

async function fetchWithRetry(url, options, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Translation API returned ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying after ${delay}ms...`);
      await sleep(delay);
      // Increase delay for next retry
      delay *= 2;
    }
  }
}

async function translateText(text, targetLanguage) {
  try {
    const response = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from English to ${languageNames[targetLanguage] || targetLanguage}. Return only the translation, nothing else.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from translation API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

async function generateNotFoundTranslations() {
  const translations = {};
  const languages = Object.keys(languageNames);
  
  console.log(`Generating not-found translations for ${languages.length} languages...`);

  // Adaugă engleza direct (nu necesită traducere)
  translations.en = notFoundMessages;
  
  for (const lang of languages) {
    if (lang === 'en') continue; // Skip English since we already have it
    
    try {
      console.log(`Translating not-found messages to ${lang}...`);
      const title = await translateText(notFoundMessages.title, lang);
      // Așteaptă puțin între solicitări pentru a evita rate limiting
      await sleep(1000);
      
      const description = await translateText(notFoundMessages.description, lang);
      await sleep(1000);
      
      const homeButton = await translateText(notFoundMessages.homeButton, lang);
      
      translations[lang] = {
        title,
        description,
        homeButton
      };
      
      console.log(`Completed translation for ${lang}`);
      
      // Salvează după fiecare limbă în cazul întreruperilor
      await fs.writeFile(
        path.join(__dirname, 'not-found-translations.json'),
        JSON.stringify(translations, null, 2),
        'utf8'
      );
      
      // Așteaptă între limbi pentru a evita rate limiting
      await sleep(2000);
    } catch (error) {
      console.error(`Error translating to ${lang}:`, error);
    }
  }
  
  return translations;
}

async function updateNotFoundComponent(translations) {
  const notFoundPath = path.join(__dirname, '..', 'src', 'app', '[lang]', '[slug]', 'not-found.tsx');
  
  const notFoundCode = `'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Translations for not-found page
const translations = ${JSON.stringify(translations, null, 2)};

export default function NotFound() {
  const [lang, setLang] = useState('en');
  
  useEffect(() => {
    // Detect language from URL when component mounts
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1) {
      const detectedLang = pathSegments[1];
      setLang(detectedLang);
    }
  }, []);
  
  // Get translation for detected language or fall back to English
  const t = translations[lang] || translations.en;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
      <p className="text-xl mb-8">{t.description}</p>
      <Link href={\`/\${lang}\`} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        {t.homeButton}
      </Link>
    </div>
  );
}`;

  await fs.writeFile(notFoundPath, notFoundCode, 'utf8');
  console.log('Updated not-found.tsx with translations');
}

async function main() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is required');
      process.exit(1);
    }
    
    // Verificăm dacă există deja un fișier cu traduceri
    let translations;
    try {
      const existingFile = await fs.readFile(
        path.join(__dirname, 'not-found-translations.json'),
        'utf8'
      );
      translations = JSON.parse(existingFile);
      console.log('Loaded existing translations');
    } catch (error) {
      // Dacă fișierul nu există, generăm noile traduceri
      console.log('No existing translations found. Generating new translations...');
      translations = await generateNotFoundTranslations();
    }
    
    // Actualizăm componenta not-found.tsx cu traducerile
    await updateNotFoundComponent(translations);
    
    console.log('All done!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
