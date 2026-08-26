const fs = require('fs');
const path = require('path');

const domain = 'https://lonewolfdumpsters.com';

const coreRoutes = [
  '',
  '/about',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/dumpster-rentals',
  '/dumpster-rentals/15-yard',
  '/dumpster-rentals/20-yard',
  '/dumpster-rentals/25-yard',
  '/dumpster-rentals/residential',
  '/dumpster-rentals/contractor',
  '/dumpster-rentals/commercial',
  '/junk-removal',
  '/service-areas',
  '/blog',
];

const blogSlugs = [
  'what-size-dumpster-for-home-cleanout',
  'how-much-does-dumpster-rental-cost-dfw',
  '15-vs-20-yard-dumpster',
  'can-roofing-shingles-go-in-a-dumpster',
  'what-items-are-prohibited-in-a-dumpster',
  'contractor-dumpster-rental-tips-dfw',
];

// Extract 48 cities from cityServiceAreas.ts
const cityServiceAreasContent = fs.readFileSync(path.join(__dirname, '../src/data/cityServiceAreas.ts'), 'utf8');
const citySlugsMatches = [...cityServiceAreasContent.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);
const uniqueCitySlugs = [...new Set(citySlugsMatches)];

console.log(`Found ${uniqueCitySlugs.length} unique city slugs for sitemap.`);

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add Core Routes
coreRoutes.forEach((route) => {
  const priority = route === '' ? '1.0' : '0.8';
  xml += `  <url>\n`;
  xml += `    <loc>${domain}${route}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  xml += `  </url>\n`;
});

// Add Blog Posts
blogSlugs.forEach((slug) => {
  xml += `  <url>\n`;
  xml += `    <loc>${domain}/blog/${slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += `  </url>\n`;
});

// Add 48 Service Area City Pages
uniqueCitySlugs.forEach((slug) => {
  xml += `  <url>\n`;
  xml += `    <loc>${domain}/service-areas/${slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>0.65</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>\n`;

// Write to public/sitemap.xml
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
console.log('Successfully generated public/sitemap.xml');
