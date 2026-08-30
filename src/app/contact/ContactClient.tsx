'use client';

import React from 'react';
import { PageHero } from '@/components/shared/PageHero';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { useSiteContent } from '@/lib/useEditableContent';

export default function ContactClient() {
  const { content: siteContent } = useSiteContent();

  const heroImg = siteContent.pageHeroes?.contact || {
    src: '/images/lone-wolf/lone_wolf_hero_top.png',
    alt: 'Lone Wolf Dumpsters roll-off truck with black dumpster serving the Dallas-Fort Worth area',
    position: 'center right'
  };

  return (
    <>
      {/* 1. Target-Style Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact & Quote' },
        ]}
        headlineWhite="CONTACT US &"
        headlineRed="GET A QUOTE"
        description="Ready to schedule your dumpster rental? Request a free quote below or call Wayne directly for instant dispatch confirmation across Dallas–Fort Worth."
        imageSrc={heroImg.src}
        imageAlt={heroImg.alt}
        imageObjectPosition={heroImg.position || 'center right'}
      />

      {/* 2. Full 2-Column Contact & Quote Form Section */}
      <FreeQuoteForm id="quote" />

      {/* 3. Closing CTA */}
      <ClosingCtaBanner
        headline="NEED IMMEDIATE ASSISTANCE?"
        subheadline="CALL OR TEXT (214) 876-0321"
      />
    </>
  );
}
