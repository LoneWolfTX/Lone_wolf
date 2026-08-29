'use client';

import { useCommercialCards } from '@/lib/useEditableContent';
import { PageHero } from '@/components/shared/PageHero';
import { BenefitIconGrid, BenefitItem } from '@/components/shared/BenefitIconGrid';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { HorizontalCallout } from '@/components/shared/HorizontalCallout';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import { siteSettings } from '@/data/siteSettings';
import {
  Building2,
  Truck,
  CircleDollarSign,
  ShieldCheck,
  Building,
  ShoppingCart,
  HardHat,
  Warehouse,
  Utensils,
  MoreHorizontal,
} from 'lucide-react';

// Icon map for commercial industry cards (keyed by card id)
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  'com-1': <Building size={26} />,
  'com-2': <ShoppingCart size={26} />,
  'com-3': <HardHat size={26} />,
  'com-4': <Warehouse size={26} />,
  'com-5': <Utensils size={26} />,
  'com-6': <MoreHorizontal size={26} />,
};

export default function CommercialPageClient() {
  const industryCards = useCommercialCards();

  const commercialBenefits: BenefitItem[] = [
    {
      icon: <Building2 size={26} />,
      title: 'FLEXIBLE SOLUTIONS',
      desc: 'Short or long-term rentals to fit your project needs.',
    },
    {
      icon: <Truck size={26} />,
      title: 'ON-TIME DELIVERY',
      desc: 'We deliver when you need it so your project keeps moving.',
    },
    {
      icon: <CircleDollarSign size={26} />,
      title: 'COST-EFFECTIVE',
      desc: 'Competitive pricing with no hidden fees.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'SAFE & COMPLIANT',
      desc: "We follow local regulations so you don't have to worry.",
    },
  ];

  const industryItems: BenefitItem[] = industryCards.map((card) => ({
    icon: INDUSTRY_ICONS[card.id] || <Building size={26} />,
    title: card.title.toUpperCase(),
    desc: card.description,
  }));

  const commercialBestFors = {
    '15-yard-dumpster': 'Small renovations, office cleanouts, retail spaces, light construction debris',
    '20-yard-dumpster': 'Medium projects, renovations, general construction, commercial cleanouts',
    '25-yard-dumpster': 'Large construction projects, demolition, warehouses, commercial use',
  };

  return (
    <>
      {/* 1. Commercial Hero Matching Image 6 */}
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dumpster Rentals', href: '/dumpster-rentals' },
          { label: 'Commercial' },
        ]}
        headlineWhite="COMMERCIAL"
        headlineRed="DUMPSTER RENTALS"
        description="Reliable waste solutions for your business, job site or facility. Whether it's ongoing service or a one-time cleanout, we've got you covered."
        imageSrc="/images/lone-wolf/real/commercial_environment_showcase.jpg"
        imageAlt="Lone Wolf Commercial Roll-Off Container at Industrial Warehouse Loading Dock Facility"
        imageObjectPosition="center center"
      />

      {/* 2. "Built for Your Business" Benefit Strip */}
      <BenefitIconGrid
        titleBlack="BUILT FOR YOUR"
        titleRed="BUSINESS"
        subtitle="We help businesses of all sizes keep their operations clean, safe and efficient with dumpster rentals that fit your schedule and budget."
        items={commercialBenefits}
        columns={4}
        iconStyle="circle-red"
      />

      {/* 3. Three Dumpster Size Cards */}
      <DumpsterSizeGrid
        tagline="DUMPSTER SIZES"
        sectionTitle="CHOOSE THE RIGHT SIZE FOR YOUR PROJECT"
        customBestFors={commercialBestFors}
        buttonLabel="VIEW DETAILS →"
      />

      {/* 4. Need a Custom Plan? Callout */}
      <HorizontalCallout
        titleBlack="NEED A CUSTOM PLAN?"
        titleRed="WE'RE HERE TO HELP."
        description="Not sure which size or service is right for your business? Give us a call or text and we'll recommend the best option for your project and budget."
        buttonType="phone"
        buttonText={`CALL OR TEXT ${siteSettings.contact.phone}`}
      />

      {/* 5. Six Industries Served Icons */}
      <BenefitIconGrid
        titleBlack="WE SERVE A WIDE RANGE OF"
        titleRed="INDUSTRIES"
        items={industryItems}
        columns={6}
        iconStyle="square-light"
      />

      {/* 6. 2-Column FAQ Preview */}
      <FAQAccordion
        titleBlack="FREQUENTLY ASKED"
        titleRed="QUESTIONS"
        showViewAllLink={true}
        viewAllHref="/faq"
      />

      {/* 7. Commercial Closing CTA */}
      <ClosingCtaBanner
        headline="READY TO KEEP YOUR BUSINESS"
        subheadline="CLEAN AND MOVING? BOOK ONLINE OR CALL TODAY!"
        imageSrc="/images/lone-wolf/hero_dumpster_side.jpg"
        imageAlt="Lone Wolf Commercial Dumpster"
      />
    </>
  );
}
