import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, verifyCsrfOrigin } from '@/lib/auth';
import {
  saveDocumentInRedis,
  getDocumentByIdFromRedis,
  getDocumentsForLeadFromRedis,
  deleteDocumentFromRedis,
  generateAtomicDocumentNumber,
  LoneWolfDocument,
} from '@/lib/documents';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/documents
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get('docId');
  const leadId = searchParams.get('leadId');

  try {
    if (docId) {
      const doc = await getDocumentByIdFromRedis(docId);
      if (!doc) {
        return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, document: doc });
    }

    if (leadId) {
      const docs = await getDocumentsForLeadFromRedis(leadId);
      return NextResponse.json({ success: true, documents: docs, total: docs.length });
    }

    return NextResponse.json({ success: false, error: 'Provide docId or leadId' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/documents
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.action) {
      return NextResponse.json({ success: false, error: 'Action is required' }, { status: 400 });
    }

    const { action, docData, docId, leadId, payment } = body;

    if (action === 'create') {
      const docType = docData.type || 'QUOTE';
      const docNumber = docData.number || (await generateAtomicDocumentNumber(docType));
      const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const newDoc: LoneWolfDocument = {
        id,
        type: docType,
        number: docNumber,
        leadId: leadId || docData.leadId,
        customerName: docData.customerName || 'Customer',
        customerPhone: docData.customerPhone || '',
        customerEmail: docData.customerEmail || '',
        deliveryAddress: docData.deliveryAddress || 'DFW Metroplex',
        dumpsterSize: docData.dumpsterSize || '20 Yard',
        projectType: docData.projectType || 'General Waste',
        deliveryDate: docData.deliveryDate || new Date().toISOString().split('T')[0],
        rentalDuration: docData.rentalDuration || '7 Days',
        includedWeight: docData.includedWeight || '2.0 Tons',
        extraWeightRate: docData.extraWeightRate || '$80/ton',
        extraDayRate: docData.extraDayRate || '$20/day',
        lineItems: Array.isArray(docData.lineItems) ? docData.lineItems : [],
        subtotal: typeof docData.subtotal === 'number' ? docData.subtotal : 425,
        tax: typeof docData.tax === 'number' ? docData.tax : 0,
        total: typeof docData.total === 'number' ? docData.total : 425,
        quoteStatus: docType === 'QUOTE' ? docData.quoteStatus || 'Draft' : undefined,
        invoiceStatus: docType === 'INVOICE' ? docData.invoiceStatus || 'Due' : undefined,
        issuedDate: docData.issuedDate || new Date().toISOString().split('T')[0],
        dueDate: docData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        payments: Array.isArray(docData.payments) ? docData.payments : [],
        balanceDue: typeof docData.balanceDue === 'number' ? docData.balanceDue : (docData.total || 425),
        notes: docData.notes || '',
        terms: docData.terms || 'Standard Lone Wolf Dumpsters terms apply. Prohibited items: paint, tires, hazardous chemicals.',
        originalQuoteId: docData.originalQuoteId,
      };

      const saved = await saveDocumentInRedis(newDoc);
      return NextResponse.json({ success: !!saved, document: saved });
    }

    if (action === 'update' && docId && docData) {
      const existing = await getDocumentByIdFromRedis(docId);
      if (!existing) return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });

      const updatedDoc: LoneWolfDocument = {
        ...existing,
        ...docData,
        id: existing.id,
        updatedAt: new Date().toISOString(),
      };

      const saved = await saveDocumentInRedis(updatedDoc);
      return NextResponse.json({ success: !!saved, document: saved });
    }

    if (action === 'add_payment' && docId && payment) {
      const existing = await getDocumentByIdFromRedis(docId);
      if (!existing) return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });

      const paymentEntry = {
        id: 'pay_' + Date.now(),
        amount: Number(payment.amount) || 0,
        date: payment.date || new Date().toISOString().split('T')[0],
        method: payment.method || 'Card',
        notes: payment.notes || '',
      };

      const updatedPayments = [...(existing.payments || []), paymentEntry];
      const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const newBalance = Math.max(0, existing.total - totalPaid);
      const newStatus = newBalance === 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : existing.invoiceStatus;

      const updatedDoc: LoneWolfDocument = {
        ...existing,
        payments: updatedPayments,
        balanceDue: newBalance,
        invoiceStatus: newStatus as any,
        paidAt: newBalance === 0 ? new Date().toISOString() : existing.paidAt,
        updatedAt: new Date().toISOString(),
      };

      const saved = await saveDocumentInRedis(updatedDoc);
      return NextResponse.json({ success: !!saved, document: saved, payment: paymentEntry });
    }

    return NextResponse.json({ success: false, error: 'Invalid document action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/documents
 */
export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get('docId');
  const leadId = searchParams.get('leadId') || undefined;

  if (!docId) {
    return NextResponse.json({ success: false, error: 'docId is required' }, { status: 400 });
  }

  const deleted = await deleteDocumentFromRedis(docId, leadId);
  return NextResponse.json({ success: deleted, docId });
}
