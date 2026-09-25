import { Metadata } from 'next';
import JunkRemovalClient from './JunkRemovalClient';

export const metadata: Metadata = {
  title: 'Full-Service Junk & Trash Removal in DFW | Wolf Ridge Dumpsters',
  description: 'Full-service junk removal crew across Dallas-Fort Worth starting at $150. We load, haul away, and sweep up. Furniture, appliances, estate cleanouts, yard waste.',
  alternates: {
    canonical: 'https://wolfridgedumpsters.com/junk-removal',
  },
};

export default function JunkRemovalPage() {
  return <JunkRemovalClient />;
}
