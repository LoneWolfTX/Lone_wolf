'use client';

import React from 'react';
import Image from 'next/image';
import { PageHero } from '@/components/shared/PageHero';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';
import { useSiteContent } from '@/lib/useEditableContent';
import {
  Truck,
  Sparkles,
  Clock,
  CircleDollarSign,
  Sofa,
  Refrigerator,
  TreePine,
  Home,
  Building,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function JunkRemovalClient() {
  const { content: siteContent } = useSiteContent();

  const heroImg = siteContent.pageHeroes?.junkRemoval || {
    src: '/images/lone-wolf/lone_wolf_hero_debris.png',
    alt: 'Black roll-off dumpster loaded with renovation and cleanup debris',
    position: 'center center'
  };

  const haulAwayItems = [
    {
      title: 'Furniture & Mattresses',
      desc: 'Couches, recliners, dressers, dining sets, mattresses & box springs.',
      icon: <Sofa size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Appliances & Electronics',
      desc: 'Washers, dryers, ovens, water heaters, TVs, monitors & computers.',
      icon: <Refrigerator size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Yard Waste & Debris',
      desc: 'Tree branches, brush, storm debris, fence panels & landscaping waste.',
      icon: <TreePine size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Garage & Attic Cleanouts',
      desc: 'Boxes, old tools, clutter, exercise equipment & miscellaneous junk.',
      icon: <Home size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Estate & Eviction Cleanouts',
      desc: 'Whole-house property cleanouts handled with speed, respect & care.',
      icon: <Sparkles size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Commercial Junk Removal',
      desc: 'Office furniture, retail fixtures, pallets, warehouse waste & demo debris.',
      icon: <Building size={28} color="var(--accent-red)" />,
    },
  ];

  return (
    <>
      {/* 1. Target-Style Photographic Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Junk Removal' },
        ]}
        headlineWhite="DFW JUNK & TRASH"
        headlineRed="REMOVAL SERVICES"
        description="Don't want to lift a finger? Our full-service crew loads, hauls away, and sweeps up. Starting at just $150 with upfront volume pricing."
        imageSrc={heroImg.src}
        imageAlt={heroImg.alt}
        imageObjectPosition={heroImg.position || 'center center'}
        badgeText="FULL-SERVICE ADD-ON • STARTING AT $150"
      />

      {/* 2. Heavy Lifting Section */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              }}
            >
              <Image
                src="/images/lone-wolf/gallery/25.png"
                alt="Lone Wolf Roll-Off Dumpster and Hauling Equipment in DFW"
                fill
                sizes="(min-width: 1200px) 580px, 100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div>
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
                FULL-SERVICE CREW
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  margin: '0 0 16px 0',
                }}
              >
                WE DO THE <span style={{ color: 'var(--accent-red)' }}>HEAVY LIFTING</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                Need unwanted items gone without renting and loading a container yourself? Lone Wolf Dumpsters provides complete full-service junk and debris removal across Dallas–Fort Worth. Our uniformed crew handles everything: loading, hauling, landfill disposal, and final sweeping.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>We Load &amp; Sweep Up</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Upfront Flat Rates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Same-Day Windows</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Eco-Conscious Disposal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Items We Haul Away */}
      <section style={{ backgroundColor: '#f8fafc', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
              WHAT WE TAKE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)',
                fontWeight: 800,
                color: '#0f172a',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              ITEMS WE <span style={{ color: 'var(--accent-red)' }}>HAUL AWAY</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {haulAwayItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      textTransform: 'uppercase',
                      margin: '0 0 6px 0',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Instant Quote Form */}
      <section style={{ backgroundColor: '#ffffff', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <FreeQuoteForm />
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <ClosingCtaBanner
        headline="GET RID OF YOUR JUNK TODAY"
        subheadline="CALL OR TEXT FOR RAPID JUNK REMOVAL DISPATCH"
      />
    </>
  );
}
