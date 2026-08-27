import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { blogPosts } from '@/data/blogPosts';
import { Clock, ArrowRight } from 'lucide-react';

import Image from 'next/image';

export const metadata: Metadata = {
  title: 'DFW Dumpster Rental Resource Center | Lone Wolf Dumpsters',
  description: 'Straight answers about dumpster sizes, pricing, prohibited materials, project planning, and roll-off rentals across Dallas–Fort Worth.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <>
      {/* 1. Resource Center Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Guides' },
        ]}
        headlineWhite="DFW DUMPSTER RENTAL"
        headlineRed="RESOURCE CENTER"
        description="Straight answers about dumpster sizes, pricing, prohibited materials, project planning, and roll-off rentals across Dallas–Fort Worth."
        imageSrc="/images/lone-wolf/real/real_dumpster_6594.jpg"
        imageAlt="Lone Wolf Dumpster Fleet Resource Guides in DFW"
      />

      {/* 2. Blog Posts Grid on White */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  {post.image && (
                    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#0a0d12' }}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#fee2e2', color: 'var(--accent-red)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {post.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748b' }}>
                      <Clock size={13} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.2 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                    {post.excerpt}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>{post.publishDate}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--accent-red)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Dumpster Service"
      />
    </>
  );
}
