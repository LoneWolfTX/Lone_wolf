'use client';

import { useDumpsterPageContent, useSiteContent } from '@/lib/useEditableContent';
import { formatExtraDayRate, formatRentalPeriod } from '@/lib/formatters';
import { CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { getDumpsterProducts } from '@/data/dumpsters';

export default function FifteenYardDumpsterClient() {
  const { content: siteContent } = useSiteContent();
  const product = getDumpsterProducts(siteContent).find((p) => p.id === '15-yard-dumpster')!;
  const content = useDumpsterPageContent('15-yard-dumpster');

  const heroImg = content.image || {
    src: '/images/lone-wolf/real/dumpster_15_environment.jpg',
    alt: '15 Yard Lone Wolf Dumpster in Residential Driveway Setting',
    position: 'center center'
  };

  return (
    <>
      {/* 1. Target-Style Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dumpster Rentals', href: '/dumpster-rentals' },
          { label: '15 Yard Dumpster' },
        ]}
        headlineWhite="15 YARD ROLL-OFF"
        headlineRed="DUMPSTER RENTAL"
        description={content.heroDescription}
        imageSrc={heroImg.src}
        imageAlt={heroImg.alt}
        imageObjectPosition={heroImg.position}
        badgeText={content.badgeText}
      />

      {/* 2. Specs & Project Details Section */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'flex-start' }}>
            
            {/* Specs Card */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '28px 26px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 16px 0' }}>
                15 YARD SPECIFICATIONS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Dimensions:</span>
                  <strong style={{ color: '#0f172a' }}>{product.dimensionsText}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Included Weight:</span>
                  <strong style={{ color: 'var(--accent-red)' }}>{content.weightIncludedText}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Rental Period:</span>
                  <strong style={{ color: '#0f172a' }}>{formatRentalPeriod(siteContent.rentalPeriods?.standardDays)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Extra Day Fee:</span>
                  <strong style={{ color: '#0f172a' }}>{formatExtraDayRate(siteContent.pricing?.extraDay)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Overage Rate:</span>
                  <strong style={{ color: '#0f172a' }}>{content.overagePrice}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Driveway Protection:</span>
                  <strong style={{ color: '#16a34a' }}>Included Free</strong>
                </div>
              </div>

              <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '16px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  UPFRONT FLAT-RATE PRICE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-red)', lineHeight: 1, margin: '4px 0 8px 0' }}>
                  {content.priceDisplay}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Delivery, pickup, and municipal disposal included.
                </p>
              </div>

              {/* Important Notice */}
              {content.importantNotice && (
                <div style={{ marginTop: '16px', backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '6px', padding: '12px 14px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  <strong style={{ color: '#dc2626' }}>⚠ Important:</strong> {content.importantNotice}
                </div>
              )}
            </div>

            {/* Best For Projects */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                RECOMMENDED APPLICATIONS
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 16px 0', lineHeight: 1.1 }}>
                BEST USES FOR A 15 YARD CONTAINER
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                {content.bodyDescription}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                {content.bestFor.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="#quote"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    backgroundColor: 'var(--accent-red)',
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  <span>{content.ctaText}</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Quote Form */}
      <FreeQuoteForm id="quote" defaultService="15-yard-dumpster" />

      {/* 4. Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO BOOK YOUR 15 YARD DUMPSTER?"
        subheadline="CALL OR RESERVE ONLINE TODAY!"
        imageSrc={heroImg.src}
        imageAlt={heroImg.alt}
        imageObjectPosition={heroImg.position}
      />
    </>
  );
}
