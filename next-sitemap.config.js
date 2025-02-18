/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.zeroenergy.casa',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const feeds = [
      // Materials feeds
      { loc: '/api/feed/materials/rss', changefreq: 'daily', priority: 0.7 },
      { loc: '/api/feed/materials/atom', changefreq: 'daily', priority: 0.7 },
      { loc: '/api/feed/materials/json', changefreq: 'daily', priority: 0.7 },
      
      // Principles feeds
      { loc: '/api/feed/principles/rss', changefreq: 'daily', priority: 0.7 },
      { loc: '/api/feed/principles/atom', changefreq: 'daily', priority: 0.7 },
      { loc: '/api/feed/principles/json', changefreq: 'daily', priority: 0.7 },
    ]
    
    return feeds
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/api/feed/*'],
      },
    ],
    additionalSitemaps: [
      'https://www.zeroenergy.casa/sitemap.xml',
    ],
  },
}
