const fs = require('fs');

const approved48 = [
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

const rawContent = fs.readFileSync('src/data/cityServiceAreas.ts', 'utf8');

// Match each city block
const cityBlocks = rawContent.match(/\{\s*slug:\s*'[^']+'[\s\S]*?\n  \},/g) || [];
console.log('Total city blocks found:', cityBlocks.length);

const approvedBlocks = [];
const seenSlugs = new Set();

for (const block of cityBlocks) {
  const nameMatch = block.match(/cityName:\s*'([^']+)'/);
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  if (nameMatch && slugMatch) {
    const cityName = nameMatch[1];
    const slug = slugMatch[1];
    if (approved48.includes(cityName) && !seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      approvedBlocks.push(block);
    }
  }
}

console.log('Approved 48 blocks count:', approvedBlocks.length);

const foundNames = approvedBlocks.map(b => b.match(/cityName:\s*'([^']+)'/)[1]);
const missing = approved48.filter(a => !foundNames.includes(a));
console.log('Missing from 48:', missing);

if (approvedBlocks.length === 48) {
  const newContent = `export interface CityServiceArea {
  slug: string;
  cityName: string;
  county: string;
  zipCodes: string[];
  headline: string;
  localIntro: string;
  keyProjects: string[];
  code?: string;
  neighborhoods?: string[];
  active?: boolean;
}

export const cityServiceAreas: CityServiceArea[] = [
  ${approvedBlocks.join('\n  ')}
];
`;
  fs.writeFileSync('src/data/cityServiceAreas.ts', newContent, 'utf8');
  console.log('Successfully wrote exact 48 cities to src/data/cityServiceAreas.ts!');
}
