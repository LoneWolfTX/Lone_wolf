'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Phone, Timer, MapPin, Coins, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';
import { trackPhoneClick, trackBookOnlineClick } from '@/lib/tracking';

export const Hero: React.FC = () => {
  const { content } = useSiteContent();
  const phone = content.business?.phone || content.contact?.phone || '(214) 876-8321';
  const phoneRaw = content.business?.phoneRaw || content.contact?.phoneRaw || '+12148768321';

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#07090D',
        color: '#ffffff',
        overflow: 'hidden',
      }}
      aria-label="Wolf Ridge Dumpsters Dallas-Fort Worth Hero"
    >
      {/* Background Image Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/hero/hero_cinematic.webp"
          alt="Wolf Ridge Dumpsters roll-off container on Dallas-Fort Worth construction site at sunset"
          fill
          priority
          sizes="100vw"
          className="hero-bg-image"
          style={{
            objectFit: 'cover',
            objectPosition: '72% 38%',
          }}
        />

        {/* Cinematic Directional Gradients */}
        {/* Left-to-Right Gradient: Protects Headline & CTAs while revealing dumpster on the right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(7, 9, 13, 0.98) 0%, rgba(7, 9, 13, 0.92) 34%, rgba(7, 9, 13, 0.68) 52%, rgba(7, 9, 13, 0.22) 75%, rgba(7, 9, 13, 0.05) 100%)',
          }}
        />

        {/* Top Vignette: Seamless blending under translucent header */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(180deg, rgba(7, 9, 13, 0.85) 0%, rgba(7, 9, 13, 0) 100%)',
          }}
        />

        {/* Bottom Vignette: Seamless integration into the Benefits Strip and Service Area */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(0deg, rgba(7, 9, 13, 1) 0%, rgba(7, 9, 13, 0.75) 50%, rgba(7, 9, 13, 0) 100%)',
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 'clamp(620px, 78vh, 820px)',
          paddingTop: 'clamp(32px, 5vh, 60px)',
        }}
      >
        {/* Main Content Area: Left-aligned editorial hierarchy */}
        <div
          style={{
            maxWidth: '680px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingBottom: '32px',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.82rem, 1.1vw, 0.96rem)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ED171F',
              marginBottom: '-4px',
            }}
          >
            DALLAS–FORT WORTH DUMPSTER RENTALS
          </div>

          {/* 3-Line Cinematic Headline */}
          <h1
            id="hero-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.7rem, 5.2vw, 4.65rem)',
              fontWeight: 800,
              lineHeight: 0.98,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            <span style={{ display: 'block', color: '#FFFFFF' }}>CLEANER JOB SITES.</span>
            <span style={{ display: 'block', color: '#ED171F' }}>STRONGER PROJECTS.</span>
            <span style={{ display: 'block', color: '#FFFFFF' }}>A CLEANER DFW.</span>
          </h1>

          {/* Supporting Description */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.98rem, 1.2vw, 1.12rem)',
              color: '#CBD5E1',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: '560px',
              textWrap: 'pretty',
            }}
          >
            Reliable dumpster rentals for residential, commercial, and construction projects — delivered across Dallas, Fort Worth, and surrounding cities.
          </p>

          {/* Google Verified Review Chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px 6px 8px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: 'fit-content',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Google "G" Badge */}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            {/* Rating Number */}
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '0.98rem',
                color: '#FFFFFF',
              }}
            >
              5.0
            </span>

            {/* 5 Stars */}
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#FACC15" color="#FACC15" />
              ))}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: '0.84rem',
                color: '#CBD5E1',
                marginLeft: '4px',
              }}
            >
              From Dallas–Fort Worth Customers
            </span>
          </div>

          {/* Dual CTAs Container */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'stretch',
              marginTop: '8px',
            }}
          >
            {/* Primary CTA: Vivid Wolf Ridge Red */}
            <a
              href="#quote"
              onClick={() => trackBookOnlineClick('hero_primary_button')}
              className="hero-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 26px',
                backgroundColor: '#ED171F',
                borderRadius: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(237, 23, 31, 0.45)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <Calendar size={22} color="#ffffff" strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.05,
                    letterSpacing: '0.04em',
                  }}
                >
                  GET A QUOTE
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.74rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.92)',
                    marginTop: '2px',
                  }}
                >
                  Fast. Free. No Obligation.
                </div>
              </div>
            </a>

            {/* Secondary CTA: Dark with Crisp Subtle Border */}
            <a
              href={`tel:${phoneRaw}`}
              onClick={() => trackPhoneClick('hero_secondary_button')}
              className="hero-cta-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 24px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.32)',
                borderRadius: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <Phone size={20} color="#ED171F" strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.05,
                    letterSpacing: '0.04em',
                  }}
                >
                  CALL OR TEXT
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#CBD5E1',
                    marginTop: '2px',
                  }}
                >
                  {phone}
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* 6. Integrated Benefits Strip at bottom of hero */}
        <div
          className="hero-benefits-strip"
          style={{
            position: 'relative',
            zIndex: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '20px',
            paddingBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Benefit 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(237, 23, 31, 0.12)',
                border: '1px solid rgba(237, 23, 31, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Timer size={20} color="#ED171F" strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                SAME-DAY DELIVERY
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '1px' }}>
                When available
              </div>
            </div>
          </div>

          {/* Benefit 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(237, 23, 31, 0.12)',
                border: '1px solid rgba(237, 23, 31, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={20} color="#ED171F" strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                DALLAS–FORT WORTH COVERAGE
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '1px' }}>
                On-time, every time
              </div>
            </div>
          </div>

          {/* Benefit 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(237, 23, 31, 0.12)',
                border: '1px solid rgba(237, 23, 31, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Coins size={20} color="#ED171F" strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                TRANSPARENT PRICING
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '1px' }}>
                No hidden fees
              </div>
            </div>
          </div>

          {/* Benefit 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(237, 23, 31, 0.12)',
                border: '1px solid rgba(237, 23, 31, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} color="#ED171F" strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                SAFE &amp; RELIABLE
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '1px' }}>
                Locally owned and operated
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
