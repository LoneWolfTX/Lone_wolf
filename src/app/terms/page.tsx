'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatTonnage, formatOverageRate, formatExtraDayRate, formatPhoneNumber } from '@/lib/formatters';

import { PageHero } from '@/components/shared/PageHero';

export default function TermsOfServicePage() {
  const { content } = useSiteContent();
  const pr = content.pricing;
  const b = content.business || content.contact;
  const terms = content.termsContent;

  const phone = formatPhoneNumber(b.phone);
  const phoneRaw = b.phoneRaw || '+12148760321';
  const email = b.email || 'lonewolfdumpsters@gmail.com';
  const legalName = b.legalName || 'American Wolf Rent LLC DBA Lone Wolf Dumpsters';

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service' },
        ]}
        headlineWhite="TERMS OF"
        headlineRed="SERVICE & POLICIES"
        description={`Standard rental agreements, weight allowances, and container placement terms for ${legalName}.`}
        imageSrc="/images/lone-wolf/lone_wolf_hero_top.png"
        imageAlt="Lone Wolf Dumpsters roll-off truck with black dumpster serving the Dallas-Fort Worth area"
        imageObjectPosition="center right"
      />

      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '60px 0', minHeight: '50vh' }}>
        <div className="container" style={{ maxWidth: '860px', lineHeight: 1.7, fontSize: '1rem' }}>
          
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
            1. Rental Period &amp; Extensions
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Standard rental periods are 1–7 days. Additional days are {formatExtraDayRate(pr.extraDay)}, subject to availability and advance confirmation. Rentals may be extended up to 10 days total. For longer-term rentals, multiple-week projects, recurring service, or ongoing business and contractor needs, please contact Lone Wolf Dumpsters by email or phone to discuss availability and pricing.
          </p>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
            2. Weight Allowance &amp; Overage Fees
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Each dumpster includes a specified weight allowance based on the dumpster size and rental agreement. Additional charges apply when the included weight is exceeded. Final weight is determined by the landfill or disposal facility ticket.
          </p>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
            3. Prohibited &amp; Restricted Materials
          </h2>
          <p style={{ marginBottom: '12px', color: '#334155' }}>
            Customers are responsible for loading only approved materials. Prohibited and restricted materials may not be placed in the dumpster.
          </p>
          <p style={{ marginBottom: '10px', fontWeight: 700, color: '#0f172a' }}>
            The following materials are not accepted:
          </p>
          <ul style={{ margin: '0 0 16px 20px', padding: 0, color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Concrete, dirt, rock, brick, and asphalt</li>
            <li>Wet paint, stains, and solvents</li>
            <li>Gasoline, oil, and flammable liquids</li>
            <li>Chemicals and hazardous materials</li>
            <li>Car and truck tires</li>
            <li>Lead-acid batteries</li>
            <li>Propane tanks and compressed gas cylinders</li>
            <li>Asbestos and asbestos-containing materials</li>
            <li>AC units</li>
          </ul>
          <p style={{ marginBottom: '12px', color: '#334155' }}>
            Refrigerators containing Freon require prior approval. Please contact Lone Wolf Dumpsters before loading these items.
          </p>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            These restrictions are subject to applicable Texas and federal regulations and the requirements of the disposal facility.
          </p>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
            4. Loading &amp; Property Access
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Materials must remain below the top edge of the dumpster and be evenly distributed. The customer is responsible for providing safe and clear access for delivery and pickup and for obtaining any required permits.
          </p>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
            5. Payment, Cancellation &amp; Additional Charges
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Payment is due before or upon container delivery. Additional charges may apply for extra rental days, excess weight, prohibited materials, or other services requested by the customer. Cancellation terms may vary depending on the rental and are provided with the invoice.
          </p>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
            Additional Rental Terms
          </h2>
          <p style={{ marginBottom: '32px', color: '#334155' }}>
            Specific pricing, rental dates, weight allowances, additional charges, and other conditions for your individual rental are provided on your invoice and apply to that rental.
          </p>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '32px' }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: '#0f172a' }}>{legalName}</p>
            <p style={{ margin: '0 0 6px 0', color: '#475569' }}>Phone: <a href={`tel:${phoneRaw}`} style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{phone}</a></p>
            <p style={{ margin: 0, color: '#475569' }}>Email: <a href={`mailto:${email}`} style={{ color: 'var(--accent-red)' }}>{email}</a></p>
          </div>

        </div>
      </section>
    </>
  );
}
