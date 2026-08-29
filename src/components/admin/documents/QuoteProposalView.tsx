'use client';

import React from 'react';
import { LoneWolfDocument } from '@/lib/documents';

interface QuoteProposalViewProps {
  document: LoneWolfDocument;
  logoBase64?: string;
}

export const QuoteProposalView: React.FC<QuoteProposalViewProps> = ({ document: doc, logoBase64 }) => {
  const logoSrc = logoBase64 || '/images/lone-wolf/logo.png';

  return (
    <div
      id="printable-quote-proposal"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0',
        boxSizing: 'border-box',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* 1. Header Banner */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '4px solid #dc2626',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <img
            src={logoSrc}
            alt="Lone Wolf Dumpsters"
            style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', color: '#ffffff', textTransform: 'uppercase' }}>
              {doc.companyName || 'LONE WOLF DUMPSTERS'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {doc.companyTagline || 'RENT SMART • DUMP EASY'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '4px',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '6px',
            }}
          >
            QUOTE / ESTIMATE
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{doc.docNumber}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Date: <strong>{doc.date}</strong>
          </div>
          {doc.validThrough && (
            <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
              Valid Through: <strong>{doc.validThrough}</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* 2. Customer & Service Location Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #0f172a',
              borderRadius: '6px',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
              PREPARED FOR / CUSTOMER
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{doc.customerName}</div>
            <div style={{ fontSize: '0.92rem', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>{doc.customerPhone}</div>
            {doc.customerEmail && <div style={{ fontSize: '0.84rem', color: '#64748b' }}>{doc.customerEmail}</div>}
          </div>

          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #0284c7',
              borderRadius: '6px',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
              SERVICE LOCATION
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{doc.deliveryAddress}</div>
            <div style={{ fontSize: '0.84rem', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
              Project Type: {doc.projectType}
            </div>
          </div>
        </div>

        {/* 3. PROMINENT RENTAL SPECIFICATIONS BANNER */}
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            alignItems: 'center',
            border: '1px solid #1e293b',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SELECTED DUMPSTER SIZE
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              {doc.dumpsterSize}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              RENTAL DURATION
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              ⏱️ {doc.rentalPeriod}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              WEIGHT ALLOWANCE
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80', marginTop: '2px' }}>
              ⚖️ {doc.tonnageAllowance || 'See Rental Terms'}
            </div>
          </div>

          {doc.deliveryDate && (
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TARGET DELIVERY
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fde047', marginTop: '2px' }}>
                📅 {doc.deliveryDate}
              </div>
            </div>
          )}
        </div>

        {/* 4. Itemized Pricing Table */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
            ITEMIZED QUOTE BREAKDOWN
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #cbd5e1', width: '80px' }}>Qty</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '2px solid #cbd5e1', width: '120px' }}>Rate</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '2px solid #cbd5e1', width: '120px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {doc.lineItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{item.description}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>{item.qty}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: '#475569' }}>${Number(item.rate).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>${Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Subtotal & Grand Total Box */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '280px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#475569' }}>
              <span>Subtotal:</span>
              <strong style={{ color: '#0f172a' }}>${Number(doc.subtotal).toFixed(2)}</strong>
            </div>

            {doc.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#dc2626' }}>
                <span>Discount:</span>
                <strong>-${Number(doc.discountAmount).toFixed(2)}</strong>
              </div>
            )}

            {doc.taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#475569' }}>
                <span>Tax ({doc.taxRate}%):</span>
                <strong>+${Number(doc.taxAmount).toFixed(2)}</strong>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0 0 0',
                marginTop: '8px',
                borderTop: '2px solid #0f172a',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#0f172a',
              }}
            >
              <span>QUOTE TOTAL:</span>
              <span style={{ color: '#dc2626' }}>${Number(doc.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 6. Rental Policies & Terms */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
            IMPORTANT RENTAL POLICIES &amp; INSTRUCTIONS
          </div>
          <div>• Additional Days Billed At: <strong>{doc.extraDayRate || '$20/day'}</strong></div>
          <div>• Maximum Allowed Load Weight: <strong>{doc.maxWeightLanguage || '4.5 tons'}</strong></div>
          <div>• Driveway Protection: Wood planks placed under container rollers to protect surface.</div>
          <div>• Prohibited Materials: Hazardous waste, liquids, paints, batteries, and tires.</div>
          {doc.specialInstructions && <div style={{ marginTop: '6px', color: '#0f172a', fontStyle: 'italic' }}>• Notes: {doc.specialInstructions}</div>}
        </div>
      </div>

      {/* 7. Footer */}
      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '16px 32px', fontSize: '0.82rem', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
        Questions? Call or text <strong>{doc.companyPhone || '(214) 876-0321'}</strong> | Email: <strong>{doc.companyEmail || 'lonewolfdumpsters@gmail.com'}</strong><br />
        <strong>{doc.companyWebsite || 'www.lonewolfdumpsters.com'}</strong> • Direct Owner-Operator Dispatch Across 48 DFW Cities
      </div>
    </div>
  );
};
