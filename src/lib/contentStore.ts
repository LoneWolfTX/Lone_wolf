/**
 * contentStore.ts
 *
 * Canonical schema, type definitions, and default dataset for Lone Wolf Dumpsters.
 * Architecture: SINGLE CANONICAL SOURCE OF TRUTH for all business facts.
 * Server source of truth: /admin/data/site-content.json via /api/content.php
 */

export interface ImageAssignment {
  src: string;
  alt: string;
  position: string; // e.g. "center center", "right center", "center 40%"
}

export interface BusinessSettings {
  companyName: string;
  legalName: string;
  brandName: string;
  phone: string;
  phoneRaw: string;
  email: string;
  yardAddress: string;
  yardStreet: string;
  yardCity: string;
  yardState: string;
  yardZip: string;
  businessHours: string;
  googleReviewUrl: string;
  googleRating: string;
  reviewCount: number;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface FeeSettings {
  extraDayFee: number;
  overageRatePerTon: number;
  maxCapacityTons: number;
  maxCapacityLbs: number;
  junkStartingPrice: number;
  deliveryFee: number;
  mileageFee: number;
  heavyMaterialFee: number;
}

export interface RentalPeriodSettings {
  standardDays: string;
  extraDayRate: string;
  maxRentalDays: number;
}

export interface DumpsterEntity {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: 'dumpster' | 'junk';
  sizeYards: number;
  price: number;
  includedTonnage: number;
  includedLbs: number;
  overageRate: number;
  rentalPeriod: string;
  additionalDayFee: number;
  dimensions: string;
  image: string;
  imageAlt: string;
  badgeText: string;
  description: string;
  bestFor: string[];
  importantNotice: string;
  active: boolean;
  sortOrder: number;
}

export interface DumpsterPageContent {
  id: string;
  badgeText: string;
  heroDescription: string;
  bodyDescription: string;
  priceDisplay: string;
  weightIncludedText: string;
  overagePrice: string;
  bestFor: string[];
  importantNotice: string;
  ctaText: string;
  image?: ImageAssignment;
}

export interface PageCard {
  id: string;
  title: string;
  description: string;
  tag?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  visible?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'pricing' | 'booking' | 'placement' | 'materials';
  applicableDumpsterIds?: string[];
  applicableServiceAreas?: string[];
  active?: boolean;
  sortOrder?: number;
}

export interface GuideItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
}

export interface ZipCodeItem {
  zip: string;
  city: string;
  active: boolean;
}

export interface MaterialPolicy {
  id: string;
  name: string;
  category: 'prohibited' | 'restricted' | 'special';
  status: 'Prohibited' | 'Restricted' | 'Requires Notice' | 'Prior Approval Required';
  shortDescription: string;
  fullDescription: string;
  fee?: number;
  restrictions?: string;
  active: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  promoCode: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  testimonial: string;
  rating: number;
  source: string;
  dumpsterId?: string;
  active: boolean;
  sortOrder: number;
}

export interface ServiceAreaEntity {
  id: string;
  city: string;
  state: string;
  county: string;
  slug: string;
  zipCodes: string[];
  active: boolean;
  serviceStatus: string;
  localIntro: string;
  headline: string;
  keyProjects: string[];
  neighborhoods: string[];
  seoTitle?: string;
  metaDescription?: string;
  heroImage?: string;
}

export interface SiteContent {
  business: BusinessSettings;
  contact: {
    phone: string;
    phoneRaw: string;
    email: string;
    yardAddress: string;
  };
  pricing: {
    fifteenYard: number;
    twentyYard: number;
    twentyFiveYard: number;
    extraDay: number;
    extraTonnage: number;
    maxCapacityTons: number;
    maxCapacityLbs: number;
    junkStarting: number;
  };
  dimensions: {
    fifteenYard: string;
    twentyYard: string;
    twentyFiveYard: string;
  };
  rentalPeriods: {
    standardDays: string;
    extraDayRate: string;
    maxRentalDays: number;
  };
  contractorRates: {
    multiLoadDiscount: string;
    volumeDiscountNote: string;
  };
  materialPolicies: MaterialPolicy[];
  prohibitedMaterialsList: string[];
  promotions: Promotion[];
  testimonials: Testimonial[];
  serviceAreasList: ServiceAreaEntity[];
  termsContent: {
    legalEntityName: string;
    generalTerms: string;
    paymentTerms: string;
    weightTerms: string;
  };
  zipCodes: ZipCodeItem[];
  homepage: {
    heroHeadlineWhite: string;
    heroHeadlineRed: string;
    heroDescription: string;
    introTitle: string;
    introDescription: string;
    heroImage: ImageAssignment;
    showcaseImage: ImageAssignment;
    closingBannerImage: ImageAssignment;
    aboutOwnerImage: ImageAssignment;
    commercialHeaderImage?: ImageAssignment;
    contractorHeaderImage?: ImageAssignment;
    residentialHeaderImage?: ImageAssignment;
  };
  about: {
    titleWhite: string;
    titleRed: string;
    heroDescription: string;
    ownerBadgeTitle: string;
    ownerBadgeSub: string;
    storyHeadlineWhite: string;
    storyHeadlineRed: string;
    storyParagraph: string;
    storyQuote: string;
  };
  dumpsterEntities: DumpsterEntity[];
  dumpsterPages: DumpsterPageContent[];
  residentialCards: PageCard[];
  contractorCards: PageCard[];
  commercialCards: PageCard[];
  faqs: FAQItem[];
  guides: GuideItem[];
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  business: {
    companyName: "Lone Wolf Dumpsters",
    legalName: "American Wolf Rent LLC DBA Lone Wolf Dumpsters",
    brandName: "Lone Wolf Dumpsters",
    phone: "(214) 876-0321",
    phoneRaw: "+12148760321",
    email: "lonewolfdumpsters@gmail.com",
    yardAddress: "4141 Singleton Blvd, Dallas, TX 75212",
    yardStreet: "4141 Singleton Blvd",
    yardCity: "Dallas",
    yardState: "TX",
    yardZip: "75212",
    businessHours: "Mon-Fri 7:00am-6:00pm, Sat 8:00am-2:00pm",
    googleReviewUrl: "https://g.page/r/lonewolfdumpsters/review",
    googleRating: "5.0",
    reviewCount: 48,
    primaryCtaText: "GET A QUOTE",
    secondaryCtaText: "CALL / TEXT"
  },
  contact: {
    phone: "(214) 876-0321",
    phoneRaw: "+12148760321",
    email: "lonewolfdumpsters@gmail.com",
    yardAddress: "4141 Singleton Blvd, Dallas, TX 75212"
  },
  pricing: {
    fifteenYard: 385,
    twentyYard: 425,
    twentyFiveYard: 475,
    extraDay: 20,
    extraTonnage: 80,
    maxCapacityTons: 4.5,
    maxCapacityLbs: 9000,
    junkStarting: 150
  },
  dimensions: {
    fifteenYard: "16' L × 7.5' W × 4' H",
    twentyYard: "16' L × 7.5' W × 4.5' H",
    twentyFiveYard: "16' L × 7.5' W × 6' H"
  },
  rentalPeriods: {
    standardDays: "7 Days",
    extraDayRate: "$20 / Day after 7 days",
    maxRentalDays: 10
  },
  contractorRates: {
    multiLoadDiscount: "Contractor Rates & Multi-Load Discounts",
    volumeDiscountNote: "Competitive commercial volume rates available upon request"
  },
  materialPolicies: [
    {
      id: "prohibited_heavy",
      name: "Concrete, Dirt, Rock, Brick & Asphalt",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Heavy dense masonry materials are strictly prohibited in standard roll-off containers due to highway road limits.",
      fullDescription: "Standard containers loaded with concrete, dirt, rock, brick, or asphalt exceed maximum road limits. Contact dispatch for dedicated heavy material solutions.",
      active: true
    },
    {
      id: "paints_chemicals",
      name: "Wet Paints, Stains & Solvents",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Liquid chemicals, wet paints, stains, and solvents cannot be deposited into municipal landfills.",
      fullDescription: "Liquid paints must be completely dried before disposal. Uncured liquid paints and chemical solvents are strictly prohibited.",
      active: true
    },
    {
      id: "flammables",
      name: "Gasoline, Oil & Flammable Liquids",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Flammable fuels, motor oils, and combustible liquids present a severe fire hazard.",
      fullDescription: "Combustible fuels and oils are prohibited by Texas environmental regulations.",
      active: true
    },
    {
      id: "tires",
      name: "Car & Truck Tires",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Car and truck tires are prohibited in standard containers.",
      fullDescription: "Tires require specialized recycling facilities.",
      active: true
    },
    {
      id: "batteries",
      name: "Lead-Acid & Lithium Batteries",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Lead-acid vehicle batteries and lithium ion cells are prohibited.",
      fullDescription: "Batteries contain toxic heavy metals and acid. Recycle auto batteries at local auto parts retailers.",
      active: true
    },
    {
      id: "propane",
      name: "Propane Tanks & Compressed Gas Cylinders",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Pressurized gas cylinders can explode when crushed in landfill compactors.",
      fullDescription: "All pressurized tanks (propane, helium, oxygen, acetylene) are strictly forbidden in roll-off containers.",
      active: true
    },
    {
      id: "hazardous",
      name: "Asbestos & Hazardous Materials",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Toxic substances, medical waste, and asbestos materials are strictly prohibited.",
      fullDescription: "Hazardous waste must be handled by certified toxic waste contractors.",
      active: true
    },
    {
      id: "ac_units",
      name: "AC Units",
      category: "prohibited",
      status: "Prohibited",
      shortDescription: "Air conditioning units are strictly prohibited.",
      fullDescription: "AC units contain regulated refrigerants and are prohibited in standard containers.",
      active: true
    },
    {
      id: "freon_refrigerators",
      name: "Refrigerators containing Freon – Ask First",
      category: "restricted",
      status: "Prior Approval Required",
      shortDescription: "Customers should contact us before disposing of Freon-containing refrigerators.",
      fullDescription: "Customers must contact Lone Wolf Dumpsters before loading a Freon-containing refrigerator.",
      fee: 0,
      active: true
    }
  ],
  prohibitedMaterialsList: [
    "Concrete, Dirt, Rock, Brick & Asphalt",
    "Wet Paints, Stains & Solvents",
    "Gasoline, Oil & Flammable Liquids",
    "Car & Truck Tires",
    "Lead-Acid Batteries",
    "Propane Tanks & Compressed Gas Cylinders",
    "Asbestos / Asbestos-Containing Materials",
    "AC Units",
    "Refrigerators containing Freon – Ask First"
  ],
  promotions: [
    {
      id: "contractor_volume",
      title: "Contractor Multi-Load Rate",
      description: "Discounted pricing for high-volume commercial and contractor recurring drop-offs.",
      discountType: "percentage",
      discountValue: 10,
      promoCode: "CONTRACTOR10",
      active: true
    }
  ],
  testimonials: [
    {
      id: "t1",
      customerName: "Mark S.",
      location: "Fort Worth, TX",
      testimonial: "Lone Wolf delivered our 20-yard dumpster right on time. They put wooden boards under the wheels so our concrete driveway didn't have a single scratch. Excellent service!",
      rating: 5,
      source: "Google Review",
      dumpsterId: "20-yard-dumpster",
      active: true,
      sortOrder: 1
    },
    {
      id: "t2",
      customerName: "Rachel M.",
      location: "Dallas, TX",
      testimonial: "Upfront pricing with no surprise fees at the end. The 15-yard container was perfect for our garage and kitchen remodel clearout.",
      rating: 5,
      source: "Google Review",
      dumpsterId: "15-yard-dumpster",
      active: true,
      sortOrder: 2
    },
    {
      id: "t3",
      customerName: "Jason K.",
      location: "Arlington, TX",
      testimonial: "Great contractor rate on multi-container swaps. The dispatch team communicates well and handles swaps smoothly.",
      rating: 5,
      source: "Google Review",
      dumpsterId: "25-yard-dumpster",
      active: true,
      sortOrder: 3
    }
  ],
  serviceAreasList: [
    { id: "sa-1", city: "Dallas", state: "TX", county: "Dallas", slug: "dallas", zipCodes: ["75201", "75212", "75219", "75208"], active: true, serviceStatus: "Active", localIntro: "Direct dispatch from our Singleton Blvd facility across all Dallas neighborhoods.", headline: "Dumpster Rental in Dallas, TX", keyProjects: ["Home cleanouts in Oak Cliff", "Commercial remodels in Downtown", "Property clearouts in East Dallas"], neighborhoods: ["Downtown", "Oak Cliff", "Uptown", "Kiest Park"] },
    { id: "sa-2", city: "Fort Worth", state: "TX", county: "Tarrant", slug: "fort-worth", zipCodes: ["76102", "76104", "76107", "76116", "76132"], active: true, serviceStatus: "Active", localIntro: "Priority scheduling and roll-off dumpster rentals delivered directly to Fort Worth homeowners and contractors.", headline: "Dumpster Rental in Fort Worth, TX", keyProjects: ["Cleanouts near TCU", "Demolition in Downtown Fort Worth", "Remodeling jobs in Cultural District"], neighborhoods: ["Downtown", "TCU", "Cultural District", "Tanglewood"] },
    { id: "sa-3", city: "Arlington", state: "TX", county: "Tarrant", slug: "arlington", zipCodes: ["76010", "76011", "76012", "76013"], active: true, serviceStatus: "Active", localIntro: "Serving Arlington residential neighborhoods and commercial entertainment district sites.", headline: "Dumpster Rental in Arlington, TX", keyProjects: ["Remodels near AT&T Stadium", "Estate clearouts in North Arlington", "General construction"], neighborhoods: ["Entertainment District", "North Arlington", "Pantego", "Dalworthington Gardens"] },
    { id: "sa-4", city: "Keller", state: "TX", county: "Tarrant", slug: "keller", zipCodes: ["76248", "76244"], active: true, serviceStatus: "Active", localIntro: "Residential driveway-safe roll-off container delivery across Keller and North Tarrant County.", headline: "Dumpster Rental in Keller, TX", keyProjects: ["Garage decluttering", "Kitchen renovations", "Yard debris removal"], neighborhoods: ["Town Center", "Hidden Lakes", "Marshall Ridge"] }
  ],
  termsContent: {
    legalEntityName: "American Wolf Rent LLC DBA Lone Wolf Dumpsters",
    generalTerms: "Standard rental period includes 1 to 7 days. Weight allowances: 15yd (1.5 tons), 20yd (2.0 tons), 25yd (2.2 tons). Overages billed at $80/ton.",
    paymentTerms: "Payment due upon container delivery. Major credit cards, debit cards, and corporate checks accepted.",
    weightTerms: "Scale weight tickets provided by local landfills determine final billable tonnage according to written terms."
  },
  zipCodes: [
    { zip: "75212", city: "Dallas", active: true },
    { zip: "76102", city: "Fort Worth", active: true },
    { zip: "76010", city: "Arlington", active: true },
    { zip: "76248", city: "Keller", active: true },
    { zip: "75038", city: "Irving", active: true },
    { zip: "75006", city: "Carrollton", active: true },
    { zip: "76051", city: "Grapevine", active: true },
    { zip: "76092", city: "Southlake", active: true },
    { zip: "75067", city: "Lewisville", active: true },
    { zip: "75028", city: "Flower Mound", active: true }
  ],
  homepage: {
    heroHeadlineWhite: "FAST & RELIABLE",
    heroHeadlineRed: "DUMPSTER RENTALS ACROSS DFW",
    heroDescription: "Perfect for home cleanouts, remodeling projects, construction jobs and everything in between.",
    introTitle: "WELCOME TO LONE WOLF DUMPSTERS",
    introDescription: "Dallas-Fort Worth's local owner-operator roll-off dumpster service. Upfront flat-rate pricing, 5.0 Google rating, driveway-safe delivery.",
    heroImage: {
      src: "/images/lone-wolf/real/hero_main.jpg",
      alt: "Lone Wolf Roll-Off Dumpster Fleet Ready for Delivery Across Dallas-Fort Worth",
      position: "center center"
    },
    showcaseImage: {
      src: "/images/lone-wolf/real/hero_fleet_environment.jpg",
      alt: "Full-Service Junk & Debris Removal Service in DFW",
      position: "center center"
    },
    closingBannerImage: {
      src: "/images/lone-wolf/real/contractor_environment_showcase.jpg",
      alt: "Real Lone Wolf Roll-Off Dumpster Ready for Delivery in DFW",
      position: "center center"
    },
    aboutOwnerImage: {
      src: "/images/lone-wolf/real/about_owner_photo.jpg",
      alt: "Lone Wolf Dumpsters Roll-Off Fleet in Dallas-Fort Worth",
      position: "center top"
    },
    commercialHeaderImage: {
      src: "/images/lone-wolf/real/commercial_environment_showcase.jpg",
      alt: "Lone Wolf Commercial Dumpster Placement at Industrial Warehouse Facility",
      position: "center center"
    },
    contractorHeaderImage: {
      src: "/images/lone-wolf/real/contractor_environment_showcase.jpg",
      alt: "Lone Wolf Heavy-Duty Contractor Dumpster on Job Site in DFW",
      position: "center center"
    },
    residentialHeaderImage: {
      src: "/images/lone-wolf/real/dumpster_15_environment.jpg",
      alt: "Driveway Safe Residential Dumpster Rental in Dallas-Fort Worth",
      position: "center center"
    }
  },
  about: {
    titleWhite: "ABOUT LONE WOLF",
    titleRed: "DUMPSTERS",
    heroDescription: "Locally owned and dedicated to transparent, stress-free roll-off dumpster rentals and junk removal across Dallas–Fort Worth.",
    ownerBadgeTitle: "LONE WOLF DUMPSTERS",
    ownerBadgeSub: "Direct Local Accountability",
    storyHeadlineWhite: "STRAIGHTFORWARD SERVICE.",
    storyHeadlineRed: "LOCAL ACCOUNTABILITY.",
    storyParagraph: "Lone Wolf Dumpsters was founded on simple principles: deliver clean, dependable equipment on time, protect every driveway with care and board protection, and make dumpster rental simple with direct communication, reliable service, and clear pricing from the start.",
    storyQuote: "When you rent from Lone Wolf Dumpsters, you deal directly with our local team. We make waste removal straightforward, reliable, and hassle-free for homeowners and contractors across the metroplex."
  },
  dumpsterEntities: [
    {
      id: "15-yard-dumpster",
      slug: "15-yard",
      name: "15 Yard Dumpster",
      shortName: "15 Yard",
      category: "dumpster",
      sizeYards: 15,
      price: 385,
      includedTonnage: 1.5,
      includedLbs: 3000,
      overageRate: 80,
      rentalPeriod: "1 to 5 Days",
      additionalDayFee: 20,
      dimensions: "16' L × 7.5' W × 4' H",
      image: "/images/lone-wolf/dumpster-15.jpeg",
      imageAlt: "Lone Wolf 15-yard roll-off dumpster rental on residential driveway in Dallas-Fort Worth",
      badgeText: "3 DAYS — $385 • 1.5 TONS",
      description: "Ideal for small home cleanouts, single-room remodels, yard debris, and light renovation projects.",
      bestFor: [
        "Garage & attic cleanouts",
        "Single bathroom remodels",
        "Flooring removal & yard debris",
        "Max Safe Load Capacity: 4.5 tons.",
        "And other similar projects."
      ],
      importantNotice: "",
      active: true,
      sortOrder: 1
    },
    {
      id: "20-yard-dumpster",
      slug: "20-yard",
      name: "20 Yard Dumpster",
      shortName: "20 Yard",
      category: "dumpster",
      sizeYards: 20,
      price: 425,
      includedTonnage: 2.0,
      includedLbs: 4000,
      overageRate: 80,
      rentalPeriod: "1 to 7 Days",
      additionalDayFee: 20,
      dimensions: "16' L × 7.5' W × 4.5' H",
      image: "/images/lone-wolf/dumpster-20.jpeg",
      imageAlt: "Lone Wolf 20-yard roll-off dumpster container for residential and contractor projects",
      badgeText: "3 DAYS — $425 • 2 TONS • DRIVEWAY SAFE",
      description: "Our most versatile container. Perfect for kitchen remodels, home cleanouts, and medium renovation projects. Driveway-safe placement.",
      bestFor: [
        "Kitchen & Multiple Room Remodels",
        "Moving & Decluttering",
        "Garage & Home Cleanouts",
        "Property Cleanouts",
        "And other similar projects."
      ],
      importantNotice: "",
      active: true,
      sortOrder: 2
    },
    {
      id: "25-yard-dumpster",
      slug: "25-yard",
      name: "25 Yard Dumpster",
      shortName: "25 Yard",
      category: "dumpster",
      sizeYards: 25,
      price: 475,
      includedTonnage: 2.2,
      includedLbs: 4400,
      overageRate: 80,
      rentalPeriod: "1 to 7 Days",
      additionalDayFee: 20,
      dimensions: "16' L × 7.5' W × 6' H",
      image: "/images/lone-wolf/dumpster-25.jpeg",
      imageAlt: "Lone Wolf 25-yard heavy-duty roll-off dumpster on commercial contractor job site",
      badgeText: "3 DAYS — $475 • 2.2 TONS",
      description: "Maximum capacity for large residential remodels, whole-house estate cleanouts, commercial construction, property cleanouts, and warehouses/distribution centers.",
      bestFor: [
        "Major Home Renovations",
        "Large Home Cleanouts",
        "Moving & Decluttering",
        "Commercial Cleanouts",
        "Warehouses & Packaging Cleanouts",
        "Property Cleanouts",
        "And other similar projects."
      ],
      importantNotice: "",
      active: true,
      sortOrder: 3
    }
  ],
  dumpsterPages: [
    {
      id: "15-yard-dumpster",
      badgeText: "3 DAYS — $385 • 1.5 TONS",
      heroDescription: "Compact, driveway-friendly, and perfect for small home cleanouts, garage organizing, yard debris, and light bathroom or kitchen remodeling.",
      bodyDescription: "The 15-yard roll-off container holds approximately 6 pickup truck loads of debris. It is low enough for easy over-the-side loading and includes a swinging rear door for walk-in ground access.",
      priceDisplay: "$385",
      weightIncludedText: "1.5 Tons (3,000 lbs)",
      overagePrice: "$80 / ton",
      bestFor: [
        "Garage & attic cleanouts",
        "Single bathroom remodels",
        "Flooring removal & yard debris",
        "Max Safe Load Capacity: 4.5 tons.",
        "And other similar projects."
      ],
      importantNotice: "",
      ctaText: "Book 15 Yard Now →",
      image: {
        src: "/images/lone-wolf/real/dumpster_15_environment.jpg",
        alt: "15 Yard Lone Wolf Dumpster in Residential Driveway Setting",
        position: "center center"
      }
    },
    {
      id: "20-yard-dumpster",
      badgeText: "3 DAYS — $425 • 2 TONS • DRIVEWAY SAFE",
      heroDescription: "Our versatile container size across DFW. Handles medium-to-large home renovations, garage cleanouts, and flooring swaps.",
      bodyDescription: "The 20-yard roll-off container holds approximately 8 pickup truck loads of waste. Feature low 4.5-ft sidewalls for effortless loading and wood board driveway protection included.",
      priceDisplay: "$425",
      weightIncludedText: "2.0 Tons (4,000 lbs)",
      overagePrice: "$80 / ton",
      bestFor: [
        "Kitchen & Multiple Room Remodels",
        "Moving & Decluttering",
        "Garage & Home Cleanouts",
        "Property Cleanouts",
        "And other similar projects."
      ],
      importantNotice: "",
      ctaText: "Book 20 Yard Now →",
      image: {
        src: "/images/lone-wolf/real/contractor_environment_showcase.jpg",
        alt: "20 Yard Lone Wolf Dumpster Container on Active Job Site",
        position: "center center"
      }
    },
    {
      id: "25-yard-dumpster",
      badgeText: "3 DAYS — $475 • 2.2 TONS",
      heroDescription: "Our maximum volume container for large residential remodels, whole-house estate cleanouts, commercial construction, property cleanouts, and warehouses/distribution centers.",
      bodyDescription: "The 25-yard container holds approximately 10 pickup truck loads of debris. Built with reinforced steel walls and heavy-duty rear doors for efficient loading on major jobsites.",
      priceDisplay: "$475",
      weightIncludedText: "2.2 Tons (4,400 lbs)",
      overagePrice: "$80 / ton",
      bestFor: [
        "Major Home Renovations",
        "Large Home Cleanouts",
        "Moving & Decluttering",
        "Commercial Cleanouts",
        "Warehouses & Packaging Cleanouts",
        "Property Cleanouts",
        "And other similar projects."
      ],
      importantNotice: "",
      ctaText: "Book 25 Yard Now →",
      image: {
        src: "/images/lone-wolf/real/commercial_environment_showcase.jpg",
        alt: "25 Yard Lone Wolf Dumpster at Commercial Facility",
        position: "center center"
      }
    }
  ],
  residentialCards: [
    {
      id: "res-1",
      title: "Garage & Attic Cleanouts",
      description: "Clear out years of accumulated boxes, old furniture, broken appliances, and general clutter in a single convenient rental.",
      tag: "Home Clearout"
    },
    {
      id: "res-2",
      title: "Kitchen & Bath Remodels",
      description: "Tear down old cabinets, countertops, drywall, tub enclosures, tile flooring, and fixtures with ease.",
      tag: "Home Remodeling"
    },
    {
      id: "res-3",
      title: "Landscaping & Yard Clearout",
      description: "Dispose of tree branches, brush, old fencing, deck lumber, landscaping mulch, and yard debris cleanly.",
      tag: "Yard & Outdoor"
    },
    {
      id: "res-4",
      title: "Full Home & Remodel Cleanouts",
      description: "Ideal capacity for major home cleanup debris, drywall, fixtures, framing lumber, and whole-house renovation waste.",
      tag: "Remodel & Cleanouts"
    },
    {
      id: "res-5",
      title: "Flooring & Carpet Removal",
      description: "Haul away old carpet padding, hardwood planking, vinyl tile, and subflooring materials after home renovation.",
      tag: "Flooring Replacement"
    },
    {
      id: "res-6",
      title: "Estate Cleanouts & Moving",
      description: "Streamline whole-home decluttering before downsizing, property sales, estate settlements, or major residential moves.",
      tag: "Move-Out & Estate"
    }
  ],
  contractorCards: [
    {
      id: "con-1",
      title: "Carpenters & Woodworkers",
      description: "Fast, reliable container drop-offs for framing lumber, cabinetry trim, sawdust, and wood shop waste.",
      tag: "Carpentry & Woodwork"
    },
    {
      id: "con-2",
      title: "Property Cleanouts",
      description: "Ideal container capacity for rental property clearouts, estate sales, foreclosure cleanups, and tenant move-out debris.",
      tag: "Property Cleanouts"
    },
    {
      id: "con-3",
      title: "General Construction & Remodeling",
      description: "Dependable roll-off containers placed directly on active remodels with fast, reliable swap scheduling.",
      tag: "General Remodeling"
    },
    {
      id: "con-4",
      title: "Yard & Landscape Clean-Up",
      description: "Haul away outdoor debris, brush, fallen limbs, fencing timber, landscaping mulch, and yard clearout materials.",
      tag: "Yard Clean-Up"
    },
    {
      id: "con-5",
      title: "New Home Build Debris",
      description: "Keep job sites clean and compliant throughout new residential framing, sheetrocking, and trim phases.",
      tag: "New Construction"
    },
    {
      id: "con-6",
      title: "Commercial Tenant Build-Outs",
      description: "Itemized billing, custom scheduling, and flexible placement for retail, office, and restaurant renovation jobs.",
      tag: "Commercial Build-Out"
    }
  ],
  commercialCards: [
    {
      id: "com-1",
      title: "Retail & Office Build-Outs",
      description: "Clean, professional roll-off placement for retail store remodels, commercial office strip-outs, and tenant improvements.",
      tag: "Commercial Tenant Improvements"
    },
    {
      id: "com-2",
      title: "Industrial, Distribution & Logistics Centers",
      description: "Dispose of packaging materials, cardboard, pallet debris, shelving, plastic wrap, and facility cleanout waste.",
      tag: "Distribution & Logistics"
    },
    {
      id: "com-3",
      title: "Property Management & Multi-Family",
      description: "Reliable container service for apartment turn cleanouts, tenant abandoned property, and ongoing property maintenance.",
      tag: "Property Managers"
    },
    {
      id: "com-4",
      title: "Commercial Cleanouts & Remodels",
      description: "High-capacity containers for retail cleanouts, office tear-outs, drywall, drop-ceiling tile, and commercial framing.",
      tag: "Commercial Cleanouts"
    },
    {
      id: "com-5",
      title: "Cardboard & Packaging Waste",
      description: "Dedicated dumpster placements for high-volume commercial shipping, receiving, cardboard, and packaging disposal.",
      tag: "Cardboard & Packaging"
    },
    {
      id: "com-6",
      title: "Custom Commercial Operations",
      description: "Tailored multi-container roll-off placements, custom swap frequencies, and dedicated site waste plans for large commercial operations.",
      tag: "Custom Operations"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What dumpster sizes do you offer and how much do they cost?",
      answer: "We offer 3 versatile sizes across Dallas-Fort Worth: 15-Yard ($385, includes 1.5 tons), 20-Yard ($425, includes 2.0 tons), and 25-Yard ($475, includes 2.2 tons). All pricing is simple and upfront with 3 days included, delivery, driveway protection boards, pick-up, and municipal disposal.",
      category: "pricing"
    },
    {
      id: "faq-2",
      question: "What is included in the flat-rate pricing?",
      answer: "Our simple upfront price covers 3 days, delivery to your site, heavy-duty wooden driveway protection boards, pick-up, and the included weight allowance (1.5, 2.0, or 2.2 tons depending on size). There are no hidden fees.",
      category: "pricing"
    },
    {
      id: "faq-3",
      question: "How long can I keep the dumpster?",
      answer: "Rentals are available for 1–7 days. Additional days are $20/day. If the customer finishes early, they can call or text to schedule pickup, which ends the rental period.",
      category: "booking"
    },
    {
      id: "faq-4",
      question: "Will the roll-off dumpster damage my driveway?",
      answer: "No! We care about your property. On every residential delivery, our drivers lay down heavy wooden protective boards under the steel rollers so the dumpster never touches your concrete or asphalt directly.",
      category: "placement"
    },
    {
      id: "faq-5",
      question: "What items and materials are prohibited?",
      answer: "Concrete, dirt, rock, brick, asphalt, wet paint, stains, solvents, gasoline, oil, flammable liquids, chemicals, hazardous materials, car/truck tires, lead-acid batteries, propane tanks, compressed gas cylinders, asbestos, and AC units are prohibited. Refrigerators containing Freon require prior approval. Contact Lone Wolf before loading restricted or unusually heavy materials.",
      category: "materials"
    },
    {
      id: "faq-6",
      question: "What happens if I exceed the included weight allowance?",
      answer: "If your load exceeds the included weight allowance (1.5t for 15yd, 2.0t for 20yd, 2.2t for 25yd), additional weight is billed at $80 per ton based on certified landfill weight tickets. Maximum allowed weight is 4.5 tons. Additional charges apply for excess weight.",
      category: "pricing"
    },
    {
      id: "faq-7",
      question: "Do I need to be home for delivery?",
      answer: "It is recommended that someone be present for delivery. If you cannot be there, please designate someone or send us a photo with clear instructions showing exactly where you want the dumpster placed.",
      category: "booking"
    },
    {
      id: "faq-8",
      question: "What if I need more time?",
      answer: "We are flexible and will do our best to accommodate your needs, depending on availability. Additional days are $20 per day and must be confirmed with us in advance by phone or text. Rental can be extended up to 10 days total. If you need the dumpster for 2, 3 weeks or longer, please contact us to discuss availability and pricing.",
      category: "booking"
    }
  ],
  guides: [
    {
      slug: "what-size-dumpster-for-home-cleanout",
      title: "What Size Dumpster Do You Need for a Home Cleanout?",
      category: "Sizing & Planning",
      readTime: "4 min read",
      excerpt: "Compare 15, 20, and 25-yard dumpsters for garage cleanouts, estate clearouts, and room decluttering in DFW."
    },
    {
      slug: "how-much-does-dumpster-rental-cost-dfw",
      title: "How Much Does Dumpster Rental Cost in Dallas-Fort Worth?",
      category: "Pricing & Cost",
      readTime: "5 min read",
      excerpt: "Complete pricing breakdown for roll-off dumpster rentals in DFW: flat rates, weight allowances, and avoiding extra fees."
    },
    {
      slug: "15-vs-20-yard-dumpster",
      title: "15-Yard vs. 20-Yard Dumpster: Which One Should You Rent?",
      category: "Sizing Comparison",
      readTime: "4 min read",
      excerpt: "Not sure whether a 15-yard or 20-yard container fits your project? Breakdown of dimensions, capacity, and costs."
    },
    {
      slug: "how-to-protect-driveway-dumpster-rental",
      title: "How We Protect Your Driveway During Dumpster Delivery",
      category: "Property Protection",
      readTime: "3 min read",
      excerpt: "Learn how wooden buffer boards prevent driveway scratches, cracking, and damage when renting a roll-off dumpster."
    },
    {
      slug: "commercial-dumpster-rentals-warehouses-distribution-centers",
      title: "Commercial Dumpster Rentals for Warehouses & Distribution Centers",
      category: "Commercial & Warehouses",
      readTime: "4 min read",
      excerpt: "Streamline warehouse cleanouts, packaging disposal, shipping/receiving waste, and pallet clearing for DFW industrial facilities."
    },
    {
      slug: "dumpster-rental-moving-home-cleanouts",
      title: "Dumpster Rental for Moving & Home Cleanouts",
      category: "Home & Moving",
      readTime: "4 min read",
      excerpt: "Practical advice for homeowners decluttering before a move, garage clearouts, estate cleanups, and furniture removal in DFW."
    }
  ]
};
