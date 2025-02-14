// Install slugify library by running npm install slugify or yarn add slugify
const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const nodeFetch = require('node-fetch');
const fetch = nodeFetch.default ? nodeFetch.default : nodeFetch;
const slugify = require('slugify');

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
    
    // Split content into frontmatter and body
    const parts = content.split('---\n');
    if (parts.length < 3) {
      throw new Error('Invalid frontmatter format');
    }

    // Keep the frontmatter as is, but translate the body
    const frontmatter = parts[1];
    const body = parts.slice(2).join('---\n');

    // Split body into chunks and translate
    const chunks = splitContent(body);
    let translatedBody = '';
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

    const excludedFields = ['author', 'date', 'image', 'image_alt', 'image_caption', 'image_credit', 'image_license', 'image_source', 'image_source_url', 'image_source_url_text', 'image_source_license', 'slug', 'coverImage', 'url'];

    // For each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Translating chunk ${i + 1}/${chunks.length} for ${relativePath} in ${lang}`);
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are a professional translator. Translate the following text from English to ${langMapping[lang] || lang}. Preserve all Markdown formatting, links, and code blocks exactly as they are. Do not translate text within code blocks or URLs.`
              },
              {
                role: "user",
                content: chunk
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

        translatedBody += data.choices[0].message.content + '\n';
        
        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error translating chunk ${i + 1} for ${relativePath} in ${lang}:`, error);
        throw error;
      }
    }

    // Combine frontmatter with translated body
    const translatedContent = `---\n${frontmatter}---\n${translatedBody}`;
    
    // Write the translated content
    await fs.writeFile(outputPath, translatedContent);
    console.log(`Successfully translated ${group}/${relativePath} to ${lang}`);
  } catch (error) {
    console.error(`Error translating ${articlePath} to ${lang}:`, error);
    throw error;
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
