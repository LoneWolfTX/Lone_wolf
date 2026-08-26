import { Discount } from '@/types/business';

export const discounts: Discount[] = [
  {
    id: 'military-veteran',
    name: 'Military & Veteran Discount',
    amount: 'Special Rate',
    description: 'Discounted roll-off dumpster rentals for active duty military and veterans.',
    eligibility: 'Active duty and military veterans',
    active: true,
  },
  {
    id: 'first-responder',
    name: 'First Responder Discount',
    amount: 'Special Rate',
    description: 'Appreciation discounts for local police, fire, and EMS personnel across DFW.',
    eligibility: 'First responders and emergency medical personnel',
    active: true,
  },
  {
    id: 'contractor-bulk',
    name: 'Contractor & High-Volume Partner Rates',
    amount: 'Custom Pricing',
    description: 'Dedicated turnaround schedules and partner rates for DFW remodelers and builders.',
    eligibility: 'Commercial contractors and high-volume accounts',
    active: true,
  },
];
