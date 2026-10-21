'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ArrowRight, MapPin } from 'lucide-react';

export const PremiumServiceAreaSection: React.FC = () => {
  const dumpsterSizes = [
    { label: '15 YARD', href: '/dumpster-rentals/15-yard' },
    { label: '20 YARD', href: '/dumpster-rentals/20-yard' },
    { label: '25 YARD', href: '/dumpster-rentals/25-yard' },
    { label: '30 YARD', href: '/dumpster-rentals/contractor' },
    { label: '40 YARD', href: '/dumpster-rentals/commercial' },
  ];

  return (
    <section
      className="service-area-hero-strip"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#06080C',
        borderTop: '1px solid #1A2230',
        borderBottom: '1px solid #1A2230',
        paddingTop: 'clamp(36px, 4.5vw, 56px)',
        paddingBottom: 'clamp(36px, 4.5vw, 56px)',
        overflow: 'hidden',
      }}
      aria-label="Dallas Fort Worth Service Areas and Dumpster Sizes"
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(24px, 3.5vw, 40px)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Serving DFW Headline & Link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.84rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#ED171F',
              }}
            >
              SERVING
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.4vw, 2.35rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              DALLAS, FORT WORTH<br />&amp; 48 SURROUNDING CITIES
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.94rem',
                lineHeight: 1.55,
                color: '#94A3B8',
                margin: '4px 0 12px 0',
                maxWidth: '380px',
              }}
            >
              From homeowners to major job sites, we provide dependable dumpster rental services across the entire DFW Metroplex.
            </p>

            <Link
              href="/service-areas"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.94rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#ED171F',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'gap 0.2s ease, color 0.2s ease',
                width: 'fit-content',
              }}
              className="service-area-arrow-link"
            >
              <span>VIEW SERVICE AREAS</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Center Column: Stylized Dark DFW Geographic Map */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
              minHeight: '200px',
            }}
          >
            <Link
              href="/service-areas"
              style={{
                display: 'block',
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                aspectRatio: '350 / 190',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #222D3D',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
                backgroundColor: '#090D14',
                textDecoration: 'none',
              }}
              title="Click to explore all 48 DFW service area cities"
            >
              <Image
                src="/images/hero/dfw_map_center@2x.png"
                alt="Stylized dark Dallas-Fort Worth service area map highlighting coverage in Dallas, Fort Worth, and 48 surrounding cities"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              
              {/* Subtle hover overlay */}
              <div
                className="map-hover-hint"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(237, 23, 31, 0.04)',
                  transition: 'background-color 0.2s ease',
                }}
              />
            </Link>
          </div>

          {/* Right Column: Dark Framed Dumpster Sizes Panel */}
          <div
            style={{
              backgroundColor: '#0B0F17',
              border: '1px solid #202A3B',
              borderRadius: '8px',
              padding: '20px 22px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Header: Red Truck + DUMPSTER SIZES */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(237, 23, 31, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={18} color="#ED171F" strokeWidth={2.4} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                }}
              >
                DUMPSTER SIZES
              </span>
            </div>

            {/* Size Options Grid (matching reference mockup: 3 on row 1, 2 on row 2) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Row 1: 15 YARD, 20 YARD, 25 YARD */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {dumpsterSizes.slice(0, 3).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 4px',
                      backgroundColor: '#121824',
                      border: '1px solid #243044',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                    className="dumpster-size-pill"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Row 2: 30 YARD, 40 YARD */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}
              >
                {dumpsterSizes.slice(3, 5).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 4px',
                      backgroundColor: '#121824',
                      border: '1px solid #243044',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                    className="dumpster-size-pill"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Red View Dumpster Options Button */}
            <Link
              href="/dumpster-rentals"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#ED171F',
                borderRadius: '4px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(237, 23, 31, 0.4)',
                transition: 'all 0.15s ease',
                marginTop: '4px',
              }}
              className="view-options-btn"
            >
              <span>VIEW DUMPSTER OPTIONS</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
