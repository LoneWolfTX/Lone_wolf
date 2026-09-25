import type { Metadata } from 'next';
import AboutPageClient from './ClientPage';

export const metadata: Metadata = {
  title: 'About Wolf Ridge Dumpsters | Locally Owned in Dallas–Fort Worth',
  description: 'Learn about Wolf Ridge Dumpsters in DFW. We provide straightforward flat rates, driveway protection, and reliable roll-off dumpster delivery.',
  alternates: {
    canonical: 'https://wolfridgedumpsters.com/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
