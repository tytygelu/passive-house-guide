const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.zeroenergy.casa';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Dynamically load language codes from the 'src/dictionaries' directory
const dictionariesDir = path.join(__dirname, '..', 'src', 'dictionaries');
let languages = fs.readdirSync(dictionariesDir)
  .filter(file => file.endsWith('.ts') && file !== 'index.ts' && file !== 'dictionaries.ts')
  .map(file => file.replace('.ts', ''));

// Define default homepage language as empty string if not already included
const defaultLang = '';
if (!languages.includes(defaultLang)) { languages.unshift(defaultLang); }

// Define the routes of your website. Add or update as needed.
const routes = ['/', '/principles/insulation', '/principles/ventilation'];

// Use the current date as the lastmod date in YYYY-MM-DD format
const lastmod = new Date().toISOString().split('T')[0];

// Helper function to generate the full URL based on language and route
function generateUrl(language, route) {
  // If language is provided and route is not the root
  if (language && route !== '/') {
    return `${BASE_URL}/${language}${route}`;
  }
  return `${BASE_URL}${route}`;
}

let urlsXml = '';

// New loop: generate homepage only once and for other routes iterate over all languages
routes.forEach(route => {
  if(route === '/') {
    const url = generateUrl(defaultLang, route);
    urlsXml += '  <url>\n';
    urlsXml += `    <loc>${url}</loc>\n`;
    urlsXml += `    <lastmod>${lastmod}</lastmod>\n`;
    urlsXml += '    <changefreq>weekly</changefreq>\n';
    urlsXml += '    <priority>1.0</priority>\n';
    urlsXml += '  </url>\n';
  } else {
    languages.forEach(lang => {
      const url = generateUrl(lang, route);
      urlsXml += '  <url>\n';
      urlsXml += `    <loc>${url}</loc>\n`;
      urlsXml += `    <lastmod>${lastmod}</lastmod>\n`;
      urlsXml += '    <changefreq>monthly</changefreq>\n';
      urlsXml += '    <priority>0.8</priority>\n';
      urlsXml += '  </url>\n';
    });
  }
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}</urlset>\n`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent, 'utf8');

console.log('Sitemap generated at ' + path.join(PUBLIC_DIR, 'sitemap.xml'));
