import React from 'react';
import Link from 'next/link';
import { Star, MapPin, ArrowRight, ShieldCheck, HardHat, Home, Building2 } from 'lucide-react';

export const ReviewsAndServiceArea: React.FC = () => {
  const reviews = [
    {
      author: 'Jason M.',
      quote: 'Great service from start to finish. On time, easy to book, and the flat rate was fair!',
      rating: 5,
    },
    {
      author: 'Sarah T.',
      quote: 'Driveway boards protected my concrete. Best dumpster rental company in DFW.',
      rating: 5,
    },
    {
      author: 'Michael R.',
      quote: 'Direct communication with Wayne made our roofing swap seamless. Highly recommend!',
      rating: 5,
    },
  ];

  const cities = [
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Fort Worth', slug: 'fort-worth' },
    { name: 'Arlington', slug: 'arlington' },
    { name: 'Keller', slug: 'keller' },
    { name: 'Colleyville', slug: 'colleyville' },
    { name: 'Southlake', slug: 'southlake' },
    { name: 'Grapevine', slug: 'grapevine' },
    { name: 'Bedford', slug: 'bedford' },
    { name: 'Euless', slug: 'euless' },
    { name: 'Irving', slug: 'irving' },
    { name: 'Plano', slug: 'plano' },
    { name: 'Frisco', slug: 'frisco' },
  ];

  return (
    <section id="reviews" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '36px 0 28px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="reviews-areas-heading">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
          
          {/* Left Column: Google Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    color: '#4285F4',
                  }}
                >
                  G
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>5.0</span>
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Verified Customer Reviews</span>
                </div>
              </div>

              <a
                href="https://www.google.com/search?q=Lone+Wolf+Dumpsters+LLC"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                VIEW ON GOOGLE &rarr;
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
                  }}
                >
                  <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.4', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                      – {rev.author}
                    </div>
                    <div style={{ display: 'flex', gap: '1px', marginTop: '2px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={11} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: DFW Service Coverage Directory */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MapPin size={18} className="text-accent" />
                <h3 id="reviews-areas-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                  PROUDLY SERVING DALLAS–FORT WORTH
                </h3>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                Fast roll-off container delivery across Dallas, Tarrant, Denton, and Collin counties.
              </p>

              {/* City Pill Links */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/service-areas/${city.slug}`}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      textDecoration: 'none',
                    }}
                  >
                    {city.name}, TX
                  </Link>
                ))}
              </div>
            </div>

            {/* Who We Serve Combined Strip */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
              <span>★ Residential Cleanouts</span>
              <span>★ Roofing &amp; Remodeling</span>
              <span>★ Commercial Properties</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
