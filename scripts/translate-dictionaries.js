const fs = require('fs/promises');
const path = require('path');
const fetch = require('node-fetch');

async function main() {
  try {
    // Load languages from data/languages.json
    const languagesData = await fs.readFile(path.join(__dirname, '../data/languages.json'), 'utf-8');
    const languages = JSON.parse(languagesData);
    if (!Array.isArray(languages)) {
      throw new Error('Languages JSON is not an array');
    }

    // Read the English dictionary file
    const enDictPath = path.join(__dirname, '../src/dictionaries/en.ts');
    const enContent = await fs.readFile(enDictPath, 'utf8');

    // For each language (except 'en'), translate the dictionary file
    for (const lang of languages) {
      if (lang === 'en') continue;
      console.log(`Translating dictionary for language: ${lang}`);
      const translatedContent = await translateDictionary(enContent, lang);
      // Save the translated content to src/dictionaries/[lang].ts
      const outputPath = path.join(__dirname, `../src/dictionaries/${lang}.ts`);
      if (outputPath.endsWith('src/dictionaries/dictionaries.ts')) {
        continue;
      }
      await fs.writeFile(outputPath, translatedContent, 'utf8');
      console.log(`Saved translated dictionary to ${outputPath}`);
    }
  } catch (error) {
    console.error('Error during translation process:', error);
  }
}

/**
 * Function to translate dictionary file content.
 * It calls the OpenAI API to translate all human-readable string literals in the file from English to the target language
 * while preserving the code structure intact.
 */
async function translateDictionary(content, lang) {
  const langNames = {
    "en": "English",
    "ro": "Romanian",
    "tr": "Turkish",
    "he": "Hebrew",
    "hi": "Hindi",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "es-ar": "Argentine Spanish",
    "es-mx": "Mexican Spanish",
    "it": "Italian",
    "nl": "Dutch",
    "pt": "Portuguese",
    "pt-br": "Brazilian Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zu": "Zulu",
    "yo": "Yoruba",
    "xh": "Xhosa",
    "sq": "Albanian",
    "qu": "Quechua",
    "mt": "Maltese",
    "lb": "Luxembourgish",
    "ha": "Hausa",
    "gn": "Guarani",
    "ga": "Irish",
    "bs": "Bosnian",
    "ay": "Aymara",
    "lo": "Lao",
    "uk": "Ukrainian"
  };

  const targetLang = langNames[lang] || lang;
  const prompt = `Translate all human-readable string literals in the following TypeScript file from English to ${targetLang.replace("uk", "ua")}. Do not modify any code structure, comments, or variable names; only translate the string values. Return only valid TypeScript code as output, without any extra commentary, markdown formatting, or headers. File content:\n\n${content}`;
  
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API key in OPENAI_API_KEY environment variable.');
  }

  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const maxAttempts = 3;
  let translatedContent = null;

  // Dynamically get fetch function. Use global fetch if available, else import node-fetch.
  const fetchFunc = globalThis.fetch ? globalThis.fetch : (await import('node-fetch')).default;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchFunc(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // adjust model as needed
          messages: [
            { role: 'system', content: 'You are an AI translation assistant.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 3000,
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No completion choices returned by OpenAI.');
      }
      translatedContent = data.choices[0].message.content.trim();
      break;
    } catch (error) {
      console.error(`Error on attempt ${attempt} for language ${lang}: ${error.message}`);
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
    }
  }
  
  return translatedContent;
}

main();
