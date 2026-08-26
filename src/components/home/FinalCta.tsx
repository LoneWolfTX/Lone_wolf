'use client';

import React from 'react';
import { Calendar, Phone } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackBookOnlineClick, trackPhoneClick } from '@/lib/tracking';

export const FinalCta: React.FC = () => {
  return (
    <section style={{ backgroundColor: '#000000', color: '#ffffff', padding: '36px 0', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }} aria-label="Bottom Call to Action">
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {/* Left Text */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              READY TO RENT YOUR DUMPSTER?<br />
              <span style={{ color: '#ffffff' }}>BOOK ONLINE OR CALL TODAY!</span>
            </h2>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            {/* Red Button */}
            <a
              href="#quote"
              onClick={() => trackBookOnlineClick('bottom_cta_button')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                backgroundColor: 'var(--accent-red)',
                borderRadius: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              }}
            >
              <Calendar size={22} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.1 }}>
                  BOOK ONLINE
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>
                  Fast, Easy, Convenient.
                </div>
              </div>
            </a>

            {/* Dark Button */}
            <a
              href={`tel:${siteSettings.contact.phoneRaw}`}
              onClick={() => trackPhoneClick('bottom_cta_phone')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                backgroundColor: '#0a0d12',
                border: '1px solid #2f3e54',
                borderRadius: '6px',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <Phone size={20} className="text-accent" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.1 }}>
                  CALL OR TEXT
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {siteSettings.contact.phone}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
