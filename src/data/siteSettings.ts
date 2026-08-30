import { SiteSettings } from '@/types/business';
import { DEFAULT_SITE_CONTENT, SiteContent } from '@/lib/contentStore';
import { formatCurrency, formatPhoneNumber } from '@/lib/formatters';

export function getSiteSettings(content: SiteContent = DEFAULT_SITE_CONTENT): SiteSettings {
  const b = content.business || DEFAULT_SITE_CONTENT.business;
  const pr = content.pricing || DEFAULT_SITE_CONTENT.pricing;

  return {
    businessName: b.companyName || 'Lone Wolf Dumpsters',
    legalName: b.legalName || 'American Wolf Rent LLC DBA Lone Wolf Dumpsters',
    tagline: 'Dumpster Rentals & Waste Removal in Dallas–Fort Worth',
    ownerName: 'Lone Wolf Team',
    marketArea: 'Dallas–Fort Worth Metroplex & Surrounding Areas',
    contact: {
      phone: formatPhoneNumber(b.phone),
      phoneRaw: b.phoneRaw || '+12148760321',
      sms: formatPhoneNumber(b.phone),
      smsRaw: b.phoneRaw || '+12148760321',
      smsUri: `sms:${b.phoneRaw || '+12148760321'}?&body=Hi%2C%20I%27m%20interested%20in%20renting%20a%20dumpster.%20I%27d%20like%20to%20get%20a%20quote.`,
      email: b.email || 'lonewolfdumpsters@gmail.com',
    },
    yard: {
      name: 'Lone Wolf Dumpsters — Service Area',
      address: b.yardStreet || 'DFW Metroplex',
      city: b.yardCity || 'Colleyville',
      state: b.yardState || 'TX',
      zip: b.yardZip || '76034',
      note: 'Service Area: DFW Metroplex, Texas, Colleyville, TX 76034',
    },
    hours: [
      { days: 'Monday – Saturday', hours: '6:00 AM – 6:00 PM' },
      { days: 'Sunday', hours: 'Closed' },
    ],
    navLinks: [
      { label: 'Home', href: '/' },
      {
        label: 'Dumpster Rentals',
        href: '/dumpster-rentals',
        children: [
          { label: 'Residential Dumpster Rentals', href: '/dumpster-rentals/residential' },
          { label: 'Contractor Dumpster Rentals', href: '/dumpster-rentals/contractor' },
          { label: 'Commercial Dumpster Rentals', href: '/dumpster-rentals/commercial' },
          { label: `15 Yard Dumpster (${formatCurrency(pr.fifteenYard)})`, href: '/dumpster-rentals/15-yard' },
          { label: `20 Yard Dumpster (${formatCurrency(pr.twentyYard)})`, href: '/dumpster-rentals/20-yard' },
          { label: `25 Yard Dumpster (${formatCurrency(pr.twentyFiveYard)})`, href: '/dumpster-rentals/25-yard' },
        ],
      },
      { label: 'Areas Served', href: '/service-areas' },
      { label: 'About', href: '/about' },
      { label: 'Guides', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    primaryCtaLabel: b.primaryCtaText || 'GET A QUOTE',
    primaryCtaUrl: '#quote',
    callCtaLabel: b.secondaryCtaText || 'CALL / TEXT',
    availabilityNote: 'Same-day delivery when available across DFW',
    tracking: {
      googleAdsId: '',
      ga4MeasurementId: 'G-WB2ZEEBZ4Y',
      metaPixelId: '99020332740911',
      gtmId: '',
    },
  };
}

export const siteSettings: SiteSettings = getSiteSettings(DEFAULT_SITE_CONTENT);
