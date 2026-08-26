'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';
import { trackPhoneClick } from '@/lib/tracking';

interface HorizontalCalloutProps {
  titleBlack?: string;
  titleRed?: string;
  description: string;
  checklist?: string[];
  buttonType?: 'link' | 'phone';
  buttonText?: string;
  buttonHref?: string;
}

export const HorizontalCallout: React.FC<HorizontalCalloutProps> = ({
  titleBlack = 'NEED FULL-SERVICE',
  titleRed = 'JUNK REMOVAL?',
  description,
  checklist,
  buttonType = 'phone',
  buttonText = `CALL OR TEXT ${siteSettings.contact.phone}`,
  buttonHref = '/junk-removal',
}) => {
  return (
    <section style={{ backgroundColor: '#ffffff', padding: '0 0 44px 0' }}>
      <div className="container">
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Graphic Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 280px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              <Truck size={36} color="#0f172a" />
            </div>

            {/* Middle: Title & Description */}
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  margin: '0 0 4px 0',
                  letterSpacing: '0.5px',
                  color: '#0f172a',
                }}
              >
                {titleBlack}{' '}
                <span style={{ color: 'var(--accent-red)' }}>{titleRed}</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                {description}
              </p>
            </div>
          </div>

          {/* Optional Checklist for Junk Removal */}
          {checklist && checklist.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px', flex: '1 1 300px' }}>
              {checklist.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
                  <CheckCircle2 size={14} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Right Action Button */}
          <div style={{ flexShrink: 0 }}>
            {buttonType === 'link' ? (
              <Link
                href={buttonHref}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  backgroundColor: '#0a0d12',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  letterSpacing: '0.6px',
                }}
              >
                <span>{buttonText}</span>
              </Link>
            ) : (
              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                onClick={() => trackPhoneClick('callout_phone')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  backgroundColor: '#0a0d12',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  letterSpacing: '0.6px',
                }}
              >
                <Phone size={16} className="text-accent" />
                <span>{buttonText}</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
