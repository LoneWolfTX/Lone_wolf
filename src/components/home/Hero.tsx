'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Calendar, ShieldCheck, MapPin, Truck, Star, CircleDollarSign } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatPhoneNumber } from '@/lib/formatters';
import { trackPhoneClick, trackBookOnlineClick } from '@/lib/tracking';

export const Hero: React.FC = () => {
  const { content } = useSiteContent();
  const phone = formatPhoneNumber(content.business?.phone || content.contact?.phone);
  const phoneRaw = content.business?.phoneRaw || content.contact?.phoneRaw || '+12148760321';
  return (
    <section className="hero-section" style={{ backgroundColor: '#000000', color: '#ffffff', borderBottom: '1px solid #1e293b' }} aria-labelledby="hero-heading">
      <div className="container">
        
        {/* Main 2-Column Hero Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            paddingTop: '14px',
            paddingBottom: '16px',
          }}
        >
          {/* Left Column: Headline, Rating, and CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Core Dumpster Rental Headline in Two Strong Lines */}
            <h1
              id="hero-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                margin: 0,
              }}
            >
              FAST &amp; AFFORDABLE<br />
              <span style={{ color: 'var(--accent-red)' }}>DUMPSTER RENTALS IN DFW</span>
            </h1>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0, maxWidth: '520px' }}>
              Driveway-safe roll-off dumpsters for cleanouts, remodeling, roofing, and contractor job sites across Dallas–Fort Worth.
            </p>

            {/* Google Rating Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  color: '#4285F4',
                }}
              >
                G
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>5.0</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#eab308" color="#eab308" />
                  ))}
                </div>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>5.0 Rated DFW Dumpster Service</span>
            </div>

            {/* Dual CTAs (CTA Placement #1) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
              {/* Red Book Online Button */}
              <a
                href="#quote"
                onClick={() => trackBookOnlineClick('hero_primary_button')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 22px',
                  backgroundColor: 'var(--accent-red)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                }}
              >
                <Calendar size={20} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1 }}>
                    BOOK ONLINE
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)' }}>
                    Instant Quote &amp; Dispatch
                  </div>
                </div>
              </a>

              {/* Dark Get a Quote / Call Button */}
              <a
                href={`tel:${phoneRaw}`}
                onClick={() => trackPhoneClick('hero_quote_button')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  backgroundColor: '#0a0d12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                <Phone size={18} className="text-accent" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1 }}>
                    CALL OR TEXT
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                    {phone}
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Lone Wolf Roll-Off Dumpster Fleet Photo */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.7)', backgroundColor: '#0a0d14' }}>
            <Image
              src="/images/lone-wolf/real/hero_fleet_environment.jpg"
              alt="Lone Wolf Roll-Off Dumpster Fleet Lineup in DFW"
              fill
              priority
              sizes="(min-width: 1200px) 620px, 100vw"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
          </div>
        </div>

        {/* 4-Item Compact Trust Strip */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '12px',
            paddingBottom: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={17} className="text-accent" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
                SAME-DAY DELIVERY
              </span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                Across DFW Metroplex
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CircleDollarSign size={17} className="text-accent" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
                UPFRONT FLAT RATES
              </span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                No hidden fuel/trip fees
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={17} className="text-accent" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
                DRIVEWAY PROTECTION
              </span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                Protective wood boards
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={17} className="text-accent" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff' }}>
                LOCAL OWNER-OPERATOR
              </span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                Direct owner-operated dispatch
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
