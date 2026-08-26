import type { Metadata } from 'next';
import FifteenYardDumpsterClient from './ClientPage';

export const metadata: Metadata = {
  title: '15 Yard Dumpster Rental Dallas–Fort Worth | $385 Starting Price',
  description: 'Rent a 15-yard roll-off dumpster in DFW. Dimensions: 14ft L x 7.5ft W x 4ft H with 1.5 tons (3,000 lbs) weight included. Ideal for small home remodels and garage cleanouts.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals/15-yard',
  },
};

export default function FifteenYardDumpsterPage() {
  return <FifteenYardDumpsterClient />;
}
