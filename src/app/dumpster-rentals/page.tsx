import { Metadata } from 'next';
import DumpsterRentalsClient from './DumpsterRentalsClient';

export const metadata: Metadata = {
  title: 'Roll-Off Dumpster Rentals in DFW | Lone Wolf Dumpsters',
  description: 'Rent 15, 20, and 25-yard roll-off dumpsters in Dallas-Fort Worth. Upfront flat-rate pricing, driveway protection, 3, 5, or 7-day rentals.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals',
  },
};

export default function DumpsterRentalsPage() {
  return <DumpsterRentalsClient />;
}
