'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import translations from '@/data/not-found-translations.json';

// Definim tipul pentru traduceri
type TranslationType = {
  title: string;
  description: string;
  homeButton: string;
};

type TranslationsType = {
  [key: string]: TranslationType;
};

export default function NotFound() {
  const [lang, setLang] = useState('en');
  
  useEffect(() => {
    // Detectăm limba din URL când componenta se montează
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1) {
      const detectedLang = pathSegments[1];
      setLang(detectedLang);
    }
  }, []);
  
  // Obținem traducerea pentru limba detectată sau folosim engleza ca fallback
  const t = (translations as TranslationsType)[lang] || (translations as TranslationsType).en;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
      <p className="text-xl mb-8">{t.description}</p>
      <Link href={`/${lang}`} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        {t.homeButton}
      </Link>
    </div>
  );
}
