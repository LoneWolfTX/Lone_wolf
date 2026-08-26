'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Phone } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackBookOnlineClick, trackPhoneClick } from '@/lib/tracking';
import { getQuoteUrl } from '@/lib/ctaHelper';

interface ClosingCtaBannerProps {
  headline?: string;
  subheadline?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageObjectPosition?: string;
}

export const ClosingCtaBanner: React.FC<ClosingCtaBannerProps> = ({
  headline = 'READY TO RENT YOUR DUMPSTER?',
  subheadline = 'BOOK ONLINE OR CALL TODAY!',
  imageSrc = '/images/lone-wolf/real/contractor_environment_showcase.jpg',
  imageAlt = 'Real Lone Wolf Roll-Off Dumpster Ready for Delivery in DFW',
  imageObjectPosition = 'center center',
}) => {
  const pathname = usePathname();
  const quoteUrl = getQuoteUrl(pathname);

  return (
    <section
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '28px 0',
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image with Dark Vignette Overlay */}
      {imageSrc && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: imageObjectPosition,
              opacity: 0.22,
              filter: 'contrast(1.15) brightness(0.8)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.95) 100%)',
            }}
          />
        </div>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Text Block */}
          <div style={{ flex: '1 1 300px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'block',
                marginBottom: '2px',
              }}
            >
              SAME-DAY / NEXT-DAY DELIVERY AVAILABLE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '0.02em',
              }}
            >
              {headline}
              <br />
              <span style={{ color: '#ffffff' }}>{subheadline}</span>
            </h2>
          </div>

          {/* Center/Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              flex: '0 1 auto',
            }}
          >
            {/* Red Button */}
            <Link
              href={quoteUrl}
              onClick={() => trackBookOnlineClick('closing_cta_button')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                backgroundColor: 'var(--accent-red)',
                borderRadius: '4px',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              }}
            >
              <Calendar size={20} />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                  }}
                >
                  GET A QUOTE
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)' }}>
                  Fast, Free &amp; Easy
                </div>
              </div>
            </Link>

            {/* Call Button */}
            <a
              href={`tel:${siteSettings.contact.phoneRaw}`}
              onClick={() => trackPhoneClick('closing_cta_call')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid #334155',
                borderRadius: '4px',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <Phone size={18} style={{ color: 'var(--accent-red)' }} />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                  }}
                >
                  CALL {siteSettings.contact.phone}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Direct Dispatch</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
