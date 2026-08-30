'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { serviceAreas } from '@/data/serviceAreas';
import { cityServiceAreas } from '@/data/cityServiceAreas';
import { siteSettings } from '@/data/siteSettings';
import { Button } from '@/components/ui/Button';

export const ServiceAreaSection: React.FC = () => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const popularCities = cityServiceAreas.slice(0, 18);

  return (
    <section className="service-area-clean-section" style={{ backgroundColor: '#f8fafc', color: '#1e293b', padding: '68px 0', borderBottom: '1px solid #e2e8f0' }} aria-labelledby="service-area-heading">
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          
          {/* Left Column: Editorial Summary */}
          <div>
            <div className="patriotic-divider-mini">
              <span className="mini-line-red" />
              <span className="mini-star" style={{ color: '#0f172a' }}>★</span>
              <span className="mini-line-blue" />
            </div>

            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
              SERVICE COVERAGE
            </span>
            <h2 id="service-area-heading" className="section-title" style={{ color: '#0f172a', textAlign: 'left', fontSize: 'clamp(2rem, 4vw, 2.7rem)', marginBottom: '12px' }}>
              PROUDLY SERVING <span className="text-accent">DALLAS–FORT WORTH</span>
            </h2>

            <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
              Lone Wolf Dumpsters provides prompt roll-off container delivery across <strong>Dallas, Tarrant, and Denton Counties</strong> with guaranteed driveway protection and flexible rental periods.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <Button href="/service-areas" variant="primary" size="md">
                <span>VIEW ALL 48 SERVICE AREAS</span>
                <ArrowRight size={15} />
              </Button>

              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  textDecoration: 'none',
                }}
              >
                <Phone size={16} className="text-accent" />
                <span>Call {siteSettings.contact.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: 4-County Breakdown & Popular Cities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {serviceAreas.map((area) => (
                <div
                  key={area.county}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px 18px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0f172a', fontSize: '0.96rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <MapPin size={15} className="text-accent" />
                    <span>{area.county}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {area.cities.slice(0, 4).join(', ')}...
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Cities Strip - Clickable Links */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '18px 20px',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                POPULAR DELIVERY MUNICIPALITIES (CLICK FOR LOCAL INFO):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(mobileExpanded ? popularCities : popularCities.slice(0, 10)).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/service-areas/${city.slug}`}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.color = 'var(--accent-red)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.color = '#0f172a';
                    }}
                  >
                    {city.cityName}
                  </Link>
                ))}
              </div>

              {/* Mobile View All Cities Toggle */}
              <button
                type="button"
                className="nav-mobile-only"
                onClick={() => setMobileExpanded(!mobileExpanded)}
                style={{
                  display: 'none',
                  marginTop: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {mobileExpanded ? 'Show Fewer Cities −' : 'View All Service Areas +'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
