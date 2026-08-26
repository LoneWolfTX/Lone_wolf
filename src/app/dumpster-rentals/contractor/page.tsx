import { Metadata } from 'next';
import ContractorPageClient from './ClientPage';

export const metadata: Metadata = {
  title: 'Dumpster Rentals for Contractors in DFW | Lone Wolf Dumpsters',
  description: 'Heavy-duty roll-off dumpster rentals for roofing, remodeling, demo, and construction job sites across Dallas-Fort Worth. Same-day swaps & contractor pricing.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals/contractor',
  },
};

export default function ContractorPage() {
  return <ContractorPageClient />;
}
