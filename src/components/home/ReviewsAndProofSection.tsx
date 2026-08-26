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
    <section
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '48px 0 44px 0',
        borderBottom: '1px solid #e2e8f0',
      }}
      aria-label="Customer Reviews and Service Areas"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Block: Google Rating Card & 3 Quotes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: '1 1 340px' }}>
            
            {/* Google Rating Banner */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    color: '#4285F4',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                  }}
                >
                  G
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>5.0</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>5.0 Rated DFW Service</span>
                </div>
              </div>

              <a
                href="https://www.google.com/search?q=Lone+Wolf+Dumpsters+LLC"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                VIEW ALL REVIEWS ON GOOGLE →
              </a>
            </div>

            {/* 3 Review Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', flexGrow: 1 }}>
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  }}
                >
                  <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.4', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                      - {rev.author}
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: Proudly Serving Dallas-Fort Worth */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              flex: '1 1 300px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MapPin size={18} color="var(--accent-red)" />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  PROUDLY SERVING DALLAS-FORT WORTH AND SURROUNDING AREAS
                </h3>
              </div>

              {/* City Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginTop: '12px',
                  marginBottom: '14px',
                }}
              >
                {cities.map((city, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      textAlign: 'center',
                    }}
                  >
                    {city.slug ? (
                      <Link href={`/service-areas/${city.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {city.name}
                      </Link>
                    ) : (
                      <span>{city.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <Link
                href="/service-areas"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                VIEW ALL AREAS →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
