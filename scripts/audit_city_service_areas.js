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

const content = fs.readFileSync('src/data/cityServiceAreas.ts', 'utf8');

const matched = [];
const missing = [];

userCities.forEach(city => {
  const normCity = city.toLowerCase();
  const slug = normCity.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (content.toLowerCase().includes('"' + normCity + '"') || 
      content.toLowerCase().includes("'" + normCity + "'") ||
      content.toLowerCase().includes('"' + slug + '"') ||
      content.toLowerCase().includes("'" + slug + "'")) {
    matched.push(city);
  } else {
    missing.push(city);
  }
});

console.log('Total user cities in prompt: ' + userCities.length);
console.log('Cities with dedicated landing pages (' + matched.length + ' / ' + userCities.length + '):');
console.log(JSON.stringify(matched, null, 2));
console.log('Cities missing: ' + missing.length);
if (missing.length > 0) {
  console.log(JSON.stringify(missing, null, 2));
}
