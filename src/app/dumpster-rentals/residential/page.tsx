import { Metadata } from 'next';
import ResidentialPageClient from './ClientPage';

export const metadata: Metadata = {
  title: 'Residential Dumpster Rentals in DFW | Lone Wolf Dumpsters',
  description: 'Driveway-safe residential roll-off dumpster rentals for home cleanouts, renovations, roofing, moving, and yard waste across Dallas-Fort Worth.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals/residential',
  },
};

export default function ResidentialPage() {
  return <ResidentialPageClient />;
}
