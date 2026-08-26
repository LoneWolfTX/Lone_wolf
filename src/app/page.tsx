import { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { siteSettings } from '@/data/siteSettings';

export const metadata: Metadata = {
  title: 'Lone Wolf Dumpsters | Fast & Reliable Dumpster Rentals in DFW',
  description: 'Rent 15, 20, and 25-yard driveway-safe roll-off dumpsters in Dallas-Fort Worth. Upfront flat-rate pricing, 5.0 Google rating, local owner-operator.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/',
  },
};

export default function HomePage() {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteSettings.businessName,
    legalName: siteSettings.businessName,
    telephone: siteSettings.contact.phone,
    email: siteSettings.contact.email,
    url: 'https://lonewolfdumpsters.com',
    logo: 'https://lonewolfdumpsters.com/images/lone-wolf/logo.png',
    image: 'https://lonewolfdumpsters.com/images/lone-wolf/hero_placement.jpg',
    priceRange: '$385 - $475',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.yard.address,
      addressLocality: siteSettings.yard.city,
      addressRegion: siteSettings.yard.state,
      postalCode: siteSettings.yard.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.7767,
      longitude: -96.797,
    },
    areaServed: [
      'Dallas',
      'Fort Worth',
      'Arlington',
      'Keller',
      'Southlake',
      'Grapevine',
      'Colleyville',
      'Irving',
      'Grand Prairie',
      'Mansfield',
      'Euless',
      'Bedford',
      'Hurst',
      'Roanoke',
      'Flower Mound',
      'Lewisville',
      'Denton',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
