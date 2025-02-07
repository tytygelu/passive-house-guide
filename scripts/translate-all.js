const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const nodeFetch = require('node-fetch');
const fetch = nodeFetch.default ? nodeFetch.default : nodeFetch;

// Helper function to recursively walk through a directory and list .md/.mdx files
async function walkDir(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'en') {
        const englishFiles = await fs.readdir(res);
        for (const file of englishFiles) {
          const enFilePath = path.join(res, file);
          const fileStats = await fs.stat(enFilePath);
          if (!fileStats.isFile()) {
            console.log(`Skipping ${file} from ${res} because it is not a file.`);
            continue;
          }
          files.push(enFilePath);
        }
      } else {
        const nestedFiles = await walkDir(res);
        files = files.concat(nestedFiles);
      }
    } else if (entry.isFile() && (res.endsWith('.md') || res.endsWith('.mdx'))) {
      files.push(res);
    }
  }
  return files;
}

async function main() {
  try {
    // Read languages from data/languages.json
    const languagesData = await fs.readFile(path.join(__dirname, '../data/languages.json'), 'utf-8');
    const languages = JSON.parse(languagesData);
    if (!Array.isArray(languages)) {
      throw new Error('Languages JSON is not an array');
    }

    // Base directory for content
    const baseDir = path.join(__dirname, '../src/content');

    // Walk through all directories and files within baseDir
    const files = await walkDir(baseDir);

    // Process translation for each language (except English)
    for (const file of files) {
      const group = path.basename(path.dirname(path.dirname(file))); // Get the parent directory name as the group
      console.log(`Processing ${file} from ${group}`);
      for (const lang of languages) {
        if (lang === 'en') continue;
        console.log(`Translating ${file} for language: ${lang}`);
        await translateArticle(lang, file, group);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function translateArticle(lang, articlePath, group) {
  try {
    // Compute relativePath from the EN folder to the current article
    const relativePath = path.relative(path.join(__dirname, '../src/content', group, 'en'), articlePath);
    // Determine the output folder for the translated file
    const outputFolder = path.join(__dirname, '../src/content', group, lang);
    // Create the output folder if it doesn't exist
    await fs.mkdir(outputFolder, { recursive: true });
    // Determine the output path for the translated file
    const outputPath = path.join(outputFolder, relativePath);

    let skip = false;
    try {
      await fs.access(outputPath);
      // If file exists, read its content
      const existingContent = await fs.readFile(outputPath, 'utf8');
      // Only skip if the file is non-empty and does NOT contain a failure message
      if (existingContent.trim().length > 0 && !existingContent.includes('TRANSLATION FAILED')) {
        console.log(`Skipping translation for ${group}/${relativePath} in ${lang} because file already exists and appears valid.`);
        skip = true;
      } else {
        console.log(`Translating ${group}/${relativePath} in ${lang} because the file exists but is empty or contains failure message.`);
      }
    } catch (err) {
      // File does not exist, proceed with translation
    }
    if (skip) return;

    const content = await fs.readFile(articlePath, 'utf8');
    const chunks = splitContent(content);
    let translatedContent = '';
    const langMapping = {
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
      "lo": "Lao"
    };

    for (const [index, chunk] of chunks.entries()) {
      const langFull = langMapping[lang] || lang;
      const prompt = `Translate this MARKDOWN from English to ${langFull} (section ${index + 1}/${chunks.length}). PRESERVE MARKDOWN FORMATTING AND HEADER LEVELS:\n\n${chunk}`;
      let success = false;
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log('Translating with prompt:', prompt);
          const openaiApiKey = process.env.OPENAI_API_KEY;
          if (!openaiApiKey) {
            throw new Error('Missing OpenAI API key in OPENAI_API_KEY environment variable.');
          }
          const apiUrl = 'https://api.openai.com/v1/chat/completions';
          const requestBody = {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an AI translation assistant. Translate the following markdown text from English to the specified target language while preserving markdown formatting and header levels.' },
              { role: 'user', content: `Translate the following markdown text from English to ${langFull}:\n\n${prompt}` }
            ],
            max_tokens: 1000,
            temperature: 0.3,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          };
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify(requestBody)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (!data.choices || data.choices.length === 0) {
            throw new Error('No completion choices returned by OpenAI.');
          }
          const translatedText = data.choices[0].message.content.trim();
          translatedContent += translatedText + '\n\n';
          console.log(`Translated chunk ${index + 1}/${chunks.length} for ${path.basename(articlePath)}`);
          success = true;
          break;
        } catch (error) {
          console.error(`[${lang}] Error chunk ${index + 1} (attempt ${attempt}): ${error.message.slice(0,200)}`);
          await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
        }
      }
      if (!success) {
        translatedContent += `<!-- TRANSLATION FAILED AFTER 3 RETRIES -->\n\n`;
      }
    }
    await fs.writeFile(outputPath, translatedContent.trim());
    console.log(`Translation for ${group}/${relativePath} in ${lang} saved to ${outputPath}`);
  } catch (error) {
    console.error(`Translation failed for ${lang}:`, error.message);
  }
}

const splitContent = (content, chunkSize = 1000) => {
  const chunks = [];
  let currentChunk = '';
  const lines = content.split('\n');

  for (const line of lines) {
    if (currentChunk.length + line.length > chunkSize && line.match(/^#+\s/)) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += line + '\n';
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};

main();
