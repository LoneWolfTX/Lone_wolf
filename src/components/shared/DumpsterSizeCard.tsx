'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Calendar } from 'lucide-react';
import { DumpsterProduct } from '@/types/business';
import { trackBookOnlineClick } from '@/lib/tracking';
import { useSiteContent } from '@/lib/useEditableContent';

interface DumpsterSizeCardProps {
  product: DumpsterProduct;
  customBestFor?: string;
  buttonLabel?: string;
  targetId?: string;
  detailUrl?: string;
}

export const DumpsterSizeCard: React.FC<DumpsterSizeCardProps> = ({
  product,
  customBestFor,
  buttonLabel = 'VIEW DETAILS →',
  targetId = 'quote',
  detailUrl,
}) => {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const dim = content.dimensions;
  const isMostPopular = product.badge === 'MOST POPULAR';

  // Dynamic overrides from siteContent
  let dynamicPrice = product.priceDisplay;
  let dynamicDimensions = product.dimensionsText;
  let dynamicWeight = product.weightIncludedText;

  if (product.id === '15-yard-dumpster') {
    dynamicPrice = `$${pr.fifteenYard}`;
    if (dim?.fifteenYard) dynamicDimensions = dim.fifteenYard;
    const page15 = content.dumpsterPages?.find(p => p.id === '15-yard-dumpster');
    if (page15?.weightIncludedText) dynamicWeight = page15.weightIncludedText;
  } else if (product.id === '20-yard-dumpster') {
    dynamicPrice = `$${pr.twentyYard}`;
    if (dim?.twentyYard) dynamicDimensions = dim.twentyYard;
    const page20 = content.dumpsterPages?.find(p => p.id === '20-yard-dumpster');
    if (page20?.weightIncludedText) dynamicWeight = page20.weightIncludedText;
  } else if (product.id === '25-yard-dumpster') {
    dynamicPrice = `$${pr.twentyFiveYard}`;
    if (dim?.twentyFiveYard) dynamicDimensions = dim.twentyFiveYard;
    const page25 = content.dumpsterPages?.find(p => p.id === '25-yard-dumpster');
    if (page25?.weightIncludedText) dynamicWeight = page25.weightIncludedText;
  }

  // If detailUrl is provided, button routes to that page; otherwise scrolls to #targetId
  const isDetailButton = detailUrl != null;

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '11px 0',
    backgroundColor: 'var(--accent-red)',
    color: '#ffffff',
    borderRadius: '4px',
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    textDecoration: 'none',
    letterSpacing: '0.5px',
    boxShadow: '0 3px 10px rgba(220, 38, 38, 0.3)',
  };

  return (
    <article
      className={`dumpster-card ${isMostPopular ? 'featured-card' : ''}`}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isMostPopular
          ? '0 10px 24px -4px rgba(220, 38, 38, 0.15), 0 3px 8px rgba(0, 0, 0, 0.06)'
          : '0 2px 10px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        height: '100%',
      }}
      aria-labelledby={`card-heading-${product.id}`}
    >
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: '#0a0d12',
          color: '#ffffff',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <h3
          id={`card-heading-${product.id}`}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            margin: 0,
            color: '#ffffff',
            lineHeight: 1.1,
          }}
        >
          {product.name}
        </h3>

        {isMostPopular && (
          <span
            style={{
              backgroundColor: 'var(--accent-red)',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '2px',
              letterSpacing: '0.6px',
              lineHeight: 1.2,
            }}
          >
            MOST POPULAR
          </span>
        )}
      </div>

      {/* Equipment Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          minHeight: '180px',
          backgroundColor: '#e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          priority={true}
          unoptimized={true}
          sizes="(min-width: 1200px) 380px, (min-width: 768px) 33vw, 100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

        {/* Specs List with Red Check Icons */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: '#334155' }}>
              <strong>Dimensions:</strong> {dynamicDimensions}
            </span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: '#334155' }}>
              <strong>Tonnage Included:</strong> {dynamicWeight}
            </span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: '#334155' }}>
              <strong>Rental Period:</strong> {product.id === '15-yard-dumpster' ? '1 to 5 Days' : '1 to 7 Days'}
            </span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: '#334155', lineHeight: 1.35 }}>
              <strong>Best For:</strong> {customBestFor || product.description}
            </span>
          </li>
        </ul>

        {/* Pricing Area */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0',
            marginBottom: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              3 DAYS
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {`3 Days – ${dynamicPrice}`}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              NEED MORE TIME?
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              ${pr.extraDay} <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>/day</span>
            </div>
          </div>
        </div>

        {/* Action Button — routes to detail page if detailUrl provided, otherwise scrolls to form */}
        {isDetailButton ? (
          <Link
            href={detailUrl!}
            onClick={() => trackBookOnlineClick(`card_${product.id}`)}
            style={buttonStyle}
          >
            <span>{buttonLabel}</span>
          </Link>
        ) : (
          <a
            href={`#${targetId}`}
            onClick={() => trackBookOnlineClick(`card_${product.id}`)}
            style={buttonStyle}
          >
            {buttonLabel.includes('+') ? (
              <>
                <Calendar size={16} />
                <span>{buttonLabel}</span>
              </>
            ) : (
              <span>{buttonLabel}</span>
            )}
          </a>
        )}

      </div>
    </article>
  );
};
