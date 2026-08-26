import type { Metadata } from 'next';
import TwentyFiveYardDumpsterClient from './ClientPage';

export const metadata: Metadata = {
  title: '25 Yard Dumpster Rental Dallas–Fort Worth | $475 Starting Price',
  description: 'Rent a 25-yard roll-off dumpster in DFW. Dimensions: 16ft L x 7.5ft W x 6ft H with 2.2 tons (4,400 lbs) included. Maximum capacity for large estate cleanouts, construction, and commercial demo.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals/25-yard',
  },
};

export default function TwentyFiveYardDumpsterPage() {
  return <TwentyFiveYardDumpsterClient />;
}
