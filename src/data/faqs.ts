import { FAQItem } from '@/types/business';
import { DEFAULT_SITE_CONTENT, SiteContent } from '@/lib/contentStore';
import { formatCurrency, formatPhoneNumber, formatTonnage, formatOverageRate } from '@/lib/formatters';

export function getFaqs(content: SiteContent = DEFAULT_SITE_CONTENT): FAQItem[] {
  const pr = content.pricing || DEFAULT_SITE_CONTENT.pricing;
  const b = content.business || DEFAULT_SITE_CONTENT.contact;

  if (Array.isArray(content.faqs) && content.faqs.length > 0) {
    return content.faqs.map((f, idx) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category || 'pricing',
      sortOrder: f.sortOrder || idx + 1,
      active: f.active !== false,
    }));
  }

  return [
    {
      id: 'faq-max-capacity',
      question: 'What is the maximum load capacity for your dumpsters?',
      answer: `The absolute maximum load capacity for any Lone Wolf dumpster is ${pr.maxCapacityTons} tons (${pr.maxCapacityLbs.toLocaleString()} lbs). While our rental rates include generous allowances (${formatTonnage(1.5)} for 15-yd, ${formatTonnage(2.0)} for 20-yd, and ${formatTonnage(2.2)} for 25-yd), containers cannot legally or safely exceed ${pr.maxCapacityTons} tons for Texas highway safety and hydraulic hoist limits.`,
      category: 'pricing',
      sortOrder: 1,
      active: true,
    },
    {
      id: 'faq-sizes',
      question: 'How do I know which dumpster size I need?',
      answer: `Our 15 Yard container works well for single-room cleanouts or small bath remodels. The 20 Yard is our most versatile size for roofing, kitchen renovations, and medium cleanouts. The 25 Yard handles large construction, commercial jobs, or major whole-home cleanouts. Call or text our dispatch team at ${formatPhoneNumber(b.phone)} for direct advice.`,
      category: 'booking',
      sortOrder: 2,
      active: true,
    },
    {
      id: 'faq-delivery',
      question: 'Where do you deliver roll-off dumpsters?',
      answer: 'We dispatch roll-off dumpsters directly across 48+ municipalities in Dallas, Tarrant, and Denton counties in the DFW Metroplex with priority scheduling and same-day delivery when available.',
      category: 'placement',
      sortOrder: 3,
      active: true,
    },
    {
      id: 'faq-driveway',
      question: 'Will the dumpster damage my driveway?',
      answer: 'We place heavy-duty wooden protection boards underneath the container wheels and rollers on every residential delivery to prevent cracking, scratching, or rutting on concrete and asphalt driveways.',
      category: 'placement',
      sortOrder: 4,
      active: true,
    },
    {
      id: 'faq-overage',
      question: 'How much do you charge if I go over the included weight?',
      answer: `Weight over the included allowance is billed at ${formatOverageRate(pr.extraTonnage)} based on verified landfill scale weight tickets and rental terms. Total load cannot exceed the ${pr.maxCapacityTons}-ton maximum road capacity.`,
      category: 'pricing',
      sortOrder: 5,
      active: true,
    },
    {
      id: 'faq-prohibited',
      question: 'What materials are not allowed in the dumpsters?',
      answer: 'Hazardous materials, wet liquid paints, automotive tires, batteries, flammable liquids, toxic chemicals, and refrigerants/Freon appliances (unless certified evacuated) are strictly prohibited by Texas landfill regulations.',
      category: 'materials',
      sortOrder: 6,
      active: true,
    },
  ];
}

export const faqs: FAQItem[] = getFaqs(DEFAULT_SITE_CONTENT);
