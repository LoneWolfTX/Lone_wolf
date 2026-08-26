const fs = require('fs');

const userCities = [
  'Addison', 'Arlington', 'Bedford', 'Blue Mound', 'Carrollton', 'Cedar Hill', 
  'Cockrell Hill', 'Colleyville', 'Coppell', 'Dallas', 'DeSoto', 'Double Oak', 
  'Duncanville', 'Edgecliff Village', 'Euless', 'Everman', 'Farmers Branch', 
  'Flower Mound', 'Forest Hill', 'Fort Worth', 'Grand Prairie', 'Grapevine', 
  'Haltom City', 'Haslet', 'Highland Park', 'Highland Village', 'Hurst', 
  'Irving', 'Keller', 'Kennedale', 'Lake Worth', 'Lakeside', 'Lewisville', 
  'Mansfield', 'North Richland Hills', 'Northlake', 'Richland Hills', 
  'River Oaks', 'Roanoke', 'Saginaw', 'Sansom Park', 'Southlake', 
  'The Colony', 'Trophy Club', 'University Park', 'Watauga', 'Westlake', 
  'White Settlement'
];

const serviceAreasContent = fs.readFileSync('src/data/serviceAreas.ts', 'utf8');

const matched = [];
const missing = [];

userCities.forEach(city => {
  const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const hasName = serviceAreasContent.toLowerCase().includes(city.toLowerCase());
  const hasSlug = serviceAreasContent.includes(`slug: '${slug}'`);
  
  if (hasName || hasSlug) {
    matched.push({ city, slug, hasSlug });
  } else {
    missing.push({ city, slug });
  }
});

console.log('Total user cities:', userCities.length);
console.log('Found in file (' + matched.length + '):', matched.map(m => m.city + (m.hasSlug ? ' [has dynamic page]' : ' [mentioned only]')));
console.log('Missing completely (' + missing.length + '):', missing);
