export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  caption: string;
  category: 'residential' | 'commercial' | 'fleet';
}

export const equipmentGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    image: '/images/lone-wolf/real/hero_fleet_environment.jpg',
    alt: 'Wolf Ridge Dumpsters roll-off delivery truck and equipment yard',
    caption: 'Clean, well-maintained Wolf Ridge delivery equipment in DFW',
    category: 'fleet',
  },
  {
    id: 'gal-2',
    image: '/images/lone-wolf/real/residential_environment_showcase.jpg',
    alt: 'Wolf Ridge roll-off dumpster carefully placed on residential driveway with protective wood boards',
    caption: 'Suburban residential driveway placement with full surface protection',
    category: 'residential',
  },
  {
    id: 'gal-3',
    image: '/images/lone-wolf/real/commercial_environment_showcase.jpg',
    alt: 'Wolf Ridge commercial roll-off container staged at warehouse loading dock facility',
    caption: 'Commercial warehouse & industrial facility waste management',
    category: 'commercial',
  },
  {
    id: 'gal-4',
    image: '/images/lone-wolf/real/contractor_environment_showcase.jpg',
    alt: 'Wolf Ridge heavy-duty container on active residential remodel contractor job site',
    caption: 'Contractor job site delivery with driveway protection boards',
    category: 'commercial',
  },
  {
    id: 'gal-5',
    image: '/images/lone-wolf/real/dumpster_20_environment.jpg',
    alt: '20 Yard Wolf Ridge dumpster placed for home renovation',
    caption: '20-yard container staged for home renovation project',
    category: 'residential',
  },
  {
    id: 'gal-6',
    image: '/images/lone-wolf/real/dumpster_15_environment.jpg',
    alt: '15 Yard compact roll-off dumpster placed on concrete residential driveway',
    caption: '15-yard compact container for residential cleanouts',
    category: 'residential',
  },
];
