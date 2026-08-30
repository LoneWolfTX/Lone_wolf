import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CheckCircle2, ShieldCheck, ArrowRight, Truck, Phone, Calendar } from 'lucide-react';
import { cityServiceAreas } from '@/data/cityServiceAreas';
import { siteSettings } from '@/data/siteSettings';
import { PageHero } from '@/components/shared/PageHero';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';

import { getCityHeroImage, getCityHeroAlt } from '@/lib/heroPool';

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return cityServiceAreas.map((c) => ({
    city: c.slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const data = cityServiceAreas.find((c) => c.slug === city);

  if (!data) return {};

  const title = `Dumpster Rental in ${data.cityName}, TX | Affordable Roll-Off Containers`;
  const description = `Looking for dumpster rentals in ${data.cityName}, TX? Lone Wolf Dumpsters provides fast, reliable, driveway-safe, and affordable roll-off container services. Get a free quote today!`;
  const url = `https://lonewolfdumpsters.com/service-areas/${data.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  };
}

export default async function CityServiceAreaPage({ params }: CityPageProps) {
  const { city } = await params;
  const data = cityServiceAreas.find((c) => c.slug === city);

  if (!data) {
    notFound();
  }

  // Find nearby cities in the same county for internal link juice
  const nearbyCities = cityServiceAreas.filter(
    (c) => c.county === data.county && c.slug !== data.slug
  ).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Roll-Off Dumpster Rental',
    provider: {
      '@type': 'LocalBusiness',
      name: siteSettings.businessName,
      telephone: siteSettings.contact.phone,
      email: siteSettings.contact.email,
      url: 'https://lonewolfdumpsters.com',
      image: 'https://lonewolfdumpsters.com/images/lone-wolf/logo.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteSettings.yard.address,
        addressLocality: siteSettings.yard.city,
        addressRegion: siteSettings.yard.state,
        postalCode: siteSettings.yard.zip,
        addressCountry: 'US',
      },
    },
    areaServed: {
      '@type': 'City',
      name: data.cityName,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Texas',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Service Areas', href: '/service-areas' },
          { label: `${data.cityName}, TX` },
        ]}
        headlineWhite="DUMPSTER RENTAL IN"
        headlineRed={`${data.cityName.toUpperCase()}, TX`}
        description={data.localIntro}
        imageSrc={getCityHeroImage(data.slug)}
        imageAlt={getCityHeroAlt(data.cityName)}
        badgeText={`${data.county.toUpperCase()} • SAME-DAY DELIVERY AVAILABLE`}
      />

      {/* Local Projects & Info Section on White */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                LOCAL DELIVERY EXPERTISE
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 14px 0', lineHeight: 1.1 }}>
                RELIABLE ROLL-OFF RENTALS IN <span style={{ color: 'var(--accent-red)' }}>{data.cityName.toUpperCase()}</span>
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                Whether you are managing a home renovation, roofing replacement, garage cleanout, or commercial project in <strong>{data.cityName}</strong>, Lone Wolf Dumpsters provides driveway-safe roll-off container delivery with transparent flat rates and direct owner accountability.
              </p>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                Every container is delivered on protective wooden boards to prevent driveway scratches, with easy walk-in rear doors for effortless loading.
              </p>

              {/* Local ZIPs & Neighborhoods Tags */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px 16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '6px' }}>
                  📍 {data.cityName} ZIP Codes Served:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {data.zipCodes.map((zip) => (
                    <span key={zip} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                      {zip}
                    </span>
                  ))}
                </div>

                {data.neighborhoods && data.neighborhoods.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '6px' }}>
                      🏘️ Key Neighborhoods &amp; Communities:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {data.neighborhoods.map((nh) => (
                        <span key={nh} style={{ backgroundColor: '#fee2e2', color: 'var(--accent-red)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                          {nh}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px 26px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 14px 0' }}>
                COMMON {data.cityName.toUpperCase()} PROJECTS:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                {data.keyProjects.map((proj, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                    <span>{proj}</span>
                  </li>
                ))}
              </ul>

              {/* Direct Booking Call Box */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '4px' }}>
                  Need a Dumpster in {data.cityName} Today?
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  Call or text our local team for instant dispatch and delivery timing.
                </p>
                <a
                  href={`tel:${siteSettings.contact.phoneRaw}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'var(--accent-red)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: '4px',
                  }}
                >
                  <Phone size={15} />
                  <span>Call {siteSettings.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Nearby Service Areas in County */}
          {nearbyCities.length > 0 && (
            <div style={{ marginTop: '44px', paddingTop: '28px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                NEARBY {data.county.toUpperCase()} SERVICE AREAS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {nearbyCities.map((near) => (
                  <Link
                    key={near.slug}
                    href={`/service-areas/${near.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      textDecoration: 'none',
                      color: '#0f172a',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{near.cityName}, TX</span>
                    <ArrowRight size={13} color="var(--accent-red)" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Dumpster Sizing Grid */}
      <DumpsterSizeGrid
        tagline="AVAILABLE DUMPSTER SIZES"
        sectionTitle={`CHOOSE YOUR CONTAINER SIZE IN ${data.cityName.toUpperCase()}`}
        buttonLabel="VIEW DETAILS →"
      />

      {/* Quote Form */}
      <FreeQuoteForm id="quote" />

      {/* Closing CTA */}
      <ClosingCtaBanner
        headline={`READY TO RENT IN ${data.cityName.toUpperCase()}?`}
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt={`Lone Wolf Dumpster in ${data.cityName}`}
      />
    </>
  );
}
