import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { FAQAccordion, FAQItem } from '@/components/shared/FAQAccordion';
import { HorizontalCallout } from '@/components/shared/HorizontalCallout';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Lone Wolf Dumpsters DFW',
  description: 'Answers about roll-off dumpster sizes, flat-rate pricing, prohibited materials, weight allowances, driveway protection, and delivery policies in DFW.',
  alternates: {
    canonical: 'https://lonewolfdumpsters.com/faq',
  },
};

export default function FAQPage() {
  const pricingFaqs: FAQItem[] = [
    {
      q: 'How much does dumpster rental cost in DFW?',
      a: 'Our flat rates are: 15-Yard ($385, 1.5 tons included), 20-Yard ($425, 2.0 tons included - most popular), and 25-Yard ($475, 2.2 tons included). Prices include delivery, pickup, wood driveway protection, and 3, 5, or 7 days rental time.',
    },
    {
      q: 'Are there any hidden fees?',
      a: 'Never. Our pricing is 100% transparent. Fuel, delivery, pickup, and municipal disposal up to your included weight limit are completely included.',
    },
    {
      q: 'How are weight overages billed?',
      a: 'Weight exceeding your included allowance is billed at $80/ton based on verified landfill scale tickets and rental terms.',
    },
    {
      q: 'What if I need the dumpster longer than planned?',
      a: 'Extra rental days are just $20/day. Simply call or text (214) 876-0321 before your scheduled pickup date to extend.',
    },
  ];

  const deliveryFaqs: FAQItem[] = [
    {
      q: 'Do I need to be home for container delivery?',
      a: 'No. As long as your driveway or placement area is clear of parked cars and low overhead tree branches, our driver will set the container exactly where designated using protective wooden boards under the steel wheels.',
    },
    {
      q: 'How much space do I need for a roll-off dumpster?',
      a: 'Our containers fit comfortably on standard single and double residential driveways. We require approximately 10 feet of width and 14 feet of overhead clearance for delivery trucks.',
    },
    {
      q: 'How fast can I get a dumpster delivered?',
      a: 'Same-day and next-day delivery is available throughout most of Dallas, Tarrant, Denton, and Collin counties. Call or text (214) 876-0321 for immediate dispatch confirmation.',
    },
    {
      q: 'What items are strictly prohibited from dumpsters?',
      a: 'Hazardous chemicals, wet paint, motor oil, car batteries, propane tanks, tires, asbestos, and un-evacuated Freon appliances cannot go into municipal landfills.',
    },
  ];

  return (
    <>
      {/* 1. Target-Style Hero */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' },
        ]}
        headlineWhite="FREQUENTLY ASKED"
        headlineRed="QUESTIONS &amp; POLICIES"
        description="Everything you need to know about roll-off dumpster sizes, upfront pricing, driveway protection, permitted materials, and scheduling in Dallas–Fort Worth."
        imageSrc="/images/lone-wolf/hero_dumpster_front.jpg"
        imageAlt="Lone Wolf Roll-Off Dumpster Ready for Delivery in DFW"
      />

      {/* 2. Full FAQ Accordion Sections */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px 0' }}>
        <FAQAccordion
          tagline="PRICING &amp; WEIGHT ALLOWANCES"
          titleBlack="COSTS &amp; RENTAL"
          titleRed="TERMS"
          leftFaqs={pricingFaqs.slice(0, 2)}
          rightFaqs={pricingFaqs.slice(2)}
          showViewAllLink={false}
        />

        <FAQAccordion
          tagline="DELIVERY &amp; GUIDELINES"
          titleBlack="DROP-OFF &amp;"
          titleRed="MATERIALS"
          leftFaqs={deliveryFaqs.slice(0, 2)}
          rightFaqs={deliveryFaqs.slice(2)}
          showViewAllLink={false}
        />
      </div>

      {/* 3. Have Questions Not Listed Here? Callout */}
      <HorizontalCallout
        titleBlack="HAVE QUESTIONS NOT LISTED HERE?"
        titleRed="GET IN TOUCH WITH OUR TEAM!"
        description="Call or text us anytime for personalized advice on dumpster sizing, heavy debris loading, or special placement requirements."
        buttonType="phone"
        buttonText={`CALL OR TEXT ${siteSettings.contact.phone}`}
      />

      {/* 4. Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Dumpster Service"
      />
    </>
  );
}
