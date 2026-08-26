export interface ContactInfo {
  phone: string;
  phoneRaw: string;
  sms: string;
  smsRaw: string;
  smsUri: string;
  email: string;
}

export interface BusinessHours {
  days: string;
  hours: string;
}

export interface YardLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  note: string; // e.g. "Company Yard / Dispatch — not a customer walk-in location"
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface SiteSettings {
  businessName: string;
  legalName: string;
  tagline: string;
  ownerName: string;
  marketArea: string;
  contact: ContactInfo;
  yard: YardLocation;
  hours: BusinessHours[];
  navLinks: NavLink[];
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  callCtaLabel: string;
  availabilityNote: string;
  tracking?: {
    googleAdsId?: string;
    ga4MeasurementId?: string;
    metaPixelId?: string;
    gtmId?: string;
  };
}

export interface DumpsterProduct {
  id: string;
  name: string;
  shortName: string;
  category: 'dumpster' | 'junk_removal';
  startingPrice: number;
  priceDisplay: string;
  priceUnit?: string;
  image: string;
  imageAlt: string;
  badge?: string;
  description: string;
  bestFor: string[];
  dimensionsText?: string;
  weightIncludedText?: string;
  rentalPeriodText?: string;
  extraDayPrice?: string;
  overagePrice?: string;
  dimensions?: {
    lengthFt?: number;
    widthFt?: number;
    heightFt?: number;
    description?: string;
  };
  tonnageIncluded?: number;
  rentalPeriodDays?: number;
  active: boolean;
  featured: boolean;
  ctaText: string;
  ctaUrl: string;
}

export interface ServiceArea {
  county: string;
  cities: string[];
  active: boolean;
}

export interface Discount {
  id: string;
  name: string;
  amount: string;
  description: string;
  eligibility: string;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'pricing' | 'placement' | 'materials';
  sortOrder: number;
  active: boolean;
}

export interface RentalTerms {
  allowedMaterials: string[];
  prohibitedMaterials: string[];
  drivewayProtection: string;
  weightLimitGuidelines: string;
  rentalRules: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  content: string[];
  image?: string;
}

export interface SeoConfig {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  locale: string;
}
