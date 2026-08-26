import React from 'react';
import { Star, ShieldCheck, CheckCircle } from 'lucide-react';
import { googleReviews } from '@/data/reviews';

export const GoogleReviews: React.FC = () => {
  const featuredReviews = googleReviews.slice(0, 3);

  return (
    <section id="reviews" className="reviews-section" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="reviews-heading">
      <div className="container">
        
        {/* Desktop Header */}
        <div className="section-header nav-desktop-only" style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div className="google-stars-badge" style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '4px', marginBottom: '12px' }}>
            <div className="stars-row" style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="star-filled" fill="#eab308" color="#eab308" />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>5.0 STAR RATED ON GOOGLE</span>
          </div>

          <h2 id="reviews-heading" className="section-title" style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.5rem)', color: '#0f172a', marginBottom: '6px' }}>
            TRUSTED BY <span className="text-accent">DFW HOMEOWNERS &amp; CONTRACTORS</span>
          </h2>
          <p className="section-subtitle" style={{ color: '#64748b', maxWidth: '680px', margin: '0 auto' }}>
            Real 5-star feedback from residential remodelers, roofers, and homeowners across Dallas and Fort Worth.
          </p>
        </div>

        {/* Mobile-Only Compact Trust Strip (Section 4 Specs) */}
        <div className="nav-mobile-only" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#eab308" color="#eab308" />
            ))}
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginLeft: '4px' }}>5.0 Google Rating</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Local DFW Company · Fast Delivery · Straightforward Pricing
          </p>
        </div>

        {/* 3 Review Cards Grid (Responsive) */}
        <div
          className="reviews-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {featuredReviews.map((rev) => (
            <div
              key={rev.id}
              className="review-card"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '24px 22px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                      }}
                    >
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{rev.author}</h3>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{rev.source}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#eab308" color="#eab308" />
                    ))}
                  </div>
                </div>

                <blockquote style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.55', margin: 0, fontStyle: 'normal' }}>
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                <CheckCircle size={14} />
                <span>Verified DFW Customer</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
