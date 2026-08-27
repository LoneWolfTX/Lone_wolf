'use client';

import { useContractorCards } from '@/lib/useEditableContent';
import { PageHero } from '@/components/shared/PageHero';
import { BenefitIconGrid, BenefitItem } from '@/components/shared/BenefitIconGrid';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { HorizontalCallout } from '@/components/shared/HorizontalCallout';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';
import { Clock, Tag, Truck, ShieldCheck, Headphones } from 'lucide-react';

export default function ContractorPageClient() {
  const tradeCards = useContractorCards();

  const contractorBenefits: BenefitItem[] = [
    {
      icon: <Headphones size={26} />,
      title: 'DIRECT DISPATCH',
      desc: 'Direct coordination with local dispatch—never an outsourced call center.',
    },
    {
      icon: <Clock size={26} />,
      title: 'PRIORITY SCHEDULING',
      desc: 'Flexible morning and afternoon delivery windows to keep your job site moving smoothly.',
    },
    {
      icon: <Truck size={26} />,
      title: 'SWAPS WHEN AVAILABLE',
      desc: 'Fast container swaps and turnaround based on current schedule and dispatch availability.',
    },
    {
      icon: <Tag size={26} />,
      title: 'CONTRACTOR RATES',
      desc: 'Competitive rates and multi-load options for ongoing commercial and residential job sites.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'ITEMIZED INVOICING',
      desc: 'Clear itemized billing and official landfill scale weight tickets provided upon request.',
    },
  ];

  const contractorBestFors = {
    '15-yard-dumpster': 'Small remodels, bath gut, drywall, tile, and wood framing',
    '20-yard-dumpster': 'Kitchen remodels, siding, multi-room additions, framing scrap',
    '25-yard-dumpster': 'Commercial tenant build-outs, whole-structure clearouts, heavy framing debris',
  };

  return (
    <>
      {/* 1. Construction-Site Hero Matching Image 8 */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dumpster Rentals', href: '/dumpster-rentals' },
          { label: 'Contractors' },
        ]}
        headlineWhite="DUMPSTER RENTALS"
        headlineRed="BUILT FOR CONTRACTORS"
        description="Keep your job site clean, safe, and efficient. Direct dispatch, guaranteed windows, and same-day swaps across Dallas–Fort Worth."
        imageSrc="/images/lone-wolf/real/contractor_environment_showcase.jpg"
        imageAlt="Lone Wolf Heavy-Duty Roll-Off Dumpster on Job Site with Construction Debris"
        imageObjectPosition="center center"
      />

      {/* 2. "A Partner You Can Count On" Benefit Strip */}
      <BenefitIconGrid
        titleBlack="A CONTRACTOR PARTNER YOU CAN"
        titleRed="COUNT ON"
        subtitle="We know downtime costs you money. That's why general contractors, carpenters, and remodelers across DFW rely on Lone Wolf Dumpsters for zero-hassle job site waste logistics."
        items={contractorBenefits}
        columns={5}
        iconStyle="circle-red"
      />

      {/* 3. Three Dumpster Size Cards */}
      <DumpsterSizeGrid
        tagline="CONTRACTOR SIZES"
        sectionTitle="CHOOSE THE RIGHT CAPACITY FOR YOUR JOB SITE"
        customBestFors={contractorBestFors}
        buttonLabel="VIEW DETAILS →"
      />

      {/* 4. Trades We Serve Operational Grid */}
      <section style={{ backgroundColor: '#f8fafc', padding: '52px 0 44px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
              TRADE LOGISTICS
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              BUILT FOR DFW <span style={{ color: 'var(--accent-red)' }}>TRADE CONTRACTORS</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '6px auto 0 auto', maxWidth: '620px' }}>
              From custom carpentry to commercial renovations, we customize delivery schedules to your crew&apos;s workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {tradeCards.map((card) => (
              <div key={card.id} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                {card.tag && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '3px' }}>
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
        </div>
      </section>

      {/* 5. Need Regular Dumpster Service? Callout */}
      <HorizontalCallout
        titleBlack="NEED RECURRING COMMERCIAL SWAPS?"
        titleRed="TALK TO LOCAL DISPATCH."
        description="Call or text our dispatch line to set up custom volume pricing, scheduled container rotations, and direct billing terms."
        buttonType="phone"
        buttonText={`CALL OR TEXT ${siteSettings.contact.phone}`}
      />

      {/* 5. 2-Column Contractor FAQ Preview */}
      <FAQAccordion
        titleBlack="FREQUENTLY ASKED"
        titleRed="QUESTIONS"
        showViewAllLink={true}
        viewAllHref="/faq"
      />

      {/* 6. Contractor-Specific Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO KEEP YOUR JOB SITE CLEAN"
        subheadline="AND YOUR PROJECT ON SCHEDULE?"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Contractor Dumpster"
      />
    </>
  );
}
