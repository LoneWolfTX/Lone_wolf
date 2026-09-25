import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'DFW Dumpster Rental Resource Center | Wolf Ridge Dumpsters',
  description: 'Straight answers about dumpster sizes, pricing, prohibited materials, project planning, and roll-off rentals across Dallas–Fort Worth.',
  alternates: {
    canonical: 'https://wolfridgedumpsters.com/blog',
  },
};

export default function BlogIndexPage() {
  return <BlogClient />;
}
