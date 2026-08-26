'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSiteContent } from '@/lib/useEditableContent';
import { formatTonnage, formatOverageRate, formatExtraDayRate, formatPhoneNumber } from '@/lib/formatters';

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
      <section className="subpage-header">
        <div className="container">
          <div style={{ marginBottom: '16px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="subpage-title">
            Terms of <span className="text-accent">Service</span>
          </h1>
          <p className="subpage-lead">
            Standard rental agreements, weight allowances, and container placement terms for {legalName}.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '60px 0', minHeight: '50vh' }}>
        <div className="container" style={{ maxWidth: '860px', lineHeight: 1.7, fontSize: '1rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            Rental Periods &amp; Extensions
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Standard roll-off dumpster rentals include {content.rentalPeriods?.standardDays || '1 to 7 Days Included'}. Additional rental days are {formatExtraDayRate(pr.extraDay)}, subject to availability.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            Weight Allowances &amp; Overage Fees
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            {terms?.generalTerms || `Each dumpster includes a designated weight allowance: 15-Yard: ${formatTonnage(1.5)}, 20-Yard: ${formatTonnage(2.0)}, 25-Yard: ${formatTonnage(2.2)}. Additional weight is billed at ${formatOverageRate(pr.extraTonnage)}, based on verified landfill weight tickets. Maximum total safe road load is ${pr.maxCapacityTons} tons (${pr.maxCapacityLbs.toLocaleString()} lbs).`}
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            Prohibited &amp; Restricted Materials
          </h2>
          <p style={{ marginBottom: '14px', color: '#334155' }}>
            Accepted materials include wood, drywall, roofing materials, demolition debris, furniture, carpet, household trash, and yard/landscaping debris.
          </p>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            The following materials are not accepted: {content.prohibitedMaterialsList?.join(', ') || 'tires, batteries, bricks, concrete, dirt, asphalt, railroad ties, asbestos, oils, chemicals, hazardous or flammable materials, paint, and refrigerated appliances unless approved in advance'}.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            Loading &amp; Property Access
          </h2>
          <p style={{ marginBottom: '14px', color: '#334155' }}>
            Do not fill the dumpster above the top edge. Customers are responsible for providing safe and unobstructed access for delivery and pickup and obtaining any required permits.
          </p>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Lone Wolf Dumpsters uses heavy-duty wooden driveway protection boards under container rollers on residential placements.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            Payment, Cancellation &amp; Additional Charges
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            {terms?.paymentTerms || 'Payment is due upon booking or delivery. We accept major credit/debit cards, Zelle, check, and cash.'}
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
