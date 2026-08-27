import React from 'react';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

export const ReviewsAndProofSection: React.FC = () => {
  const reviews = [
    {
      author: 'Jason M.',
      quote: 'Great service from start to finish. On time, easy to book, and the price was fair!',
      rating: 5,
    },
    {
      author: 'Sarah T.',
      quote: 'The best dumpster rental company in DFW. Highly recommend!',
      rating: 5,
    },
    {
      author: 'Michael R.',
      quote: 'Professional, friendly and super easy process. Will use again.',
      rating: 5,
    },
  ];

  const cities = [
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Fort Worth', slug: 'fort-worth' },
    { name: 'Arlington', slug: 'arlington' },
    { name: 'Grand Prairie', slug: 'grand-prairie' },
    { name: 'Keller', slug: 'keller' },
    { name: 'Bedford', slug: 'bedford' },
    { name: 'Euless', slug: 'euless' },
    { name: 'Irving', slug: 'irving' },
    { name: 'Hurst', slug: 'hurst' },
    { name: 'Lewisville', slug: 'lewisville' },
    { name: 'North Richland Hills', slug: 'north-richland-hills' },
    { name: 'Southlake', slug: 'southlake' },
  ];

  return (
    <>
      {/* SECTION 1: CUSTOMER REVIEWS (Horizontal Left-to-Right) */}
      <section
        style={{
          backgroundColor: '#ffffff',
          color: '#1e293b',
          padding: '48px 0 36px 0',
          borderBottom: '1px solid #e2e8f0',
        }}
        aria-label="Customer Reviews"
      >
        <div className="container">
          {/* Header & Rating Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  color: '#4285F4',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                G
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>5.0</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#eab308" color="#eab308" />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  Verified 5.0 Google Reviews across DFW
                </span>
              </div>
            </div>

            <a
              href="https://www.google.com/search?q=Lone+Wolf+Dumpsters+LLC"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                letterSpacing: '0.5px',
              }}
            >
              VIEW ALL REVIEWS ON GOOGLE →
            </a>
          </div>

          {/* 3 Review Cards Horizontal Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
            }}
          >
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', margin: '0 0 14px 0', fontStyle: 'italic' }}>
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    - {rev.author}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="#eab308" color="#eab308" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICE AREAS (Distinct Section Directly Below Reviews) */}
      <section
        style={{
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          padding: '44px 0 48px 0',
          borderBottom: '1px solid #e2e8f0',
        }}
        aria-label="Service Areas Footprint"
      >
        <div className="container">
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '28px 26px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <MapPin size={22} color="var(--accent-red)" />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 2.8vw, 1.8rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                PROUDLY SERVING DALLAS-FORT WORTH &amp; 48 SURROUNDING CITIES
              </h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0 0 18px 0' }}>
              Fast, driveway-safe roll-off dumpster delivery across Tarrant, Dallas, and Denton Counties. Choose your city below:
            </p>

            {/* City Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {cities.map((city, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Link href={`/service-areas/${city.slug}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                    {city.name}
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <Link
                href="/service-areas"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  letterSpacing: '0.5px',
                }}
              >
                <span>VIEW ALL 48 SERVICE AREAS &amp; LOCAL MAPS</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
