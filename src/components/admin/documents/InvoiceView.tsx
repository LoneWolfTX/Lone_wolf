'use client';

import React from 'react';
import { LoneWolfDocument } from '@/lib/documents';

interface InvoiceViewProps {
  document: LoneWolfDocument;
  logoBase64?: string;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ document: doc, logoBase64 }) => {
  const logoSrc = logoBase64 || '/images/lone-wolf/logo.png';
  const statusColor = doc.balanceDue === 0 ? '#16a34a' : (doc.totalPaid || 0) > 0 ? '#f59e0b' : '#dc2626';

  return (
    <div
      id="printable-invoice"
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
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '4px solid #0284c7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={logoSrc} alt="Lone Wolf Dumpsters" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
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
              backgroundColor: '#0284c7',
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
            INVOICE
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{doc.docNumber}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Invoice Date: <strong>{doc.date}</strong>
          </div>
          {doc.dueDate && (
            <div style={{ fontSize: '0.78rem', color: '#fde047' }}>
              Payment Due: <strong>{doc.dueDate}</strong>
            </div>
          )}
          {doc.paymentTerms && (
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              Terms: <strong>{doc.paymentTerms}</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Bill To & Service Address */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              BILL TO / CUSTOMER
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{doc.customerName}</div>
            <div style={{ fontSize: '0.92rem', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>{doc.customerPhone}</div>
            {doc.customerEmail && <div style={{ fontSize: '0.84rem', color: '#64748b' }}>{doc.customerEmail}</div>}
          </div>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              SERVICE LOCATION
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{doc.deliveryAddress}</div>
            <div style={{ fontSize: '0.84rem', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
              Project: {doc.projectType}
            </div>
            {doc.sourceQuoteNumber && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Ref Quote: <strong>{doc.sourceQuoteNumber}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div style={{ marginBottom: '28px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem' }}>
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

        {/* Totals & Payments */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '300px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#475569' }}>
              <span>Subtotal:</span>
              <strong style={{ color: '#0f172a' }}>${Number(doc.subtotal).toFixed(2)}</strong>
            </div>

            {(doc.discountAmount || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#dc2626' }}>
                <span>Discount:</span>
                <strong>-${Number(doc.discountAmount).toFixed(2)}</strong>
              </div>
            )}

            {(doc.taxAmount || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#475569' }}>
                <span>Tax ({doc.taxRate}%):</span>
                <strong>+${Number(doc.taxAmount).toFixed(2)}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #0f172a', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
              <span>INVOICE TOTAL:</span>
              <span>${Number(doc.total).toFixed(2)}</span>
            </div>

            {(doc.totalPaid || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#16a34a', fontWeight: 700 }}>
                <span>Payments Received:</span>
                <span>-${Number(doc.totalPaid).toFixed(2)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0 0 0',
                marginTop: '8px',
                borderTop: '2px solid ' + statusColor,
                fontSize: '1.2rem',
                fontWeight: 900,
                color: statusColor,
              }}
            >
              <span>BALANCE DUE:</span>
              <span>${Number(doc.balanceDue).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Records List if present */}
        {doc.payments && doc.payments.length > 0 && (
          <div style={{ marginBottom: '24px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '14px 18px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
              PAYMENT RECORD HISTORY
            </div>
            {doc.payments.map((pmt) => (
              <div key={pmt.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#15803d', padding: '3px 0' }}>
                <span>Date: {pmt.date} via <strong>{pmt.method}</strong> {pmt.notes ? `(${pmt.notes})` : ''}</span>
                <strong>+${Number(pmt.amount).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '16px 32px', fontSize: '0.82rem', textAlign: 'center' }}>
        Questions? Call or text <strong>{doc.companyPhone || '(214) 876-0321'}</strong> | <strong>{doc.companyWebsite || 'www.lonewolfdumpsters.com'}</strong>
      </div>
    </div>
  );
};
