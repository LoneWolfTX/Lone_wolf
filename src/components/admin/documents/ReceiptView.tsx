'use client';

import React from 'react';
import { LoneWolfDocument } from '@/lib/documents';

interface ReceiptViewProps {
  document: LoneWolfDocument;
  logoBase64?: string;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ document: doc, logoBase64 }) => {
  const logoSrc = logoBase64 || '/images/lone-wolf/logo.png';
  const latestPayment = doc.payments && doc.payments.length > 0 ? doc.payments[doc.payments.length - 1] : null;

  return (
    <div
      id="printable-receipt"
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
      {/* Simple Header */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '4px solid #22c55e',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={logoSrc} alt="Lone Wolf Dumpsters" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px', color: '#ffffff', textTransform: 'uppercase' }}>
              {doc.companyName || 'LONE WOLF DUMPSTERS'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
              {doc.companyTagline || 'RENT SMART • DUMP EASY'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              backgroundColor: '#16a34a',
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
            PAID RECEIPT
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{doc.docNumber}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Payment Date: <strong>{latestPayment?.date || doc.date}</strong>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px', position: 'relative' }}>
        {/* Customer & Payment Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              CUSTOMER
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{doc.customerName}</div>
            <div style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 700 }}>{doc.customerPhone}</div>
            {doc.customerEmail && <div style={{ fontSize: '0.84rem', color: '#64748b' }}>{doc.customerEmail}</div>}
          </div>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px', position: 'relative' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              PAYMENT DETAILS
            </div>
            <div style={{ fontSize: '0.9rem', color: '#0f172a' }}>
              Method: <strong>{latestPayment?.method || 'Card / Electronic'}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Payment Date: <strong>{latestPayment?.date || doc.date}</strong>
            </div>
            {doc.sourceInvoiceNumber && (
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Invoice Ref: <strong>{doc.sourceInvoiceNumber}</strong>
              </div>
            )}
            {latestPayment?.notes && (
              <div style={{ fontSize: '0.82rem', color: '#166534', fontStyle: 'italic', marginTop: '2px' }}>
                Ref Note: {latestPayment.notes}
              </div>
            )}
          </div>
        </div>

        {/* ELEGANT NON-OBSTRUCTIVE PAID STAMP IN LOWER RIGHT summary AREA */}

        {/* Itemized Table */}
        <div style={{ marginBottom: '28px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Description</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '2px solid #cbd5e1', width: '70px' }}>Qty</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', borderBottom: '2px solid #cbd5e1', width: '110px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {doc.lineItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{item.description}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#475569' }}>{item.qty}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>${Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple Balance Box with Non-Obstructive PAID Stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div
            style={{
              border: '3px solid #22c55e',
              color: '#16a34a',
              fontSize: '1.4rem',
              fontWeight: 900,
              padding: '6px 20px',
              borderRadius: '6px',
              transform: 'rotate(-4deg)',
              letterSpacing: '2px',
              backgroundColor: '#f0fdf4',
              display: 'inline-block',
            }}
          >
            ✓ PAID IN FULL
          </div>

          <div style={{ width: '280px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#166534', padding: '4px 0' }}>
              <span>Total Amount:</span>
              <strong>${Number(doc.total).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#166534', padding: '4px 0', borderBottom: '1px solid #86efac' }}>
              <span>Amount Paid:</span>
              <strong>${Number(doc.totalPaid || doc.total).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, color: '#15803d', paddingTop: '8px' }}>
              <span>BALANCE DUE:</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '14px 32px', fontSize: '0.8rem', textAlign: 'center' }}>
        Thank you for your business! Lone Wolf Dumpster Rentals | (214) 876-0321
      </div>
    </div>
  );
};
