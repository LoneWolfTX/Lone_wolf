import { ServiceArea } from '@/types/business';

export const serviceAreas: ServiceArea[] = [
  {
    county: 'Tarrant County',
    cities: [
      'Fort Worth', 'Arlington', 'Keller', 'Southlake', 'Colleyville', 'Grapevine', 
      'North Richland Hills', 'Bedford', 'Euless', 'Hurst', 'Haltom City', 'Mansfield', 
      'Watauga', 'Saginaw', 'Haslet', 'Richland Hills', 'Kennedale', 'Lake Worth', 
      'White Settlement', 'River Oaks', 'Forest Hill', 'Everman', 'Edgecliff Village', 
      'Blue Mound', 'Sansom Park', 'Lakeside'
    ],
    active: true,
  },
  {
    county: 'Dallas County',
    cities: [
      'Dallas', 'Irving', 'Grand Prairie', 'Carrollton', 'Coppell', 'Farmers Branch', 
      'Addison', 'Highland Park', 'University Park', 'Duncanville', 'DeSoto', 'Cedar Hill', 
      'Cockrell Hill'
    ],
    active: true,
  },
  {
    county: 'Denton County',
    cities: [
      'Lewisville', 'Flower Mound', 'The Colony', 'Highland Village', 'Roanoke', 
      'Trophy Club', 'Westlake', 'Northlake', 'Double Oak'
    ],
    active: true,
  },
];

// Client-side ZIP lookup list for quick instant verification
export const servedZipPrefixes = ['750', '751', '752', '753', '760', '761', '762'];
