import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';

export const metadata: Metadata = {
  title: 'Contact Us & Book Online | Lone Wolf Dumpsters DFW',
  description: 'Book your 15, 20, or 25-yard roll-off dumpster rental or request a free quote. Call or text (214) 876-0321 for direct owner-operator dispatch.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* 1. Target-Style Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact & Quote' },
        ]}
        headlineWhite="CONTACT US &amp;"
        headlineRed="GET A QUOTE"
        description="Ready to schedule your dumpster rental? Request a free quote below or call Wayne directly for instant dispatch confirmation across Dallas–Fort Worth."
        imageSrc="/images/lone-wolf/real/real_dumpster_6082.jpg"
        imageAlt="Real Lone Wolf Dumpster Delivery on Texas Driveway"
      />

      {/* 2. Full 2-Column Contact & Quote Form Section */}
      <FreeQuoteForm id="quote" />

      {/* 3. Closing CTA */}
      <ClosingCtaBanner
        headline="NEED IMMEDIATE ASSISTANCE?"
        subheadline="CALL OR TEXT (214) 876-0321"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Dumpster Service"
      />
    </>
  );
}
