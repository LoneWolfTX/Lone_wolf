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
            1. Rental Period &amp; Extensions
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Standard rental periods are 1–7 days. Additional days are {formatExtraDayRate(pr.extraDay)}, subject to availability and advance confirmation. Rentals may be extended up to 10 days total. For longer-term rentals, multiple-week projects, recurring service, or ongoing business and contractor needs, customers should contact Lone Wolf Dumpsters by email or phone to discuss availability and pricing.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            2. Weight Allowance &amp; Overage Fees
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Each dumpster includes a specified weight allowance based on dumpster size and rental agreement (15-Yard: {formatTonnage(1.5)}, 20-Yard: {formatTonnage(2.0)}, 25-Yard: {formatTonnage(2.2)}). Additional charges apply when included weight is exceeded, billed at {formatOverageRate(pr.extraTonnage)}. Final weight is determined by official landfill/disposal facility scale weight ticket. Maximum total allowed weight is {pr.maxCapacityTons} tons ({pr.maxCapacityLbs.toLocaleString()} lbs).
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            3. Prohibited &amp; Restricted Materials
          </h2>
          <p style={{ marginBottom: '12px', color: '#334155' }}>
            The following materials are NOT accepted: {content.prohibitedMaterialsList?.join(', ') || 'Concrete, Dirt, Rock, Brick, Asphalt, Wet paint, Stains, Solvents, Gasoline, Oil, Flammable liquids, Chemicals, Hazardous materials, Car and truck tires, Lead-acid batteries, Propane tanks, Compressed gas cylinders, Asbestos / asbestos-containing materials, AC units'}.
          </p>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Refrigerators containing Freon require prior approval—customers must contact Lone Wolf Dumpsters before loading a Freon-containing unit. All waste restrictions are subject to applicable Texas and federal environmental regulations and landfill disposal-facility requirements.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            4. Loading &amp; Property Access
          </h2>
          <p style={{ marginBottom: '14px', color: '#334155' }}>
            Materials must remain below the top edge of the dumpster and be evenly distributed for safe highway transport and tarping. Customers are responsible for providing safe, unobstructed access for delivery and pickup and obtaining any required municipal permits.
          </p>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Lone Wolf Dumpsters lays down heavy-duty wooden driveway protection boards under container rollers on all residential placements.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            5. Payment, Cancellation &amp; Additional Charges
          </h2>
          <p style={{ marginBottom: '24px', color: '#334155' }}>
            Payment is due before or upon container delivery. Additional charges may apply for extra rental days, excess weight over included tonnage, prohibited materials, or requested additional services. Cancellation terms may vary and are provided with your invoice.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
            6. Additional Rental Terms
          </h2>
          <p style={{ marginBottom: '32px', color: '#334155' }}>
            Individual pricing, rental dates, weight allowances, additional charges, and rental-specific conditions may be provided on the customer&apos;s invoice and apply to that rental agreement.
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
