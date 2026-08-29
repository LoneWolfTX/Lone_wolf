'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { DumpsterProduct } from '@/types/business';
import { trackBookOnlineClick } from '@/lib/tracking';
import { getQuoteUrl } from '@/lib/ctaHelper';

interface DumpsterCardProps {
  product: DumpsterProduct;
}

export const DumpsterCard: React.FC<DumpsterCardProps> = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const isMostPopular = product.badge === 'MOST POPULAR';
  const pathname = usePathname();
  const quoteUrl = getQuoteUrl(pathname);

  return (
    <article
      className={`dumpster-card ${isMostPopular ? 'featured-card' : ''}`}
      style={{
        backgroundColor: '#ffffff',
        border: isMostPopular ? '2px solid var(--accent-red)' : '1px solid #cbd5e1',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: isMostPopular ? '0 10px 25px -5px rgba(220, 38, 38, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
      }}
    >
      {/* Top Header Badge */}
      <div
        style={{
          backgroundColor: isMostPopular ? 'var(--accent-red)' : '#0f172a',
          color: '#ffffff',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.name}
        </span>
        {product.badge && (
          <span
            style={{
              backgroundColor: isMostPopular ? '#ffffff' : 'rgba(255,255,255,0.15)',
              color: isMostPopular ? 'var(--accent-red)' : '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '16px' }}>
        
        {/* Product Image Box */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '190px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          <Image
            src={product.image}
            alt={product.imageAlt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Pricing Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
              3 DAYS
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.0rem', fontWeight: 800, color: 'var(--accent-red)', lineHeight: 1 }}>
              {`3 Days – ${product.priceDisplay || `$${product.startingPrice}`}`}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
              {product.weightIncludedText}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {product.rentalPeriodText}
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
          {product.description}
        </p>

        {/* Key Features Bullet List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Dimensions &amp; Rates:
          </div>
          <div style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>•</span>
            <strong>Dimensions:</strong> {product.dimensionsText}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>•</span>
            <strong>Extra Days:</strong> {product.extraDayPrice}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>•</span>
            <strong>Overage Rate:</strong> {product.overagePrice}
          </div>
        </div>

        {/* Expandable Best For Details */}
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            <span>{expanded ? 'Hide Ideal Uses' : 'View Ideal Uses'}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expanded && (
            <div style={{ marginTop: '10px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.bestFor.map((useItem, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span>{useItem}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
          <Link
            href={quoteUrl}
            onClick={() => trackBookOnlineClick(product.id, product.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: 'var(--accent-red)',
              color: '#ffffff',
              borderRadius: '4px',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
            }}
          >
            <span>{product.ctaText || 'BOOK ONLINE NOW'}</span>
          </Link>
          
          <Link
            href={`/dumpster-rentals/${product.id === '15-yard-dumpster' ? '15-yard' : product.id === '20-yard-dumpster' ? '20-yard' : '25-yard'}`}
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '4px 0',
            }}
          >
            View Full Specs &amp; Details →
          </Link>
        </div>

      </div>
    </article>
  );
};
