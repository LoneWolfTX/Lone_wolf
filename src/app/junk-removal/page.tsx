import { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/shared/PageHero';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';
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

export const metadata: Metadata = {
  title: 'Full-Service Junk & Trash Removal in DFW | Lone Wolf Dumpsters',
  description: 'Full-service junk removal crew across Dallas-Fort Worth starting at $150. We load, haul away, and sweep up. Furniture, appliances, estate cleanouts, yard waste.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/junk-removal',
  },
};

export default function JunkRemovalPage() {
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
        headlineWhite="DFW JUNK &amp; TRASH"
        headlineRed="REMOVAL SERVICES"
        description="Don't want to lift a finger? Our full-service crew loads, hauls away, and sweeps up. Starting at just $150 with upfront volume pricing."
        imageSrc="/images/lone-wolf/lone_wolf_hero_debris.png"
        imageAlt="Black roll-off dumpster loaded with renovation and cleanup debris"
        imageObjectPosition="center center"
        badgeText="FULL-SERVICE ADD-ON • STARTING AT $150"
      />

      {/* 2. "We Do the Heavy Lifting for You" Section */}
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
            {/* Left: Authentic Service Image */}
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

            {/* Right: Benefits */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                EFFORTLESS CLEANUP
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 16px 0', lineHeight: 1.1 }}>
                WE DO THE <span style={{ color: 'var(--accent-red)' }}>HEAVY LIFTING</span> FOR YOU
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                Whether you have a single bulky couch or a complete garage full of clutter, our team handles all the loading, lifting, hauling, and eco-friendly disposal so you can relax.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CircleDollarSign size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      UPFRONT VOLUME-BASED RATES
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                      Starting at $150 for small loads up to full-truck cleanouts. You only pay for the space you use.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      FAST SAME-DAY / NEXT-DAY SCHEDULING
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                      Direct coordination with our team to get your space cleared on your timeline.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      WE SWEEP UP AFTER HAULING
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                      We leave your garage, driveway, or job site completely broom-swept and tidy.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. "What We Haul Away" Card Grid */}
      <section style={{ backgroundColor: '#f8fafc', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
              HAULING CAPABILITIES
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
              WHAT WE HAUL AWAY
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {haulAwayItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '24px 22px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '6px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Quote Form Section */}
      <FreeQuoteForm id="quote" defaultService="junk" />

      {/* 5. Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO CLEAR OUT YOUR JUNK?"
        subheadline="BOOK ONLINE OR CALL FOR A FREE ESTIMATE!"
        imageSrc="/images/lone-wolf/junk-removal.jpeg"
        imageAlt="Lone Wolf Junk Removal Service"
      />
    </>
  );
}
