'use client';

import React from 'react';
import { useSiteContent } from '@/lib/useEditableContent';
import { PageHero, TrustItem } from '@/components/shared/PageHero';
import { HowItWorksSteps } from '@/components/shared/HowItWorksSteps';
import { DumpsterSizeGrid } from '@/components/shared/DumpsterSizeGrid';
import { HorizontalCallout } from '@/components/shared/HorizontalCallout';
import { BenefitIconGrid, BenefitItem } from '@/components/shared/BenefitIconGrid';
import { ReviewsAndProofSection } from '@/components/home/ReviewsAndProofSection';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FreeQuoteForm } from '@/components/shared/FreeQuoteForm';
import { ClosingCtaBanner } from '@/components/shared/ClosingCtaBanner';
import {
  Truck,
  CircleDollarSign,
  MapPin,
  ShieldCheck,
  HardHat,
  Home,
  Building2,
  Wrench,
  Building,
  Landmark,
  Star,
  Users,
  Clock,
} from 'lucide-react';

export default function HomePageClient() {
  const { content } = useSiteContent();
  const hp = content.homepage;

  // 5-Item Trust Strip for Hero
  const heroTrustItems: TrustItem[] = [
    {
      icon: <Truck size={20} />,
      title: 'SAME-DAY DELIVERY',
      subtitle: 'In most of the DFW Metroplex',
    },
    {
      icon: <CircleDollarSign size={20} />,
      title: 'TRANSPARENT PRICING',
      subtitle: 'No hidden fees. Ever.',
    },
    {
      icon: <MapPin size={20} />,
      title: 'LOCAL & RELIABLE',
      subtitle: 'Locally owned & operated.',
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'RELIABLE SERVICE',
      subtitle: 'On time. Every time.',
    },
    {
      icon: <HardHat size={20} />,
      title: 'CONTRACTOR FRIENDLY',
      subtitle: 'We keep your projects moving',
    },
  ];

  // 5 Why Choose Benefits
  const whyChooseItems: BenefitItem[] = [
    {
      icon: <Users size={26} />,
      title: 'LOCAL & LOCALLY OWNED',
      desc: 'We are a local business that cares about our community.',
    },
    {
      icon: <CircleDollarSign size={26} />,
      title: 'TRANSPARENT PRICING',
      desc: 'Transparent pricing with clear weight allowances and straightforward terms.',
    },
    {
      icon: <Clock size={32} color="var(--accent-red)" />,
      title: 'Reliable Scheduling',
      desc: 'We strive for prompt, dependable delivery and pickup scheduling across DFW.',
    },
    {
      icon: <Star size={26} />,
      title: 'GREAT REVIEWS',
      desc: 'Our customers love our service and it shows.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'SAFETY & PROFESSIONALISM',
      desc: 'We treat your property with respect and care.',
    },
  ];

  // 5 Who We Serve Items
  const whoWeServeItems: BenefitItem[] = [
    {
      icon: <Home size={26} />,
      title: 'RESIDENTIAL',
      desc: 'Homeowners, renters & DIY projects',
    },
    {
      icon: <Building2 size={26} />,
      title: 'BUSINESSES',
      desc: 'Offices, retail stores & commercial properties',
    },
    {
      icon: <Wrench size={26} />,
      title: 'CONTRACTORS',
      desc: 'Construction, roofing, remodeling & more',
    },
    {
      icon: <Building size={26} />,
      title: 'PROPERTY MANAGERS',
      desc: 'Apartment complexes & rental properties',
    },
    {
      icon: <Landmark size={26} />,
      title: 'MUNICIPALITIES',
      desc: 'Parks, schools & public works',
    },
  ];

  return (
    <>
      {/* 1. Large Photographic Hero + Rating + Dual CTAs + 5-Item Trust Strip */}
      <PageHero
        headlineWhite={hp.heroHeadlineWhite || 'FAST & RELIABLE'}
        headlineRed={hp.heroHeadlineRed || 'DUMPSTER RENTALS ACROSS DFW'}
        description={hp.heroDescription || 'Perfect for home cleanouts, remodeling projects, construction jobs and everything in between.'}
        showRating={true}
        imageSrc={hp.heroImage?.src || '/images/lone-wolf/real/hero_main.jpg'}
        imageAlt={hp.heroImage?.alt || 'Lone Wolf Roll-Off Dumpster Fleet Ready for Delivery Across Dallas-Fort Worth'}
        imageObjectPosition={hp.heroImage?.position || 'center center'}
        trustItems={heroTrustItems}
      />

      {/* 2. "Renting a Dumpster Is Easy" Four-Step Process */}
      <HowItWorksSteps />

      {/* 3. Three Dumpster-Size Cards (15yd, 20yd [Most Popular], 25yd) */}
      <DumpsterSizeGrid
        tagline="DUMPSTER SIZES"
        sectionTitle="CHOOSE THE RIGHT SIZE FOR YOUR PROJECT"
        buttonLabel="VIEW DETAILS →"
      />

      {/* 4. Full-Service Junk Removal Horizontal Callout */}
      <HorizontalCallout
        titleBlack="NEED FULL-SERVICE"
        titleRed="JUNK REMOVAL?"
        description="Don't want to load the dumpster yourself? We do the heavy lifting! Perfect for homes, businesses, furniture, appliances and property cleanups."
        checklist={[
          'Garage & storage cleanouts',
          'Yard debris removal',
          'Office & commercial cleanouts',
          'Furniture & appliance removal',
        ]}
        buttonType="link"
        buttonText="LEARN MORE →"
        buttonHref="/junk-removal"
      />

      {/* 5. "Why Choose Lone Wolf Dumpsters?" Benefits (5 items) */}
      <BenefitIconGrid
        tagline="WHY CHOOSE"
        titleBlack="LONE WOLF"
        titleRed="DUMPSTERS"
        items={whyChooseItems}
        columns={5}
        iconStyle="circle-light"
      />

      {/* 6. Customer Reviews & DFW Service Area Proof */}
      <ReviewsAndProofSection />

      {/* 7. "Who We Serve" Audience Row (5 items) */}
      <BenefitIconGrid
        tagline="WHO WE SERVE"
        items={whoWeServeItems}
        columns={5}
        iconStyle="circle-light"
        backgroundColor="#f8fafc"
      />

      {/* 8. FAQ Preview (2-Column Accordion) */}
      <FAQAccordion
        tagline="FREQUENTLY ASKED"
        titleBlack="QUESTIONS"
        showViewAllLink={true}
        viewAllHref="/faq"
      />

      {/* 9. Free Quote Form (Direct Contact on Left, Inquiry Form on Right) */}
      <FreeQuoteForm id="quote" />

      {/* 10. Closing CTA Banner */}
      <ClosingCtaBanner
        headline="READY TO RENT YOUR DUMPSTER?"
        subheadline="BOOK ONLINE OR CALL TODAY!"
        imageSrc={hp.closingBannerImage?.src || '/images/lone-wolf/real/contractor_environment_showcase.jpg'}
        imageAlt={hp.closingBannerImage?.alt || 'Real Lone Wolf Roll-Off Dumpster Ready for Delivery in DFW'}
        imageObjectPosition={hp.closingBannerImage?.position || 'center center'}
      />
    </>
  );
}
