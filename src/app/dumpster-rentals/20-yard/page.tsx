import type { Metadata } from 'next';
import TwentyYardDumpsterClient from './ClientPage';

export const metadata: Metadata = {
  title: '20 Yard Dumpster Rental Dallas–Fort Worth | $425 Flat Rate',
  description: 'Rent our versatile 20-yard roll-off dumpster in DFW. Dimensions: 16ft L x 8ft W x 5.4ft H with 2.0 tons (4,000 lbs) included. Perfect for roofing, remodels, and whole-house cleanouts.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals/20-yard',
  },
};

export default function TwentyYardDumpsterPage() {
  return <TwentyYardDumpsterClient />;
}
