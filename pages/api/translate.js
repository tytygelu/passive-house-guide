import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  
  const { targetLanguage, text } = req.body;
  if (!targetLanguage || !text) {
    return res.status(400).json({ error: 'Missing parameters: targetLanguage and text are required.' });
  }

  const prompt = `Translate the following text from English to ${targetLanguage}:\n\n${text}`;
  const command = `ollama run lauchacarro/qwen2.5-translator:latest --prompt "${prompt}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(stderr);
    }
    res.status(200).json({ translation: stdout });
  });
}
