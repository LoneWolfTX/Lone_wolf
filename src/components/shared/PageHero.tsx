'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, Star } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackBookOnlineClick, trackPhoneClick } from '@/lib/tracking';
import { getQuoteUrl } from '@/lib/ctaHelper';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TrustItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  headlineWhite: string;
  headlineRed: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  showRating?: boolean;
  trustItems?: TrustItem[];
  badgeText?: string;
  imageObjectPosition?: string;
  overlayGradient?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  breadcrumbs,
  headlineWhite,
  headlineRed,
  description,
  imageSrc = '/images/lone-wolf/hero_homepage_cinematic.jpg',
  imageAlt = 'Lone Wolf Roll-Off Dumpster Rental in DFW',
  showRating = false,
  trustItems,
  badgeText,
  imageObjectPosition = 'right center',
  overlayGradient,
}) => {
  const pathname = usePathname();
  const quoteUrl = getQuoteUrl(pathname);
  const hasImage = imageSrc && imageSrc !== 'none';
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    setImageLoaded(false);
  }, [imageSrc]);

  return (
    <section
      className="page-hero-container"
      style={{
        backgroundColor: '#070a0f',
        backgroundImage: 'radial-gradient(ellipse at 70% 30%, rgba(30, 41, 59, 0.45) 0%, rgba(7, 10, 15, 1) 75%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #1e293b',
        padding: '36px 0 48px 0',
      }}
      aria-label="Hero Section"
    >
      {/* Background Soft Glow / Ambient Backdrop (Homepage Only) */}
      {hasImage && pathname === '/' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.12,
            filter: 'blur(30px) scale(1.1)',
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* 1. Breadcrumbs Trail */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            style={{
              marginBottom: '16px',
              fontSize: '0.82rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span style={{ color: '#475569' }}>/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    className="hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* 2. Main Hero Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasImage ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Headlines & CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Optional Badge */}
            {badgeText && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: 'var(--accent-red)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  padding: '4px 12px',
                  borderRadius: '4px',
                }}
              >
                {badgeText}
              </div>
            )}

            {/* Main Page H1 Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 4vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              <span style={{ color: '#ffffff', display: 'block' }}>{headlineWhite}</span>{' '}
              <span style={{ color: 'var(--accent-red)', display: 'block' }}>{headlineRed}</span>
            </h1>

            {/* Sub-headline / Narrative Lead */}
            <p
              style={{
                fontSize: 'clamp(0.98rem, 1.8vw, 1.12rem)',
                color: '#cbd5e1',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '640px',
              }}
            >
              {description}
            </p>

            {/* Optional Rating Badge */}
            {showRating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  width: 'fit-content',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#4285f4',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '2px',
                  }}
                >
                  G
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>5.0</span>
                <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#eab308" color="#eab308" />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>5.0 Rated DFW Dumpster Service</span>
              </div>
            )}

            {/* Dual Action Buttons */}
            <div
              className="hero-actions-row"
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '8px',
              }}
            >
              <Link
                href={quoteUrl}
                onClick={() => trackBookOnlineClick('hero_primary')}
                className="btn-glow"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  textTransform: 'uppercase',
                  padding: '14px 24px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Calendar size={18} />
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div>GET A QUOTE</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.9, textTransform: 'none' }}>
                    Fast, Free &amp; Easy
                  </div>
                </div>
              </Link>

              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                onClick={() => trackPhoneClick('hero_secondary')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  textTransform: 'uppercase',
                  padding: '14px 22px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  letterSpacing: '0.5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Phone size={18} style={{ color: 'var(--accent-red)' }} />
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div>CALL OR TEXT</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>
                    {siteSettings.contact.phone}
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Full Environmental Showcase Image Card */}
          {hasImage && (
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #334155',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
                aspectRatio: '16/10',
                maxHeight: '440px',
                width: '100%',
                backgroundColor: '#0f172a',
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 650px"
                onLoad={() => setImageLoaded(true)}
                style={{
                  objectFit: 'cover',
                  objectPosition: imageObjectPosition,
                  opacity: imageLoaded ? 1 : 0.05,
                  transition: 'opacity 0.18s ease-in-out',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}
        </div>

        {/* 3. Optional Bottom Trust Feature Badges */}
        {trustItems && trustItems.length > 0 && (
          <div
            style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(51, 65, 85, 0.6)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {trustItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.15)',
                    color: 'var(--accent-red)',
                    padding: '8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', color: '#ffffff' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
