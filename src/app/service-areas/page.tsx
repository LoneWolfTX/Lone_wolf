'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/shared/PageHero';
import { HorizontalCallout } from '@/components/shared/HorizontalCallout';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';
import { cityServiceAreas } from '@/data/cityServiceAreas';
import { MapPin, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { InteractiveServiceMap } from '@/components/shared/InteractiveServiceMap';

export default function ServiceAreasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  const counties = ['All', 'Tarrant County', 'Dallas County', 'Denton County'];

  const filteredCities = cityServiceAreas.filter((city) => {
    const matchesCounty = selectedCounty === 'All' || city.county === selectedCounty;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCounty;

    const matchesName = city.cityName.toLowerCase().includes(query);
    const matchesZip = city.zipCodes.some((z) => z.includes(query));
    const matchesNeighborhood = city.neighborhoods?.some((n) => n.toLowerCase().includes(query));

    return matchesCounty && (matchesName || matchesZip || matchesNeighborhood);
  });

  return (
    <>
      {/* 1. Service Area Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services Areas' },
        ]}
        headlineWhite="PROUDLY SERVING"
        headlineRed="48 DFW CITIES &amp; TOWNS"
        description="Fast, reliable, driveway-safe roll-off dumpster rentals across Tarrant, Dallas, and Denton Counties. Choose your city below for localized delivery info and rates."
        imageSrc="/images/lone-wolf/real/contractor_jobsite_showcase.jpg"
        imageAlt="Lone Wolf Roll-Off Dumpster Delivery Service Active Across 48 DFW Cities"
      />

      {/* 2. Interactive 48-City Map Component */}
      <InteractiveServiceMap />

      {/* 3. White Service Coverage Directory */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          {/* SEO Implementation Block: Our Roll-Off Dumpster Rental Service Area */}
          <div style={{ marginBottom: '48px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '36px 30px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
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
                PRIMARY TARGET MARKETS &amp; REGIONAL COVERAGE
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  margin: '0 0 10px 0',
                  letterSpacing: '0.02em',
                }}
              >
                Our Roll-Off Dumpster Rental Service Area
              </h2>
              <p style={{ fontSize: '0.98rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Here is the list of cities within our Dallas-Fort Worth service footprint across Tarrant, Dallas, and Denton Counties:
              </p>
            </div>

            {/* 15 Primary Focus Cities Grid */}
            <ul className="primary-focus-cities-grid">
              <li>
                <Link href="/service-areas/arlington">
                  <strong>Arlington</strong> 
                  <span className="zip-codes">(ZIP: 76001, 76002, 76006, 76010, 76011, 76012, 76013, 76014, 76015, 76016, 76017, 76018)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/fort-worth">
                  <strong>Fort Worth</strong> 
                  <span className="zip-codes">(ZIP: 76102, 76103, 76104, 76106, 76111, 76112, 76137, 76155)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/dallas">
                  <strong>Dallas</strong> 
                  <span className="zip-codes">(West/Northwest/Southwest - ZIP: 75201, 75202, 75204, 75207, 75211, 75212, 75219, 75220, 75229, 75233, 75235, 75247)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/irving">
                  <strong>Irving</strong> 
                  <span className="zip-codes">(ZIP: 75038, 75039, 75060, 75061, 75062, 75063)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/grand-prairie">
                  <strong>Grand Prairie</strong> 
                  <span className="zip-codes">(ZIP: 75050, 75051, 75052, 75054)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/grapevine">
                  <strong>Grapevine</strong> 
                  <span className="zip-codes">(ZIP: 76051)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/southlake">
                  <strong>Southlake</strong> 
                  <span className="zip-codes">(ZIP: 76092)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/keller">
                  <strong>Keller</strong> 
                  <span className="zip-codes">(ZIP: 76244, 76248)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/carrollton">
                  <strong>Carrollton</strong> 
                  <span className="zip-codes">(ZIP: 75006, 75007, 75010)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/lewisville">
                  <strong>Lewisville</strong> 
                  <span className="zip-codes">(ZIP: 75057, 75067, 75077)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/north-richland-hills">
                  <strong>North Richland Hills</strong> 
                  <span className="zip-codes">(ZIP: 76180, 76182)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/euless">
                  <strong>Euless</strong> 
                  <span className="zip-codes">(ZIP: 76039, 76040)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/bedford">
                  <strong>Bedford</strong> 
                  <span className="zip-codes">(ZIP: 76021, 76022)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/hurst">
                  <strong>Hurst</strong> 
                  <span className="zip-codes">(ZIP: 76053, 76054)</span>
                </Link>
              </li>
              <li>
                <Link href="/service-areas/colleyville">
                  <strong>Colleyville</strong> 
                  <span className="zip-codes">(ZIP: 76034)</span>
                </Link>
              </li>
            </ul>

            {/* Secondary Title: Other Surrounding Communities We Serve */}
            <div style={{ marginTop: '28px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  margin: '0 0 10px 0',
                  letterSpacing: '0.02em',
                }}
              >
                Other Surrounding Communities We Serve
              </h3>
              <div className="surrounding-communities-box">
                <p className="surrounding-communities-list">
                  <Link href="/service-areas/addison">Addison</Link>,{' '}
                  <Link href="/service-areas/blue-mound">Blue Mound</Link>,{' '}
                  <Link href="/service-areas/cedar-hill">Cedar Hill</Link>,{' '}
                  <Link href="/service-areas/cockrell-hill">Cockrell Hill</Link>,{' '}
                  <Link href="/service-areas/coppell">Coppell</Link>,{' '}
                  <Link href="/service-areas/desoto">DeSoto</Link>,{' '}
                  <Link href="/service-areas/double-oak">Double Oak</Link>,{' '}
                  <Link href="/service-areas/duncanville">Duncanville</Link>,{' '}
                  <Link href="/service-areas/edgecliff-village">Edgecliff Village</Link>,{' '}
                  <Link href="/service-areas/everman">Everman</Link>,{' '}
                  <Link href="/service-areas/farmers-branch">Farmers Branch</Link>,{' '}
                  <Link href="/service-areas/flower-mound">Flower Mound</Link>,{' '}
                  <Link href="/service-areas/forest-hill">Forest Hill</Link>,{' '}
                  <Link href="/service-areas/haltom-city">Haltom City</Link>,{' '}
                  <Link href="/service-areas/haslet">Haslet</Link>,{' '}
                  <Link href="/service-areas/highland-park">Highland Park</Link>,{' '}
                  <Link href="/service-areas/highland-village">Highland Village</Link>,{' '}
                  <Link href="/service-areas/kennedale">Kennedale</Link>,{' '}
                  <Link href="/service-areas/lake-worth">Lake Worth</Link>,{' '}
                  <Link href="/service-areas/lakeside">Lakeside</Link>,{' '}
                  <Link href="/service-areas/mansfield">Mansfield</Link>,{' '}
                  <Link href="/service-areas/northlake">Northlake</Link>,{' '}
                  <Link href="/service-areas/richland-hills">Richland Hills</Link>,{' '}
                  <Link href="/service-areas/river-oaks">River Oaks</Link>,{' '}
                  <Link href="/service-areas/roanoke">Roanoke</Link>,{' '}
                  <Link href="/service-areas/saginaw">Saginaw</Link>,{' '}
                  <Link href="/service-areas/sansom-park">Sansom Park</Link>,{' '}
                  <Link href="/service-areas/the-colony">The Colony</Link>,{' '}
                  <Link href="/service-areas/trophy-club">Trophy Club</Link>,{' '}
                  <Link href="/service-areas/university-park">University Park</Link>,{' '}
                  <Link href="/service-areas/watauga">Watauga</Link>,{' '}
                  <Link href="/service-areas/westlake">Westlake</Link>, and{' '}
                  <Link href="/service-areas/white-settlement">White Settlement</Link>.
                </p>
              </div>
            </div>
          </div>

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
              LOCALLY OWNED &amp; OPERATED DFW DIRECTORY
            </span>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)',
                fontWeight: 800,
                color: '#0f172a',
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              INTERACTIVE <span style={{ color: 'var(--accent-red)' }}>MUNICIPALITY SEARCH</span>
            </div>
            <p style={{ fontSize: '0.94rem', color: '#64748b', margin: '8px auto 0 auto', maxWidth: '680px', lineHeight: 1.45 }}>
              Browse every covered municipality or filter by county to view dedicated landing pages, neighborhood guides, and roll-off dimensions.
            </p>
          </div>

          {/* Search & County Filter Bar */}
          <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative', maxWidth: '480px', width: '100%', margin: '0 auto' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                aria-label="Search city, ZIP code, or neighborhood"
                placeholder="Search city, ZIP code, or neighborhood (e.g., Keller, 76092, Craig Ranch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '6px',
                  border: '2px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              />
            </div>

            {/* County Filter Tabs */}
            <div aria-label="Municipality Filter" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {counties.map((county) => (
                <button
                  key={county}
                  type="button"
                  onClick={() => setSelectedCounty(county)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedCounty === county ? 'var(--accent-red)' : '#cbd5e1',
                    backgroundColor: selectedCounty === county ? 'var(--accent-red)' : '#ffffff',
                    color: selectedCounty === county ? '#ffffff' : '#475569',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {county}
                </button>
              ))}
            </div>
          </div>

          {/* ALL 48 CITIES GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px',
              marginBottom: '36px',
            }}
          >
            {filteredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/service-areas/${city.slug}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: '#0f172a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                className="city-hover-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      backgroundColor: '#fee2e2',
                      color: 'var(--accent-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.82rem',
                      flexShrink: 0,
                    }}
                  >
                    {city.code || 'TX'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>
                      {city.cityName}, TX
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {city.county}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--accent-red)" />
              </Link>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
                No cities found matching "{searchQuery}". We likely still service your area!
              </p>
              <div style={{ marginTop: '14px' }}>
                <a
                  href={`tel:${siteSettings.contact.phoneRaw}`}
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: 'var(--accent-red)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Call our dispatch team at {siteSettings.contact.phone}
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Not Sure If We Deliver to Your Area? Just Ask! Callout */}
      <HorizontalCallout
        titleBlack="NOT SURE IF WE DELIVER TO YOUR AREA?"
        titleRed="JUST ASK!"
        description="If you don't see your town or neighborhood listed, give us a call or send a quick text. We dispatch throughout the entire DFW region!"
        buttonType="phone"
        buttonText={`CALL OR TEXT ${siteSettings.contact.phone}`}
      />

      {/* 4. Closing CTA Banner */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Dumpster Service"
      />
    </>
  );
}
