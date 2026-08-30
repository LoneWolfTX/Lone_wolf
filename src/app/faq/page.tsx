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
  const rentalAndDeliveryFaqs: FAQItem[] = [
    {
      q: '1. How does dumpster rental work with Lone Wolf Dumpsters?',
      a: 'Renting a dumpster with Lone Wolf Dumpsters is simple. Choose the dumpster size that fits your project, select your delivery date, and provide a suitable placement location. We deliver the dumpster to your property, you fill it with approved materials, and we pick it up when you’re finished. Our goal is to make dumpster rental convenient, straightforward, and hassle-free.',
    },
    {
      q: '2. How long can I rent a dumpster?',
      a: 'We offer flexible dumpster rental periods. Our standard rental periods are up to 3, 5, or 7 days, and additional days are available for $20 per day. If you finish your project early, simply call or text us to schedule pickup, which will end your rental period.',
    },
    {
      q: '3. Do I need to be home for delivery?',
      a: 'It is recommended that someone be present for delivery. If you cannot be there, please designate someone to meet the driver, or send us a photo with clear instructions showing exactly where you want the dumpster placed.',
    },
    {
      q: '4. What if I need more time?',
      a: 'We are flexible and will do our best to accommodate your needs, depending on availability. Additional days are $20 per day and must be confirmed with us in advance by phone or text. Standard rentals can be extended up to 10 days. If you need the dumpster for 2–3 weeks or longer, please contact us to discuss availability and pricing.',
    },
    {
      q: '5. What areas does Lone Wolf Dumpsters serve?',
      a: 'Lone Wolf Dumpsters provides dumpster rental services in Dallas, Fort Worth, Arlington, Grand Prairie, Lewisville, Euless, Keller, Irving, Bedford, Hurst, and surrounding areas throughout the DFW Metroplex. Service availability may vary by location, so please check our Service Areas page for the communities we currently serve.',
    },
    {
      q: '6. How fast can I get a dumpster delivered?',
      a: 'Same-day and next-day dumpster delivery is available throughout most of Dallas, Tarrant, Denton, and Collin Counties, depending on availability. For immediate availability and delivery confirmation, call or text us at 214-876-0321.',
    },
    {
      q: '10. Can a dumpster be placed on a sidewalk or street?',
      a: 'Dumpsters are typically placed on private property, such as a driveway or other suitable area. Placement on a public street or sidewalk may require a city permit, depending on local regulations.',
    },
    {
      q: '12. Do you offer same-day dumpster service?',
      a: 'Yes. We offer same-day dumpster service for certain projects and locations, depending on availability. Our driver can deliver the dumpster, wait while you load it, and pick it up once you’re finished. Please contact us in advance to confirm availability and pricing.',
    },
  ];

  const pricingAndMaterialsFaqs: FAQItem[] = [
    {
      q: '7. How much does it cost to rent a dumpster?',
      a: 'Our dumpster rental pricing is based on a flat rate, depending on the dumpster size and rental period. Our flat-rate pricing includes delivery, pickup, disposal up to the included weight allowance, and wood driveway protection. Sales tax is added to the rental price. We provide straightforward dumpster rental pricing with no hidden fees for homeowners, contractors, and businesses throughout the DFW area.',
    },
    {
      q: '8. Are there any hidden fees?',
      a: 'No. Our pricing is 100% transparent, with no hidden fees. Your quoted price includes delivery, pickup, disposal up to the included weight allowance, and wood driveway protection. Any additional charges, such as extra days or excess weight, will be clearly explained before they apply.',
    },
    {
      q: '9. How much weight is included with my dumpster rental?',
      a: 'Our included weight allowances are: 15-yard dumpster: up to 1.5 tons (3,000 lbs); 20-yard dumpster: up to 2 tons (4,000 lbs); 25-yard dumpster: up to 2.2 tons (4,400 lbs). Additional weight is billed at $80 per ton based on the verified landfill scale ticket and rental terms. The maximum total safe load is 4.5 tons (9,000 lbs).',
    },
    {
      q: '11. What can I put in a dumpster?',
      a: 'Lone Wolf Dumpsters accepts a wide variety of approved materials, including construction debris, drywall, wood, furniture, cardboard and packaging, general household junk, yard and landscaping debris, and other approved materials. All materials must be placed inside the dumpster and kept below the top edge. Please review our prohibited items before loading the dumpster.',
    },
    {
      q: '13. What size dumpster do I need for my project?',
      a: 'The right dumpster size depends on the type and amount of debris from your project. Lone Wolf Dumpsters offers 15-yard, 20-yard, and 25-yard dumpsters for home cleanouts, renovations, remodeling, landscaping, construction debris, and commercial projects. For larger commercial, industrial, distribution, and logistics projects, we can provide multiple dumpsters at the same time, including 2 × 15-yard (30 yards total), 2 × 20-yard (40 yards total), or 2 × 25-yard (50 yards total). If you’re unsure which dumpster size or combination is right for your project, our team can help you choose the best option.',
    },
    {
      q: '14. What materials are not allowed in a dumpster?',
      a: 'The following materials are not accepted in our dumpsters: concrete, dirt, rock, brick, asphalt, wet paint, stains, solvents, gasoline, oil, flammable liquids, chemicals, hazardous materials, car and truck tires, lead-acid batteries, propane tanks, compressed gas cylinders, asbestos and asbestos-containing materials, and AC units. If you are unsure whether a material is accepted, please contact us before placing it in the dumpster.',
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
        imageSrc="/images/lone-wolf/lone_wolf_hero_top.png"
        imageAlt="Lone Wolf Dumpsters roll-off truck with black dumpster serving the Dallas-Fort Worth area"
        imageObjectPosition="center right"
      />

      {/* 2. Full FAQ Accordion Sections */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px 0' }}>
        <FAQAccordion
          tagline="RENTAL PROCESS &amp; DELIVERY"
          titleBlack="HOW IT WORKS &amp;"
          titleRed="AREAS SERVED"
          leftFaqs={rentalAndDeliveryFaqs.slice(0, Math.ceil(rentalAndDeliveryFaqs.length / 2))}
          rightFaqs={rentalAndDeliveryFaqs.slice(Math.ceil(rentalAndDeliveryFaqs.length / 2))}
          showViewAllLink={false}
        />

        <FAQAccordion
          tagline="PRICING, WEIGHT &amp; MATERIALS"
          titleBlack="FLAT RATES &amp;"
          titleRed="GUIDELINES"
          leftFaqs={pricingAndMaterialsFaqs.slice(0, Math.ceil(pricingAndMaterialsFaqs.length / 2))}
          rightFaqs={pricingAndMaterialsFaqs.slice(Math.ceil(pricingAndMaterialsFaqs.length / 2))}
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
