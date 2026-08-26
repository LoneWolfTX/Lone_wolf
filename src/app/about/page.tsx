import type { Metadata } from 'next';
import AboutPageClient from './ClientPage';

export const metadata: Metadata = {
  title: 'About Lone Wolf Dumpsters | Locally Owned in Dallas–Fort Worth',
  description: 'Learn about Lone Wolf Dumpsters LLC, owned and operated by Wayne in DFW. We provide straightforward flat rates, driveway protection, and reliable roll-off delivery.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
