import { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { Home, HardHat, Building2, CheckCircle2, XCircle, Tag, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roll-Off Dumpster Rentals in DFW | Lone Wolf Dumpsters',
  description: 'Rent 15, 20, and 25-yard roll-off dumpsters in Dallas-Fort Worth. Upfront flat-rate pricing, driveway protection, 3, 5, or 7-day rentals.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/dumpster-rentals',
  },
};

export default function DumpsterRentalsPage() {
  const audiences = [
    {
      title: 'Residential Projects',
      desc: 'Home cleanouts, remodeling, attic cleanup, and yard debris.',
      href: '/dumpster-rentals/residential',
      icon: <Home size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Contractors & Job Sites',
      desc: 'Roofing, remodeling, construction, demo, and reliable swaps.',
      href: '/dumpster-rentals/contractor',
      icon: <HardHat size={28} color="var(--accent-red)" />,
    },
    {
      title: 'Commercial Properties',
      desc: 'Warehouses, offices, retail spaces, and facility waste.',
      href: '/dumpster-rentals/commercial',
      icon: <Building2 size={28} color="var(--accent-red)" />,
    },
  ];

  const allowedMaterials = [
    'Household Furniture & Mattresses',
    'Construction Debris & Drywall',
    'Roofing Shingles & Siding',
    'Yard Debris, Branches & Brush',
    'Carpet, Flooring & Cabinets',
    'Appliances (Non-Freon)',
  ];

  const prohibitedMaterials = [
    'Concrete, Dirt, Rock, Brick & Asphalt',
    'Wet Paints, Stains & Chemicals',
    'Motor Oil, Gasoline & Fuels',
    'Vehicle Tires & Car Batteries',
    'Propane Tanks & Explosives',
    'Asbestos & Medical Bio-Waste',
    'Freon Refrigerators & AC Units',
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
        imageSrc="/images/lone-wolf/real/hero_fleet_environment.jpg"
        imageAlt="Lone Wolf Roll-Off Dumpster Fleet Ready for Delivery"
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
                  borderRadius: '6px',
                  padding: '24px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    {aud.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '6px' }}>
                    {aud.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 16px 0' }}>
                    {aud.desc}
                  </p>
                </div>

                <Link
                  href={aud.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: 'var(--accent-red)',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  <span>Learn More</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Allowed vs Prohibited Materials Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
              DISPOSAL GUIDELINES
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              WHAT CAN GO IN YOUR DUMPSTER?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Allowed Items Card */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle2 size={24} color="#16a34a" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', margin: 0 }}>
                  ALLOWED MATERIALS
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                {allowedMaterials.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#16a34a', fontWeight: 900 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prohibited Items Card */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #fecaca', borderRadius: '6px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <XCircle size={24} color="var(--accent-red)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#991b1b', margin: 0 }}>
                  PROHIBITED MATERIALS
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                {prohibitedMaterials.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-red)', fontWeight: 900 }}>✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 5. FAQ Preview */}
      <FAQAccordion
        titleBlack="FREQUENTLY ASKED"
        titleRed="QUESTIONS"
        showViewAllLink={true}
        viewAllHref="/faq"
      />

      {/* 6. Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Dumpster Service"
      />
    </>
  );
}
