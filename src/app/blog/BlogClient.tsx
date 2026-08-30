'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/shared/PageHero';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { blogPosts } from '@/data/blogPosts';
import { Clock, ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';

export default function BlogClient() {
  const { content: siteContent } = useSiteContent();

  const heroImg = siteContent.pageHeroes?.guides || {
    src: '/images/lone-wolf/lone_wolf_hero_top.png',
    alt: 'Lone Wolf Dumpsters roll-off truck with black dumpster serving the Dallas-Fort Worth area',
    position: 'center right'
  };

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
        imageSrc={heroImg.src}
        imageAlt={heroImg.alt}
        imageObjectPosition={heroImg.position || 'center right'}
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
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '14px',
                      backgroundColor: '#0f172a',
                    }}
                  >
                    <Image
                      src={post.image || '/images/lone-wolf/lone_wolf_hero_top.png'}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1200px) 380px, 100vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        backgroundColor: '#fee2e2',
                        color: 'var(--accent-red)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {post.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                    <Link href={'/blog/' + post.slug} style={{ color: '#0f172a', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <Link
                    href={'/blog/' + post.slug}
                    style={{
                      color: 'var(--accent-red)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    <span>Read Article</span>
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
        headline="HAVE QUESTIONS ABOUT DUMPSTER SIZES OR PERMITS?"
        subheadline="CALL OR TEXT FOR INSTANT EXPERT ADVICE"
      />
    </>
  );
}
