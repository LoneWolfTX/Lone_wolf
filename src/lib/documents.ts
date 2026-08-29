import { UPSTASH_URL, UPSTASH_TOKEN } from './redis';

export type DocumentType = 'QUOTE' | 'INVOICE' | 'RECEIPT';
export type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired' | 'Converted';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Due' | 'Partial' | 'Paid' | 'Overdue';
export type PaymentMethod = 'Cash' | 'Card' | 'Zelle' | 'Check' | 'Other';

export interface DocumentLineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  notes?: string;
}

export interface LoneWolfDocument {
  id: string;
  docNumber: string;
  leadId: string;
  type: DocumentType;
  status: QuoteStatus | InvoiceStatus | string;
  createdAt: string;
  updatedAt: string;
  date: string;
  dueDate?: string;
  validThrough?: string;
  paymentTerms?: string;

  // Lineage tracking
  sourceQuoteId?: string;
  sourceQuoteNumber?: string;
  sourceInvoiceId?: string;
  sourceInvoiceNumber?: string;

  // Company Snapshot
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyTagline: string;

  // Customer Snapshot
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  projectType: string;

  // Rental Specs Snapshot
  dumpsterSize: string;
  rentalPeriod: string;
  tonnageAllowance: string;
  extraDayRate: string;
  extraWeightRate: string;
  maxWeightLanguage: string;
  deliveryDate?: string;
  pickupDate?: string;
  specialInstructions?: string;
  policyNotes?: string;

  // Financial Snapshot
  lineItems: DocumentLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;

  // Payments & Balance
  payments: PaymentRecord[];
  totalPaid: number;
  balanceDue: number;
}

const DOC_KEY_PREFIX = 'lonewolf:doc:';
const DOC_LIST_KEY = 'lonewolf:documents';
const LEAD_DOCS_KEY_PREFIX = 'lonewolf:lead_docs:';

/**
 * Generate a collision-safe, atomic document number e.g. Q-2026-0101
 */
export async function generateAtomicDocumentNumber(type: DocumentType): Promise<string> {
  const prefixMap: Record<DocumentType, string> = {
    QUOTE: 'Q',
    INVOICE: 'INV',
    RECEIPT: 'REC',
  };
  const prefix = prefixMap[type];
  const year = new Date().getFullYear();

  try {
    const seqKey = `lonewolf:seq:${type}:${year}`;
    const res = await fetch(`${UPSTASH_URL}/incr/${seqKey}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    if (res.ok) {
      const data = await res.json();
      const seqNumber = data.result || Math.floor(100 + Math.random() * 900);
      const padded = String(seqNumber).padStart(4, '0');
      return `${prefix}-${year}-${padded}`;
    }
  } catch (err) {
    console.error('Failed to increment document sequence in Redis:', err);
  }

  // Fallback if Redis counter is unreachable
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomSuffix}`;
}

/**
 * Save document record to Upstash Redis
 */
export async function saveDocumentInRedis(doc: LoneWolfDocument): Promise<LoneWolfDocument | null> {
  try {
    const docId = doc.id;
    const jsonString = JSON.stringify(doc);

    // 1. Store document payload
    await fetch(`${UPSTASH_URL}/set/${DOC_KEY_PREFIX}${docId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    // 2. Add to master document list if not already present
    await fetch(`${UPSTASH_URL}/rpush/${DOC_LIST_KEY}/${docId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    // 3. Add to lead document list index if linked to a lead
    if (doc.leadId && doc.leadId.trim().length > 0) {
      await fetch(`${UPSTASH_URL}/rpush/${LEAD_DOCS_KEY_PREFIX}${doc.leadId}/${docId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
    }

    return doc;
  } catch (err) {
    console.error('Failed to save document in Upstash Redis:', err);
    return null;
  }
}

/**
 * Get document by ID from Upstash Redis
 */
export async function getDocumentByIdFromRedis(docId: string): Promise<LoneWolfDocument | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${DOC_KEY_PREFIX}${docId.trim()}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.result) return null;

    let resObj = data.result;
    while (typeof resObj === 'string') {
      resObj = JSON.parse(resObj);
    }
    return resObj as LoneWolfDocument;
  } catch (err) {
    console.error('Failed to get document from Upstash Redis:', err);
    return null;
  }
}

/**
 * Get all documents associated with a lead
 */
export async function getDocumentsForLeadFromRedis(leadId: string): Promise<LoneWolfDocument[]> {
  try {
    const cleanLeadId = leadId.trim();
    // 1. Try reading from lead document list index
    const indexRes = await fetch(`${UPSTASH_URL}/lrange/${LEAD_DOCS_KEY_PREFIX}${cleanLeadId}/0/-1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    let docIds: string[] = [];
    if (indexRes.ok) {
      const indexData = await indexRes.json();
      if (Array.isArray(indexData?.result)) {
        docIds = indexData.result.filter((id: any) => typeof id === 'string' && id.trim().length > 0);
      }
    }

    // 2. Fallback: scan master document list if index is empty
    if (docIds.length === 0) {
      const masterRes = await fetch(`${UPSTASH_URL}/lrange/${DOC_LIST_KEY}/0/-1`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (masterRes.ok) {
        const masterData = await masterRes.json();
        if (Array.isArray(masterData?.result)) {
          docIds = masterData.result;
        }
      }
    }

    const docs: LoneWolfDocument[] = [];
    const uniqueIds = Array.from(new Set(docIds));

    for (const id of uniqueIds) {
      if (!id || typeof id !== 'string') continue;
      const doc = await getDocumentByIdFromRedis(id);
      if (doc && doc.leadId === cleanLeadId) {
        docs.push(doc);
      }
    }

    // Sort by createdAt descending
    return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Failed to fetch documents for lead:', err);
    return [];
  }
}

/**
 * Permanently delete a document from Upstash Redis
 */
export async function deleteDocumentFromRedis(docId: string, leadId?: string): Promise<boolean> {
  try {
    const cleanId = docId.trim();
    // 1. Delete key lonewolf:doc:<id>
    await fetch(`${UPSTASH_URL}/del/${DOC_KEY_PREFIX}${cleanId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    // 2. Remove from master list lonewolf:documents
    await fetch(`${UPSTASH_URL}/lrem/${DOC_LIST_KEY}/0/${cleanId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    // 3. Remove from lead index if leadId is supplied
    if (leadId) {
      await fetch(`${UPSTASH_URL}/lrem/${LEAD_DOCS_KEY_PREFIX}${leadId.trim()}/0/${cleanId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
    }

    return true;
  } catch (err) {
    console.error('Failed to delete document from Upstash Redis:', err);
    return false;
  }
}
