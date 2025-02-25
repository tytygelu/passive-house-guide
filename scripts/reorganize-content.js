const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content');
const postsDir = path.join(contentDir, 'posts');

// Create posts directory if it doesn't exist
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir);
}

// Process materials and principles
['materials', 'principles'].forEach(category => {
  const categoryDir = path.join(contentDir, category);
  
  if (fs.existsSync(categoryDir)) {
    // Get all language directories
    const langDirs = fs.readdirSync(categoryDir)
      .filter(item => {
        const itemPath = path.join(categoryDir, item);
        return fs.statSync(itemPath).isDirectory() && item !== '.git';
      });

    // Process each language directory
    langDirs.forEach(lang => {
      const langDir = path.join(categoryDir, lang);
      const targetLangDir = path.join(postsDir, lang);
      
      // Create language directory in posts if it doesn't exist
      if (!fs.existsSync(targetLangDir)) {
        fs.mkdirSync(targetLangDir, { recursive: true });
      }

      // Move all files from the language directory
      const files = fs.readdirSync(langDir)
        .filter(file => file.endsWith('.mdx'));

      files.forEach(file => {
        const sourcePath = path.join(langDir, file);
        const targetPath = path.join(targetLangDir, file);
        
        // Read the file content
        const content = fs.readFileSync(sourcePath, 'utf8');
        
        // Write to the new location
        fs.writeFileSync(targetPath, content);
        
        // Delete the original file
        fs.unlinkSync(sourcePath);
      });
    });

    // Remove empty directories
    fs.rmSync(categoryDir, { recursive: true, force: true });
  }
});

console.log('Content reorganization complete!');
