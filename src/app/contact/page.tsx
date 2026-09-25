import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us & Book Online | Wolf Ridge Dumpsters DFW',
  description: 'Book your 15, 20, or 25-yard roll-off dumpster rental or request a free quote. Call or text (214) 876-0321 for direct owner-operator dispatch.',
  alternates: {
    canonical: 'https://wolfridgedumpsters.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
