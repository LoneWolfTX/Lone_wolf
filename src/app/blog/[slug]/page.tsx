import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { blogPosts } from '@/data/blogPosts';
import { siteSettings } from '@/data/siteSettings';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article | Lone Wolf Dumpsters' };

  return {
    title: `${post.title} | Lone Wolf Dumpsters DFW`,
    description: post.excerpt,
    alternates: {
      canonical: `https://lonewolfdumpsters.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Wayne',
      jobTitle: 'Owner & Operator',
      worksFor: {
        '@type': 'LocalBusiness',
        name: siteSettings.businessName,
      },
    },
    publisher: {
      '@type': 'LocalBusiness',
      name: siteSettings.businessName,
      logo: {
        '@type': 'ImageObject',
        url: 'https://lonewolfdumpsters.com/images/lone-wolf/logo.png',
      },
    },
    mainEntityOfPage: `https://lonewolfdumpsters.com/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.category },
        ]}
        headlineWhite={post.title.toUpperCase()}
        headlineRed="DFW EXPERT GUIDE"
        description={post.excerpt}
        imageSrc={post.image || "/images/lone-wolf/real/hero_fleet_environment.jpg"}
        imageAlt={post.title}
        badgeText={`${post.category} • ${post.readTime}`}
      />

      {/* Article Content on Pure White */}
      <article style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-red)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                textTransform: 'uppercase',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to All Guides</span>
            </Link>
          </div>

          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: 'clamp(24px, 4vw, 40px)',
              lineHeight: 1.8,
              fontSize: '1.02rem',
              color: '#334155',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <p
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '16px',
                marginBottom: '24px',
                lineHeight: 1.5,
              }}
            >
              {post.excerpt}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {post.content.map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0 }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Quick Summary Callout */}
            <div style={{ marginTop: '32px', padding: '20px 24px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 10px 0' }}>
                NEED HELP RESERVING A DUMPSTER?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 14px 0' }}>
                Wayne is available Mon–Sat from 6:00 AM to 6:00 PM for direct scheduling and sizing advice.
              </p>
              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <span>Call Wayne at (214) 876-0321</span>
              </a>
            </div>

          </div>

        </div>
      </article>

      {/* Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Dumpster Service"
      />
    </>
  );
}
