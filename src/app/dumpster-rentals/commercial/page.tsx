import { Metadata } from 'next';
import CommercialPageClient from './ClientPage';

export const metadata: Metadata = {
  title: 'Commercial Dumpster Rentals in DFW | Lone Wolf Dumpsters',
  description: 'Reliable commercial roll-off dumpster rentals for retail, offices, warehouses, restaurants, and facility cleanouts across Dallas-Fort Worth.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals/commercial',
  },
};

export default function CommercialPage() {
  return <CommercialPageClient />;
}
