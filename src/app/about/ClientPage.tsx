'use client';

import React from 'react';
import Image from 'next/image';
import { useSiteContent } from '@/lib/useEditableContent';
import { PageHero } from '@/components/shared/PageHero';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutPageClient() {
  const { content } = useSiteContent();
  const hp = content.homepage;
  const ab = content.about || {
    titleWhite: 'ABOUT LONE WOLF',
    titleRed: 'DUMPSTERS LLC',
    heroDescription: 'Locally owned and dedicated to transparent, stress-free roll-off dumpster rentals and junk removal across Dallas–Fort Worth.',
    ownerBadgeTitle: 'LONE WOLF DUMPSTERS',
    ownerBadgeSub: 'Direct Local Accountability',
    storyHeadlineWhite: 'STRAIGHTFORWARD SERVICE.',
    storyHeadlineRed: 'LOCAL ACCOUNTABILITY.',
    storyParagraph: 'Lone Wolf Dumpsters was founded on simple principles: deliver clean, dependable equipment on time, treat every driveway with care and wood board protection, and provide transparent flat-rate pricing with zero hidden fees.',
    storyQuote: 'When you rent from Lone Wolf Dumpsters, you deal directly with our local team. We make waste removal straightforward, reliable, and hassle-free for homeowners and contractors across the metroplex.',
  };

  const ownerImg = hp.aboutOwnerImage || {
    src: '/images/lone-wolf/real/about_owner_photo.jpg',
    alt: 'Lone Wolf Dumpsters Roll-Off Fleet in DFW',
    position: 'center top'
  };

  return (
    <>
      {/* 1. Target-Style Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us' },
        ]}
        headlineWhite={ab.titleWhite}
        headlineRed={ab.titleRed}
        description={ab.heroDescription}
        imageSrc="/images/lone-wolf/real/hero_fleet_environment.jpg"
        imageAlt="Lone Wolf Dumpsters Roll-Off Container Fleet in DFW"
      />

      {/* 2. Owner Story & Values Section */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '52px 0 44px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left: Wayne, Owner & Operator Real Photo */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                backgroundColor: '#0a0d12',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3' }}>
                <Image
                  src={ownerImg.src}
                  alt={ownerImg.alt}
                  fill
                  priority
                  sizes="(min-width: 1200px) 480px, 100vw"
                  style={{ objectFit: 'cover', objectPosition: ownerImg.position || 'center top' }}
                />
                
                {/* Subtle Overlay Label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(10, 13, 18, 0.9)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                      {ab.ownerBadgeTitle}
                    </div>
                    <div style={{ color: 'var(--accent-red)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {ab.ownerBadgeSub}
                    </div>
                  </div>
                  <div style={{ position: 'relative', width: '28px', height: '28px' }}>
                    <Image src="/images/lone-wolf/logo.png" alt="Lone Wolf Logo Badge" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Story */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                DIRECT LOCAL DISPATCH SERVICE
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 14px 0', lineHeight: 1.1 }}>
                {ab.storyHeadlineWhite} <span style={{ color: 'var(--accent-red)' }}>{ab.storyHeadlineRed}</span>
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {ab.storyParagraph}
              </p>

              <blockquote style={{ borderLeft: '4px solid var(--accent-red)', paddingLeft: '16px', margin: '0 0 20px 0', fontStyle: 'italic', color: '#334155', fontSize: '0.94rem', lineHeight: 1.45 }}>
                &ldquo;{ab.storyQuote}&rdquo;
                <footer style={{ marginTop: '6px', fontWeight: 700, color: '#0f172a', fontStyle: 'normal' }}>
                  — Lone Wolf Dumpsters Team
                </footer>
              </blockquote>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <ShieldCheck size={18} color="var(--accent-red)" />
                  <span><strong>Driveway Safe:</strong> Wood boards included</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <HeartHandshake size={18} color="var(--accent-red)" />
                  <span><strong>Direct Dispatch:</strong> Talk to our team directly</span>
                </div>
                </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Quote Form Section */}
      <FreeQuoteForm id="quote" />

      {/* 4. Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc={hp.closingBannerImage?.src || '/images/lone-wolf/hero_dumpster_side.jpg'}
        imageAlt="Lone Wolf Dumpster"
        imageObjectPosition={hp.closingBannerImage?.position || 'center center'}
      />
    </>
  );
}
