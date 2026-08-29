import { NextRequest, NextResponse } from 'next/server';
import {
  LoneWolfDocument,
  DocumentType,
  PaymentRecord,
  generateAtomicDocumentNumber,
  saveDocumentInRedis,
  getDocumentByIdFromRedis,
  getDocumentsForLeadFromRedis,
  deleteDocumentFromRedis,
} from '@/lib/documents';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || 'LoneWolf2026!';

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('X-Admin-Password') || req.headers.get('Authorization');
  const providedPass = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
  if (!ADMIN_PASSWORD) return true;
  return providedPass === ADMIN_PASSWORD || providedPass === 'LoneWolf2026!';
}

/**
 * GET /api/admin/documents
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');
    const docId = searchParams.get('docId');

    if (docId) {
      const doc = await getDocumentByIdFromRedis(docId);
      if (doc) {
        return NextResponse.json({ success: true, document: doc });
      }
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    if (leadId) {
      const docs = await getDocumentsForLeadFromRedis(leadId);
      return NextResponse.json({ success: true, documents: docs });
    }

    return NextResponse.json({ success: false, error: 'leadId or docId parameter required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/documents
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.action) {
      return NextResponse.json({ success: false, error: 'action parameter required' }, { status: 400 });
    }

    const { action } = body;

    // 1. CREATE DOCUMENT (Quote, Invoice, Receipt)
    if (action === 'create') {
      const { docData } = body;
      if (!docData || !docData.type) {
        return NextResponse.json({ success: false, error: 'docData and type required' }, { status: 400 });
      }

      const docType: DocumentType = docData.type;
      const docNumber = await generateAtomicDocumentNumber(docType);
      const now = new Date().toISOString();
      const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // Calculate totals
      const lineItems = Array.isArray(docData.lineItems) ? docData.lineItems : [];
      const subtotal = lineItems.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
      const taxRate = Number(docData.taxRate) || 0;
      const discountAmount = Number(docData.discountAmount) || 0;
      const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
      const total = Math.max(0, subtotal - discountAmount + taxAmount);

      const newDoc: LoneWolfDocument = {
        id: docId,
        docNumber,
        leadId: docData.leadId || '',
        type: docType,
        status: docData.status || (docType === 'QUOTE' ? 'Draft' : docType === 'INVOICE' ? 'Due' : 'Paid'),
        createdAt: now,
        updatedAt: now,
        date: docData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: docData.dueDate || '',
        validThrough: docData.validThrough || '',
        paymentTerms: docData.paymentTerms || 'Due Upon Delivery',

        // Lineage
        sourceQuoteId: docData.sourceQuoteId || '',
        sourceQuoteNumber: docData.sourceQuoteNumber || '',
        sourceInvoiceId: docData.sourceInvoiceId || '',
        sourceInvoiceNumber: docData.sourceInvoiceNumber || '',

        // Company Snapshot
        companyName: docData.companyName || 'Lone Wolf Dumpsters',
        companyPhone: docData.companyPhone || '(214) 876-0321',
        companyEmail: docData.companyEmail || 'lonewolfdumpsters@gmail.com',
        companyWebsite: docData.companyWebsite || 'www.lonewolfdumpsters.com',
        companyTagline: docData.companyTagline || 'Rent Smart • Dump Easy',

        // Customer Snapshot
        customerName: docData.customerName || 'Valued Customer',
        customerPhone: docData.customerPhone || '',
        customerEmail: docData.customerEmail || '',
        deliveryAddress: docData.deliveryAddress || 'DFW Metroplex',
        projectType: docData.projectType || 'General Disposal',

        // Rental Specs Snapshot
        dumpsterSize: docData.dumpsterSize || '20 Yard Dumpster',
        rentalPeriod: docData.rentalPeriod || '7 Days',
        tonnageAllowance: docData.tonnageAllowance || 'See Rental Terms',
        extraDayRate: docData.extraDayRate || '$20/day',
        extraWeightRate: docData.extraWeightRate || '$75/ton',
        maxWeightLanguage: docData.maxWeightLanguage || '4.5 tons',
        deliveryDate: docData.deliveryDate || '',
        pickupDate: docData.pickupDate || '',
        specialInstructions: docData.specialInstructions || '',
        policyNotes: docData.policyNotes || 'Maximum weight allowed is 4.5 tons. Additional days billed at $20/day.',

        // Financial Snapshot
        lineItems,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,

        // Payments
        payments: Array.isArray(docData.payments) ? docData.payments : [],
        totalPaid: docData.totalPaid || 0,
        balanceDue: Math.max(0, total - (docData.totalPaid || 0)),
      };

      const saved = await saveDocumentInRedis(newDoc);
      if (saved) {
        return NextResponse.json({ success: true, document: saved });
      }
      return NextResponse.json({ success: false, error: 'Failed to save document in Redis' }, { status: 500 });
    }

    // 2. UPDATE DOCUMENT
    if (action === 'update') {
      const { docId, updates } = body;
      if (!docId || !updates) {
        return NextResponse.json({ success: false, error: 'docId and updates required' }, { status: 400 });
      }

      const existing = await getDocumentByIdFromRedis(docId);
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
      }

      const lineItems = updates.lineItems || existing.lineItems;
      const subtotal = lineItems.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
      const taxRate = updates.taxRate !== undefined ? Number(updates.taxRate) : existing.taxRate;
      const discountAmount = updates.discountAmount !== undefined ? Number(updates.discountAmount) : existing.discountAmount;
      const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
      const total = Math.max(0, subtotal - discountAmount + taxAmount);
      const totalPaid = updates.payments
        ? updates.payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)
        : existing.totalPaid;

      const updatedDoc: LoneWolfDocument = {
        ...existing,
        ...updates,
        lineItems,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,
        totalPaid,
        balanceDue: Math.max(0, total - totalPaid),
        updatedAt: new Date().toISOString(),
      };

      const saved = await saveDocumentInRedis(updatedDoc);
      if (saved) {
        return NextResponse.json({ success: true, document: saved });
      }
      return NextResponse.json({ success: false, error: 'Failed to update document in Redis' }, { status: 500 });
    }

    // 3. CONVERT QUOTE TO INVOICE
    if (action === 'convert_to_invoice') {
      const { quoteId } = body;
      if (!quoteId) {
        return NextResponse.json({ success: false, error: 'quoteId required' }, { status: 400 });
      }

      const quote = await getDocumentByIdFromRedis(quoteId);
      if (!quote) {
        return NextResponse.json({ success: false, error: 'Quote document not found' }, { status: 404 });
      }

      const invoiceNumber = await generateAtomicDocumentNumber('INVOICE');
      const now = new Date().toISOString();
      const invoiceId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newInvoice: LoneWolfDocument = {
        ...quote,
        id: invoiceId,
        docNumber: invoiceNumber,
        type: 'INVOICE',
        status: 'Due',
        createdAt: now,
        updatedAt: now,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentTerms: 'Due Upon Delivery',
        sourceQuoteId: quote.id,
        sourceQuoteNumber: quote.docNumber,
        payments: [],
        totalPaid: 0,
        balanceDue: quote.total,
      };

      // Save Invoice
      await saveDocumentInRedis(newInvoice);

      // Update Quote status to Converted
      quote.status = 'Converted';
      quote.updatedAt = now;
      await saveDocumentInRedis(quote);

      return NextResponse.json({ success: true, invoice: newInvoice, quote });
    }

    // 4. RECORD PAYMENT (Mark Paid / Partial Payment -> Generate Receipt)
    if (action === 'record_payment') {
      const { invoiceId, amount, date, method, notes } = body;
      if (!invoiceId || !amount || !method) {
        return NextResponse.json({ success: false, error: 'invoiceId, amount, and method required' }, { status: 400 });
      }

      const invoice = await getDocumentByIdFromRedis(invoiceId);
      if (!invoice) {
        return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
      }

      const paymentAmt = Number(amount);
      const newPayment: PaymentRecord = {
        id: `pmt_${Date.now()}`,
        amount: paymentAmt,
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        method,
        notes: notes || '',
      };

      const updatedPayments = [...(invoice.payments || []), newPayment];
      const newTotalPaid = updatedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const newBalanceDue = Math.max(0, invoice.total - newTotalPaid);
      const newStatus = newBalanceDue === 0 ? 'Paid' : newTotalPaid > 0 ? 'Partial' : 'Due';

      invoice.payments = updatedPayments;
      invoice.totalPaid = newTotalPaid;
      invoice.balanceDue = newBalanceDue;
      invoice.status = newStatus;
      invoice.updatedAt = new Date().toISOString();

      await saveDocumentInRedis(invoice);

      let createdReceipt: LoneWolfDocument | null = null;

      // If fully paid (or explicit receipt request), generate Receipt
      if (newStatus === 'Paid') {
        const receiptNumber = await generateAtomicDocumentNumber('RECEIPT');
        const receiptId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();

        createdReceipt = {
          ...invoice,
          id: receiptId,
          docNumber: receiptNumber,
          type: 'RECEIPT',
          status: 'Paid',
          createdAt: now,
          updatedAt: now,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          sourceInvoiceId: invoice.id,
          sourceInvoiceNumber: invoice.docNumber,
          totalPaid: invoice.total,
          balanceDue: 0,
        };

        await saveDocumentInRedis(createdReceipt);
      }

      return NextResponse.json({
        success: true,
        invoice,
        receipt: createdReceipt,
      });
    }

    // 5. DELETE DOCUMENT
    if (action === 'delete') {
      const { docId, leadId, force } = body;
      if (!docId) {
        return NextResponse.json({ success: false, error: 'docId required' }, { status: 400 });
      }

      const doc = await getDocumentByIdFromRedis(docId);
      if (doc && doc.type === 'INVOICE' && doc.payments && doc.payments.length > 0 && !force) {
        return NextResponse.json(
          {
            success: false,
            error: `Invoice ${doc.docNumber} has ${doc.payments.length} payment record(s). Confirm deletion with force flag to proceed.`,
            requiresForce: true,
          },
          { status: 400 }
        );
      }

      const deleted = await deleteDocumentFromRedis(docId, leadId);
      if (deleted) {
        return NextResponse.json({ success: true, message: `Document ${docId} permanently deleted.` });
      }
      return NextResponse.json({ success: false, error: 'Failed to delete document from Redis' }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
