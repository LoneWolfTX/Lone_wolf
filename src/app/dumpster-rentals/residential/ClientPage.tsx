'use client';

import React from 'react';
import Link from 'next/link';
import { useResidentialCards } from '@/lib/useEditableContent';
import { PageHero } from '@/components/shared/PageHero';
import { BenefitIconGrid, BenefitItem } from '@/components/shared/BenefitIconGrid';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { HorizontalCallout } from '@/components/shared/HorizontalCallout';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';
import { Calendar, ThumbsUp, CircleDollarSign, ShieldCheck } from 'lucide-react';

export default function ResidentialPageClient() {
  const projectCards = useResidentialCards();

  const residentialBenefits: BenefitItem[] = [
    {
      icon: <Calendar size={26} />,
      title: 'FAST DELIVERY',
      desc: 'We deliver your dumpster right when you need it.',
    },
    {
      icon: <ThumbsUp size={26} />,
      title: 'EASY TO USE',
      desc: 'Fill it up at your own pace. We handle the rest.',
    },
    {
      icon: <CircleDollarSign size={26} />,
      title: 'AFFORDABLE PRICING',
      desc: 'Upfront pricing with no hidden fees.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'RELIABLE SERVICE',
      desc: 'Locally owned & operated. Proudly serving our community.',
    },
  ];

  const residentialBestFors = {
    '15-yard-dumpster': 'Small cleanouts, garage cleanouts, yard debris, light projects',
    '20-yard-dumpster': 'Medium projects, kitchen renovations, home cleanouts, decluttering',
    '25-yard-dumpster': 'Large projects, construction, estate cleanouts, commercial use',
  };

  return (
    <>
      {/* 1. Residential Hero Matching Image 9 */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dumpster Rentals', href: '/dumpster-rentals' },
          { label: 'Residential' },
        ]}
        headlineWhite="RESIDENTIAL"
        headlineRed="DUMPSTER RENTALS"
        description="The easy way to clean up your home and property. Perfect for DIY projects, home cleanouts, renovations, and yard debris."
        imageSrc="/images/lone-wolf/real/residential_environment_showcase.jpg"
        imageAlt="Lone Wolf Residential Roll-Off Dumpster on Driveway in Front of Texas Suburban Home"
        imageObjectPosition="center center"
      />

      {/* 2. "Making Home Cleanups Simple" Benefit Strip */}
      <BenefitIconGrid
        titleBlack="MAKING HOME CLEANUPS"
        titleRed="SIMPLE"
        subtitle="Our residential dumpster rentals are perfect for homeowners tackling clutter, remodeling, landscaping, or garage cleanouts. We deliver on time, place it where you need it, and pick it up when you're done."
        items={residentialBenefits}
        columns={4}
        iconStyle="circle-red"
      />

      {/* 3. Three Dumpster Size Cards (15yd, 20yd [Most Popular], 25yd) */}
      <DumpsterSizeGrid
        tagline="DUMPSTER SIZES"
        sectionTitle="CHOOSE THE RIGHT SIZE FOR YOUR PROJECT"
        customBestFors={residentialBestFors}
        buttonLabel="VIEW DETAILS →"
      />

      {/* 4. Specific Common Residential Projects Grid */}
      <section style={{ backgroundColor: '#f8fafc', padding: '52px 0 44px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
              PROJECT SOLUTIONS
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              COMMON RESIDENTIAL PROJECTS <span style={{ color: 'var(--accent-red)' }}>WE HANDLE</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '6px auto 0 auto', maxWidth: '600px' }}>
              Whether you are decluttering a weekend project or clearing out an entire property, our roll-offs keep your driveway protected.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {projectCards.map((card) => (
              <div key={card.id} style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                {card.tag && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '3px' }}>
                    {card.tag}
                  </span>
                )}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '10px 0 6px 0' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Driveway Safe Guarantee Callout */}
          <div style={{ marginTop: '28px', backgroundColor: '#0a0d12', color: '#ffffff', padding: '20px 24px', borderRadius: '6px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <ShieldCheck size={28} color="var(--accent-red)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  DRIVEWAY PROTECTION GUARANTEE
                </div>
                <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                  We place heavy-duty wooden protective boards underneath every steel roller on every residential delivery.
                </div>
              </div>
            </div>
            <Link href="/contact/#quote" style={{ backgroundColor: 'var(--accent-red)', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', padding: '8px 18px', borderRadius: '4px', textDecoration: 'none', textTransform: 'uppercase' }}>
              RESERVE DUMPSTER
            </Link>
          </div>
        </div>
      </section>

      <HorizontalCallout
        titleBlack="NEED HELP"
        titleRed="CHOOSING?"
        description="Not sure which size is right for you? Give us a call or text and we'll help you find the perfect dumpster for your project."
        buttonType="phone"
        buttonText={`CALL OR TEXT ${siteSettings.contact.phone}`}
      />

      {/* 5. 2-Column FAQ Preview */}
      <FAQAccordion
        titleBlack="FREQUENTLY ASKED"
        titleRed="QUESTIONS"
        showViewAllLink={false}
      />

      {/* 6. Route-Specific Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO START YOUR CLEANUP?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Residential Dumpster"
      />
    </>
  );
}
