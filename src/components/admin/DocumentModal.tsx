'use client';

import React, { useState, useEffect } from 'react';
import {
  LoneWolfDocument,
  DocumentType,
  DocumentLineItem,
  PaymentMethod,
} from '@/lib/documents';
import { Lead } from '@/app/admin/page';
import { QuoteProposalView } from './documents/QuoteProposalView';
import { InvoiceView } from './documents/InvoiceView';
import { ReceiptView } from './documents/ReceiptView';
import { X, Plus, Trash2, Mail, Download, CheckCircle, ArrowRight, ArrowLeft, Save, DollarSign, FileText } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  existingDoc?: LoneWolfDocument | null;
  initialType?: DocumentType;
  siteContent?: any;
  onDocumentSaved?: (doc: LoneWolfDocument) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  lead = null,
  existingDoc = null,
  initialType = 'QUOTE',
  siteContent,
  onDocumentSaved,
}) => {
  const [docType, setDocType] = useState<DocumentType>(existingDoc?.type || initialType);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<LoneWolfDocument | null>(existingDoc);

  // Editable Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [projectType, setProjectType] = useState('');

  const [dumpsterSize, setDumpsterSize] = useState('20 Yard Dumpster');
  const [rentalPeriod, setRentalPeriod] = useState('7 Days');
  const [tonnageAllowance, setTonnageAllowance] = useState('See Rental Terms');
  const [extraDayRate, setExtraDayRate] = useState('$20/day');
  const [extraWeightRate, setExtraWeightRate] = useState('$80/ton');
  const [maxWeightLanguage, setMaxWeightLanguage] = useState('4.5 tons');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Due Upon Delivery');

  const [lineItems, setLineItems] = useState<DocumentLineItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Zelle');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNotes, setPaymentNotes] = useState('');

  // Initialize or snapshot lead data on open
  useEffect(() => {
    if (!isOpen) return;

    if (existingDoc) {
      setCurrentDoc(existingDoc);
      setDocType(existingDoc.type);
      setCustomerName(existingDoc.customerName || '');
      setCustomerPhone(existingDoc.customerPhone || '');
      setCustomerEmail(existingDoc.customerEmail || '');
      setDeliveryAddress(existingDoc.deliveryAddress || '');
      setProjectType(existingDoc.projectType || '');
      setDumpsterSize(existingDoc.dumpsterSize || '20 Yard Dumpster');
      setRentalPeriod(existingDoc.rentalDuration || '7 Days');
      setTonnageAllowance(existingDoc.includedWeight || 'See Rental Terms');
      setExtraDayRate(existingDoc.extraDayRate || '$20/day');
      setExtraWeightRate(existingDoc.extraWeightRate || '$80/ton');
      setDeliveryDate(existingDoc.deliveryDate || '');
      setSpecialInstructions(existingDoc.notes || '');
      setPaymentTerms(existingDoc.terms || 'Due Upon Delivery');
      setLineItems(existingDoc.lineItems || []);
    } else {
      setDocType(initialType || 'QUOTE');
      setMode('edit');
      // Auto-populate from lead if present, or initialize blank for global new document
      const pr = siteContent?.pricing || {};
      let defaultPrice = 425;
      let sizeName = '20 Yard Dumpster';
      let tonnage = pr.weightIncludedText || 'See Rental Terms';

      if (lead) {
        const svcLower = (lead.size || lead.service || '').toLowerCase();
        if (svcLower.includes('15')) {
          sizeName = '15 Yard Dumpster';
          defaultPrice = pr.fifteenYard || 385;
        } else if (svcLower.includes('25')) {
          sizeName = '25 Yard Dumpster';
          defaultPrice = pr.twentyFiveYard || 475;
        } else if (svcLower.includes('junk')) {
          sizeName = 'Full-Service Junk Removal';
          defaultPrice = 150;
          tonnage = 'Labor & Disposal Included';
        }
      }

      setCustomerName(lead?.name || '');
      setCustomerPhone(lead?.phone || '');
      setCustomerEmail(lead?.email || '');
      setDeliveryAddress(lead?.address || lead?.deliveryAddress || '');
      setProjectType(lead?.projectType || 'Household Cleanout');
      setDumpsterSize(sizeName);
      setRentalPeriod(lead?.rentalDuration || '7 Days');
      setTonnageAllowance(tonnage);
      setExtraDayRate('$20/day');
      setExtraWeightRate('$80/ton');
      setMaxWeightLanguage('4.5 tons');
      setDeliveryDate(lead?.preferredDate || '');
      setSpecialInstructions(lead?.notes || '');
      setPaymentTerms('Due Upon Delivery');

      setLineItems([
        {
          id: `item_1`,
          description: `${sizeName} Rental (${lead?.rentalDuration || '7 Days'})`,
          qty: 1,
          rate: defaultPrice,
          amount: defaultPrice,
        },
      ]);
      setDiscountAmount(0);
      setTaxRate(0);
      setCurrentDoc(null);
    }
  }, [isOpen, existingDoc, initialType, lead, siteContent]);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
  const total = Math.max(0, subtotal - discountAmount + taxAmount);
  const totalPaid = currentDoc?.totalPaid || 0;
  const balanceDue = Math.max(0, total - totalPaid);

  // Add line item
  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: `item_${Date.now()}`,
        description: 'Additional Service / Delivery Fee',
        qty: 1,
        rate: 50,
        amount: 50,
      },
    ]);
  };

  // Update line item
  const handleUpdateItem = (id: string, field: keyof DocumentLineItem, val: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === 'qty' || field === 'rate') {
          const qty = field === 'qty' ? Number(val) : item.qty;
          const rate = field === 'rate' ? Number(val) : item.rate;
          updated.amount = qty * rate;
        }
        return updated;
      })
    );
  };

  // Remove line item
  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Build document payload
  const buildDocPayload = (): Partial<LoneWolfDocument> => {
    let payments = (currentDoc as LoneWolfDocument | null)?.payments || [];
    let calculatedPaid = totalPaid;

    if (docType === 'RECEIPT' && (!payments || payments.length === 0)) {
      const pAmt = paymentAmount > 0 ? paymentAmount : total;
      payments = [
        {
          id: `pmt_${Date.now()}`,
          amount: pAmt,
          date: paymentDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          method: paymentMethod || 'Zelle',
          notes: paymentNotes || '',
        },
      ];
      calculatedPaid = pAmt;
    }

    const calculatedBalance = Math.max(0, total - calculatedPaid);

    return {
      type: docType,
      leadId: lead?.id || '',
      status: docType === 'QUOTE' ? 'Draft' : docType === 'INVOICE' ? 'Due' : calculatedBalance === 0 ? 'Paid' : 'Partial',
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      projectType,
      dumpsterSize,
      rentalPeriod,
      tonnageAllowance,
      extraDayRate,
      extraWeightRate,
      maxWeightLanguage,
      deliveryDate,
      specialInstructions,
      paymentTerms,
      lineItems,
      subtotal,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      payments,
      totalPaid: calculatedPaid,
      balanceDue: calculatedBalance,
    };
  };

  // Save Document
  const handleSaveDocument = async (): Promise<LoneWolfDocument | null> => {
    setSaving(true);
    try {
      const payload = buildDocPayload();
      const isNew = !currentDoc?.id;
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isNew ? { action: 'create', docData: payload } : { action: 'update', docId: currentDoc.id, updates: payload }
        ),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        const savedDoc = data.document;
        setCurrentDoc(savedDoc);
        if (onDocumentSaved) onDocumentSaved(savedDoc);
        return savedDoc;
      } else {
        alert(data?.error || 'Failed to save document.');
      }
    } catch {
      alert('Network error saving document.');
    } finally {
      setSaving(false);
    }
    return null;
  };

  // Convert Quote to Invoice
  const handleConvertQuoteToInvoice = async () => {
    let activeDoc = currentDoc;
    if (!activeDoc) {
      activeDoc = await handleSaveDocument();
    }
    if (!activeDoc) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'convert_to_invoice', quoteId: activeDoc.id }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setCurrentDoc(data.invoice);
        setDocType('INVOICE');
        if (onDocumentSaved) onDocumentSaved(data.invoice);
        alert(`Quote ${activeDoc.docNumber} successfully converted to Invoice ${data.invoice.docNumber}!`);
      } else {
        alert(data?.error || 'Failed to convert quote.');
      }
    } catch {
      alert('Network error converting quote.');
    } finally {
      setSaving(false);
    }
  };

  // Open Payment Modal
  const handleOpenPaymentModal = () => {
    setPaymentAmount(balanceDue > 0 ? balanceDue : total);
    setShowPaymentModal(true);
  };

  // Record Payment & Generate Receipt
  const handleRecordPaymentSubmit = async () => {
    let activeDoc = currentDoc;
    if (!activeDoc) {
      activeDoc = await handleSaveDocument();
    }
    if (!activeDoc) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'record_payment',
          invoiceId: activeDoc.id,
          amount: paymentAmount,
          date: paymentDate,
          method: paymentMethod,
          notes: paymentNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setShowPaymentModal(false);
        if (data.receipt) {
          setCurrentDoc(data.receipt);
          setDocType('RECEIPT');
          if (onDocumentSaved) onDocumentSaved(data.receipt);
          alert(`Payment of $${paymentAmount.toFixed(2)} recorded! Paid Receipt ${data.receipt.docNumber} generated.`);
        } else {
          setCurrentDoc(data.invoice);
          if (onDocumentSaved) onDocumentSaved(data.invoice);
          alert(`Partial payment of $${paymentAmount.toFixed(2)} recorded on Invoice ${data.invoice.docNumber}. Remaining balance: $${data.invoice.balanceDue.toFixed(2)}.`);
        }
      } else {
        alert(data?.error || 'Failed to record payment.');
      }
    } catch {
      alert('Network error recording payment.');
    } finally {
      setSaving(false);
    }
  };

  // Send Email via Resend API
  const handleSendEmailSubmit = async () => {
    let activeDoc = currentDoc;
    if (!activeDoc) {
      activeDoc = await handleSaveDocument();
    }
    if (!activeDoc) return;

    setEmailing(true);
    try {
      const res = await fetch('/api/admin/documents/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId: activeDoc.id,
          recipientEmail,
          subject: emailSubject,
          messageText: emailMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setShowEmailModal(false);
        alert(`Document successfully emailed to ${recipientEmail}!`);
        if (data.document) setCurrentDoc(data.document);
      } else {
        alert(data?.error || 'Failed to send email.');
      }
    } catch {
      alert('Network error sending document email.');
    } finally {
      setEmailing(false);
    }
  };

  // Open Email Modal
  const handleOpenEmailModal = async () => {
    let activeDoc = currentDoc;
    if (!activeDoc) {
      activeDoc = await handleSaveDocument();
    }
    if (!activeDoc) return;

    setRecipientEmail(customerEmail || lead?.email || '');
    const docLabel = docType === 'QUOTE' ? 'Quote' : docType === 'INVOICE' ? 'Invoice' : 'Paid Receipt';
    const num = activeDoc.docNumber;
    setEmailSubject(`🐺 Lone Wolf Dumpster Rentals: Your ${docLabel} (${num})`);
    setEmailMessage(
      `Hi ${customerName},\n\nThank you for reaching out to Lone Wolf Dumpsters. Please review your ${docLabel.toLowerCase()} below.\n\nIf you have any questions or need to adjust your delivery date or rental period, call or text us anytime at (214) 876-0321.\n\nLone Wolf Dumpster Rentals\nRent Smart • Dump Easy`
    );
    setShowEmailModal(true);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById(
        docType === 'QUOTE' ? 'printable-quote-proposal' : docType === 'INVOICE' ? 'printable-invoice' : 'printable-receipt'
      );
      if (!element) {
        alert('Document view not ready for PDF export. Please switch to Preview mode.');
        return;
      }

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${currentDoc?.docNumber || 'LoneWolf_Document'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  // Delete / Discard Document Handler
  const handleDeleteDocument = async () => {
    if (!currentDoc || !currentDoc.id || currentDoc.id.startsWith('temp_')) {
      onClose();
      return;
    }

    const docTypeLabel = docType === 'QUOTE' ? 'Quote' : docType === 'INVOICE' ? 'Invoice' : 'Receipt';
    const confirmMsg = `Are you sure you want to permanently delete ${docTypeLabel} ${currentDoc.docNumber}? This cannot be undone.`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          docId: currentDoc.id,
          leadId: lead?.id,
          force: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${docTypeLabel} ${currentDoc.docNumber} has been permanently deleted.`);
        if (onDocumentSaved) {
          onDocumentSaved(null as any);
        }
        onClose();
      } else {
        alert(`Failed to delete document: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error deleting document: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const previewDocObj: LoneWolfDocument = currentDoc || {
    id: 'temp_preview',
    number: docType === 'QUOTE' ? 'Q-2026-DRAFT' : docType === 'INVOICE' ? 'INV-2026-DRAFT' : 'REC-2026-DRAFT',
    docNumber: docType === 'QUOTE' ? 'Q-2026-DRAFT' : docType === 'INVOICE' ? 'INV-2026-DRAFT' : 'REC-2026-DRAFT',
    leadId: lead?.id || '',
    type: docType,
    status: docType === 'QUOTE' ? 'Draft' : docType === 'INVOICE' ? 'Due' : 'Paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    issuedDate: new Date().toISOString().split('T')[0],
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    tax: taxAmount,
    validThrough: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    paymentTerms,
    companyName: 'Lone Wolf Dumpsters',
    companyPhone: '(214) 876-0321',
    companyEmail: 'lonewolfdumpsters@gmail.com',
    companyWebsite: 'www.lonewolfdumpsters.com',
    companyTagline: 'Rent Smart • Dump Easy',
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    projectType,
    dumpsterSize,
    rentalPeriod,
    tonnageAllowance,
    extraDayRate,
    extraWeightRate,
    maxWeightLanguage,
    deliveryDate,
    specialInstructions,
    policyNotes: 'Maximum weight allowed is 4.5 tons. Additional days billed at $20/day.',
    lineItems,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    total,
    payments: (currentDoc as LoneWolfDocument | null)?.payments || [],
    totalPaid,
    balanceDue,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '30px 16px 40px 16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          width: '100%',
          maxWidth: '1020px',
          margin: '30px auto',
          maxHeight: 'calc(100vh - 70px)',
          borderRadius: '12px',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#1e293b',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <FileText size={18} color="#dc2626" />
              {!currentDoc ? (
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <option value="QUOTE">📄 Quote / Estimate</option>
                  <option value="INVOICE">🧾 Direct Invoice</option>
                  <option value="RECEIPT">🟢 Direct Receipt</option>
                </select>
              ) : (
                <span>
                  {docType === 'QUOTE' ? 'QUOTE / ESTIMATE PROPOSAL' : docType === 'INVOICE' ? 'TRANSACTIONAL INVOICE' : 'PAID RECEIPT'}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', backgroundColor: '#334155', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                {currentDoc?.docNumber || 'NEW DRAFT'}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
              Customer: <strong>{customerName || 'Direct / Manual Customer'}</strong> {lead ? `| Lead ID: ${lead.id}` : '| Manual Entry'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#0f172a', borderRadius: '6px', padding: '3px', display: 'flex', gap: '2px', border: '1px solid #334155' }}>
              <button
                type="button"
                onClick={() => setMode('edit')}
                style={{
                  backgroundColor: mode === 'edit' ? '#dc2626' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setMode('preview')}
                style={{
                  backgroundColor: mode === 'preview' ? '#0284c7' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Preview Document
              </button>
            </div>

            <button
              type="button"
              onClick={handleDeleteDocument}
              data-testid="doc-modal-delete-btn"
              title={currentDoc ? "Delete Document Permanently" : "Discard Draft"}
              style={{
                backgroundColor: '#451a1a',
                color: '#f87171',
                border: '1px solid #7f1d1d',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Trash2 size={14} />
              <span>{currentDoc ? 'Delete' : 'Discard'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              data-testid="doc-modal-close"
              style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {mode === 'preview' ? (
            <div>
              {docType === 'QUOTE' && <QuoteProposalView document={previewDocObj} />}
              {docType === 'INVOICE' && <InvoiceView document={previewDocObj} />}
              {docType === 'RECEIPT' && <ReceiptView document={previewDocObj} />}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Left Column: Customer & Specs */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  1. CUSTOMER &amp; SERVICE LOCATION
                </h4>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Customer Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Phone *</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Delivery Address *</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <h4 style={{ margin: '12px 0 4px 0', fontSize: '0.9rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  2. RENTAL SPECIFICATIONS
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Dumpster Size</label>
                    <input
                      type="text"
                      value={dumpsterSize}
                      onChange={(e) => setDumpsterSize(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Rental Duration</label>
                    <select
                      value={rentalPeriod}
                      onChange={(e) => setRentalPeriod(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    >
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="7+ Days / Custom">7+ Days / Custom</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Included Weight</label>
                    <input
                      type="text"
                      value={tonnageAllowance}
                      onChange={(e) => setTonnageAllowance(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Extra Day Rate</label>
                    <input
                      type="text"
                      value={extraDayRate}
                      onChange={(e) => setExtraDayRate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Delivery Date</label>
                    <input
                      type="text"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      placeholder="e.g. As soon as possible"
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Payment Terms</label>
                    <input
                      type="text"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                {docType === 'RECEIPT' && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.86rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase' }}>
                      RECEIPT PAYMENT DETAILS
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>Amount Paid ($)</label>
                        <input
                          type="number"
                          value={paymentAmount || total}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          style={{ width: '100%', padding: '6px 8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          style={{ width: '100%', padding: '6px 8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
                        >
                          <option value="Zelle">Zelle</option>
                          <option value="Card">Credit / Debit Card</option>
                          <option value="Cash">Cash</option>
                          <option value="Check">Check</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>Ref / Notes</label>
                      <input
                        type="text"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="e.g. Zelle Txn #12345 or Cash on Delivery"
                        style={{ width: '100%', padding: '6px 8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Line Items & Pricing Breakdown */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    3. ITEMIZED LINE ITEMS &amp; PRICING
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    style={{ backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #334155', padding: '4px 10px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Line Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {lineItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) 55px 75px 28px',
                        gap: '6px',
                        alignItems: 'center',
                        backgroundColor: '#0f172a',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #334155',
                      }}
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                        style={{ minWidth: 0, width: '100%', boxSizing: 'border-box', padding: '6px 8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem' }}
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)}
                        placeholder="Qty"
                        style={{ minWidth: 0, width: '100%', boxSizing: 'border-box', padding: '6px 4px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem', textAlign: 'center' }}
                      />
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)}
                        placeholder="Rate"
                        style={{ minWidth: 0, width: '100%', boxSizing: 'border-box', padding: '6px 6px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove Item"
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Discount ($)</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Tax Rate (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '6px', border: '1px solid #334155', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#94a3b8' }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#f87171', marginTop: '4px' }}>
                      <span>Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {taxRate > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
                      <span>Tax ({taxRate}%):</span>
                      <span>+${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#4ade80', marginTop: '8px', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                    <span>TOTAL:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {docType === 'INVOICE' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, color: balanceDue > 0 ? '#f87171' : '#4ade80', marginTop: '4px' }}>
                      <span>Balance Due:</span>
                      <span>${balanceDue.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#1e293b',
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleDeleteDocument}
              disabled={saving}
              style={{
                backgroundColor: '#451a1a',
                color: '#f87171',
                border: '1px solid #7f1d1d',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={15} />
              <span>{currentDoc ? 'Delete Document' : 'Discard Draft'}</span>
            </button>

            {mode === 'preview' ? (
              <button
                type="button"
                onClick={() => setMode('edit')}
                style={{
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  border: '1px solid #475569',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ArrowLeft size={15} />
                <span>← Back to Edit Form</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSaveDocument}
                  disabled={saving}
                  style={{
                    backgroundColor: docType === 'QUOTE' ? '#16a34a' : docType === 'INVOICE' ? '#0284c7' : '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : docType === 'QUOTE' ? 'Save Draft' : docType === 'INVOICE' ? 'Save Invoice' : 'Save Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('preview')}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#38bdf8',
                    border: '1px solid #334155',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={15} />
                  <span>Preview</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleOpenEmailModal}
              style={{
                backgroundColor: '#0369a1',
                color: '#ffffff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Mail size={15} />
              <span>Email {docType === 'QUOTE' ? 'Quote' : docType === 'INVOICE' ? 'Invoice' : 'Receipt'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: '1px solid #475569',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {docType === 'QUOTE' && (
              <button
                type="button"
                onClick={handleConvertQuoteToInvoice}
                disabled={saving}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Convert to Invoice</span>
                <ArrowRight size={15} />
              </button>
            )}

            {docType === 'INVOICE' && (
              <button
                type="button"
                onClick={handleOpenPaymentModal}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <DollarSign size={15} />
                <span>Record Payment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-MODAL: Email Dispatch */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Email Document to Customer</h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Recipient Email *</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Message Body</label>
              <textarea
                rows={5}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" onClick={() => setShowEmailModal(false)} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>
                Cancel
              </button>
              <button type="button" onClick={handleSendEmailSubmit} disabled={emailing} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}>
                {emailing ? 'Sending via Resend...' : 'Send Email Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Record Payment */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>Record Customer Payment</h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Payment Amount ($) *</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              >
                <option value="Zelle">Zelle</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Reference Notes (Optional)</label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="e.g. Zelle Txn #12345"
                style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" onClick={() => setShowPaymentModal(false)} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>
                Cancel
              </button>
              <button type="button" onClick={handleRecordPaymentSubmit} disabled={saving} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}>
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
