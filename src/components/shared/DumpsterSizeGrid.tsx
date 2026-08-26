'use client';

import React from 'react';
import { dumpsterProducts } from '@/data/dumpsters';
import { DumpsterSizeCard } from './DumpsterSizeCard';

interface DumpsterSizeGridProps {
  sectionTitle?: string;
  tagline?: string;
  subtitle?: string;
  customBestFors?: { [key: string]: string };
  buttonLabel?: string;
  targetId?: string;
  backgroundColor?: string;
  /** When true, "View Details" buttons route to the individual dumpster detail pages */
  useDetailLinks?: boolean;
}

// Map from product ID to its detail page URL
const DUMPSTER_DETAIL_URLS: Record<string, string> = {
  '15-yard-dumpster': '/dumpster-rentals/15-yard',
  '20-yard-dumpster': '/dumpster-rentals/20-yard',
  '25-yard-dumpster': '/dumpster-rentals/25-yard',
};

export const DumpsterSizeGrid: React.FC<DumpsterSizeGridProps> = ({
  sectionTitle = 'CHOOSE THE RIGHT SIZE FOR YOUR PROJECT',
  tagline = 'DUMPSTER SIZES',
  subtitle,
  customBestFors,
  buttonLabel = 'VIEW DETAILS →',
  targetId = 'quote',
  backgroundColor = '#ffffff',
  useDetailLinks = true,
}) => {
  const rollOffDumpsters = dumpsterProducts.filter(
    (product) => product.category === 'dumpster' && product.active
  );

  return (
    <section
      id="dumpster-sizes"
      style={{
        backgroundColor,
        color: '#1e293b',
        padding: '52px 0 44px 0',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
      aria-labelledby="dumpster-sizes-heading"
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {tagline && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {tagline}
            </span>
          )}
          <h2
            id="dumpster-sizes-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
              fontWeight: 800,
              color: '#0f172a',
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            {sectionTitle}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '6px auto 0 auto', maxWidth: '640px', lineHeight: 1.45 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* 3-Column Comparison Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {rollOffDumpsters.map((product) => (
            <DumpsterSizeCard
              key={product.id}
              product={product}
              customBestFor={customBestFors ? customBestFors[product.id] : undefined}
              buttonLabel={buttonLabel}
              targetId={targetId}
              detailUrl={useDetailLinks ? DUMPSTER_DETAIL_URLS[product.id] : undefined}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
