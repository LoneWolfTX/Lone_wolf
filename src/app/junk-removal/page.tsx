import { Metadata } from 'next';
import JunkRemovalClient from './JunkRemovalClient';

export const metadata: Metadata = {
  title: 'Full-Service Junk & Trash Removal in DFW | Lone Wolf Dumpsters',
  description: 'Full-service junk removal crew across Dallas-Fort Worth starting at $150. We load, haul away, and sweep up. Furniture, appliances, estate cleanouts, yard waste.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/junk-removal',
  },
};

export default function JunkRemovalPage() {
  return <JunkRemovalClient />;
}
