'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { dumpsterProducts } from '@/data/dumpsters';
import { DumpsterCard } from './DumpsterCard';
import { siteSettings } from '@/data/siteSettings';

export const DumpsterSelection: React.FC = () => {
  const rollOffDumpsters = dumpsterProducts.filter((product) => product.category === 'dumpster' && product.active);

  return (
    <section
      id="dumpster-sizes"
      style={{
        backgroundColor: '#f8fafc',
        color: '#1e293b',
        padding: '40px 0 32px 0',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
      aria-labelledby="dumpster-sizes-heading"
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            FLAT-RATE ROLL-OFF DUMPSTERS
          </span>
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
            CHOOSE YOUR SIZE &bull; <span style={{ color: 'var(--accent-red)' }}>UPFRONT DFW PRICING</span>
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '6px auto 0 auto', maxWidth: '600px', lineHeight: 1.4 }}>
            Includes delivery, pickup, wood driveway protection, and included weight. No hidden fees.
          </p>
        </div>

        {/* 3-Dumpster Cards 3-Column Comparison Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
            marginBottom: '32px',
          }}
        >
          {rollOffDumpsters.map((product) => (
            <DumpsterCard key={product.id} product={product} />
          ))}
        </div>

        {/* SECONDARY JUNK REMOVAL COMPACT STRIP (CTA PLACEMENT #2) */}
        <div
          className="junk-banner-responsive"
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '1px solid #1e293b',
            borderLeft: '4px solid var(--accent-red)',
            borderRadius: '8px',
            padding: '16px 24px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Left: Icon & Pitch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '6px',
                backgroundColor: 'var(--accent-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <Truck size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ★ FULL-SERVICE ADD-ON ★
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                  Need Us To Do The Heavy Lifting?
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: '1.35' }}>
                Full-service junk removal crew starting at $150. We load, haul away, and sweep up.
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', flex: '0 0 auto' }}>
            <Link
              href="/junk-removal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: 'var(--accent-red)',
                color: '#ffffff',
                borderRadius: '4px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <span>Junk Removal &rarr;</span>
            </Link>

            <a
              href={`tel:${siteSettings.contact.phoneRaw}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={13} className="text-accent" />
              <span>Call / Text</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
