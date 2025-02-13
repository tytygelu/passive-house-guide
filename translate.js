// translate.js
// Acest script utilizeaza modelul Ollama qwen2.5-translator:latest pentru a traduce text din engleza in limba tinta specificata.
// Utilizare: node translate.js <targetLanguage> <text to translate>

const { exec } = require('child_process');

const targetLanguage = process.argv[2];
const text = process.argv.slice(3).join(' ');

if (!targetLanguage || !text) {
  console.error('Usage: node translate.js <targetLanguage> <text to translate>');
  process.exit(1);
}

const prompt = `Translate the following text from English to ${targetLanguage}:\n\n${text}`;

// Comanda de rulare pentru modelul local cu Ollama
const command = `ollama run lauchacarro/qwen2.5-translator:latest --prompt "${prompt}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`Translation result:\n${stdout}`);
});
