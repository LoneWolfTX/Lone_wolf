'use client';

import React from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { Home, HardHat, Building2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';

export default function DumpsterRentalsClient() {
  const { content: siteContent } = useSiteContent();

  const heroImg = siteContent.pageHeroes?.dumpsterRentals || {
    src: '/images/lone-wolf/lone_wolf_hero_top.png',
    alt: 'Lone Wolf Dumpsters roll-off truck with black dumpster serving the Dallas-Fort Worth area',
    position: 'center right'
  };

  const audiences = [
    {
      title: 'Residential Projects',
      desc: 'Home cleanouts, remodeling projects, estate clearouts, and yard debris clearouts.',
      href: '/dumpster-rentals/residential',
      icon: <Home size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Contractors & Job Sites',
      desc: 'Construction, Remodeling, General Contractors, and Reliable Swaps.',
      href: '/dumpster-rentals/contractor',
      icon: <HardHat size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Commercial Properties',
      desc: 'Warehouses, Offices, Retail Spaces, Distribution & Logistics Centers, Cardboard & Packaging Waste, Commercial Cleanouts, and Facility Waste.',
      href: '/dumpster-rentals/commercial',
      icon: <Building2 size={28} color="var(--accent-red)" />,
    },
  ];

  const allowedMaterials = [
    'Construction Debris',
    'Drywall',
    'Wood',
    'Furniture',
    'Cardboard & Packaging',
    'General Household Junk',
    'Yard & Landscaping Debris',
  ];

  const prohibitedMaterials = [
    'Concrete, Dirt, Rock, Brick & Asphalt',
    'Wet Paints, Stains & Solvents',
    'Gasoline, Oil & Flammable Liquids',
    'Car & Truck Tires',
    'Lead-Acid Batteries',
    'Propane Tanks & Compressed Gas Cylinders',
    'Asbestos & Hazardous Materials',
    'AC Units',
    'Refrigerators containing Freon – Ask First',
  ];

  return (
    <>
      {/* 1. Target-Style Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dumpster Rentals' },
        ]}
        headlineWhite="ROLL-OFF DUMPSTER RENTALS"
        headlineRed="ACROSS DALLAS–FORT WORTH"
        description="Choose from our 15, 20, and 25-yard heavy-duty roll-off containers. Flat-rate pricing, generous weight allowances, and driveway protection included."
        imageSrc={heroImg.src}
        imageAlt={heroImg.alt}
        imageObjectPosition={heroImg.position || 'center right'}
      />

      {/* 2. Three-Size Pricing Section */}
      <DumpsterSizeGrid
        tagline="DUMPSTER SIZES & PRICING"
        sectionTitle="CHOOSE THE RIGHT SIZE FOR YOUR PROJECT"
        subtitle="Every rental includes prompt delivery, wood driveway protection, included weight, and flexible rental periods."
        buttonLabel="VIEW DETAILS →"
      />

      {/* 3. Audience Choices (Residential, Contractor, Commercial) */}
      <section style={{ backgroundColor: '#f8fafc', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
              WHO WE SERVE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              TAILORED SOLUTIONS FOR EVERY PROJECT
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {audiences.map((aud, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ marginBottom: '12px' }}>{aud.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                    {aud.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {aud.desc}
                  </p>
                </div>
                <Link
                  href={aud.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-red)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                  }}
                  className="hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Allowed & Prohibited Materials */}
      <section style={{ backgroundColor: '#ffffff', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
              GUIDELINES
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              WHAT GOES IN THE DUMPSTER?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Allowed */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 size={24} color="#16a34a" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#166534', margin: 0, textTransform: 'uppercase' }}>
                  Allowed Materials
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allowedMaterials.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#15803d' }}>
                    <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prohibited */}
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <XCircle size={24} color="#dc2626" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', margin: 0, textTransform: 'uppercase' }}>
                  Prohibited Materials
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {prohibitedMaterials.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#b91c1c' }}>
                    <XCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Accordion */}
      <FAQAccordion
        tagline="COMMON QUESTIONS"
        titleBlack="DUMPSTER RENTAL"
        titleRed="FAQ"
      />

      {/* 6. Closing CTA Banner */}
      <ClosingCtaBanner
        headline="READY TO SCHEDULE YOUR DUMPSTER?"
        subheadline="CALL, TEXT, OR GET AN INSTANT ONLINE QUOTE"
      />
    </>
  );
}
