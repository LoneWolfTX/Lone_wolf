import { getRedisConfig, requireRedisConfig, redisPipeline, redisTransaction } from './redis';

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
  type: DocumentType;
  number: string;
  leadId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  dumpsterSize: string;
  projectType?: string;
  deliveryDate?: string;
  rentalDuration?: string;
  includedWeight?: string;
  extraWeightRate?: string;
  extraDayRate?: string;
  lineItems: DocumentLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  quoteStatus?: QuoteStatus;
  invoiceStatus?: InvoiceStatus;
  issuedDate: string;
  dueDate?: string;
  acceptedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  payments: PaymentRecord[];
  balanceDue: number;
  totalPaid?: number;
  status?: string;
  rentalPeriod?: string;
  tonnageAllowance?: string;
  maxWeightLanguage?: string;
  specialInstructions?: string;
  paymentTerms?: string;
  discountAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  date?: string;
  docNumber?: string;
  notes?: string;
  terms?: string;
  convertedToInvoiceId?: string;
  originalQuoteId?: string;
  [key: string]: any;
}

const DOC_KEY_PREFIX = 'lonewolf:doc:';
const DOC_LIST_KEY = 'lonewolf:documents';
const LEAD_DOCS_KEY_PREFIX = 'lonewolf:lead:docs:';

export async function generateAtomicDocumentNumber(type: DocumentType): Promise<string> {
  const prefixMap: Record<DocumentType, string> = {
    QUOTE: 'Q',
    INVOICE: 'INV',
    RECEIPT: 'REC',
  };
  const prefix = prefixMap[type];
  const year = new Date().getFullYear();
  const cfg = getRedisConfig();

  if (cfg) {
    try {
      const seqKey = 'lonewolf:seq:' + type + ':' + year;
      const res = await fetch(cfg.url + '/incr/' + seqKey, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + cfg.token },
      });

      if (res.ok) {
        const data = await res.json();
        const seqNumber = data.result || Math.floor(100 + Math.random() * 900);
        const padded = String(seqNumber).padStart(4, '0');
        return prefix + '-' + year + '-' + padded;
      }
    } catch (err) {
      console.error('Failed to increment document sequence in Redis:', err);
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return prefix + '-' + year + '-' + randomSuffix;
}

export async function saveDocumentInRedis(doc: LoneWolfDocument): Promise<LoneWolfDocument | null> {
  try {
    const docId = doc.id;
    const jsonString = JSON.stringify(doc);

    const commands: (string | number)[][] = [
      ['SET', DOC_KEY_PREFIX + docId, jsonString],
      ['RPUSH', DOC_LIST_KEY, docId],
    ];

    if (doc.leadId && doc.leadId.trim().length > 0) {
      commands.push(['RPUSH', LEAD_DOCS_KEY_PREFIX + doc.leadId.trim(), docId]);
    }

    await redisTransaction(commands);
    return doc;
  } catch (err) {
    console.error('Failed to save document in Upstash Redis transaction:', err);
    return null;
  }
}

export async function getDocumentByIdFromRedis(docId: string): Promise<LoneWolfDocument | null> {
  const cfg = getRedisConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(cfg.url + '/get/' + DOC_KEY_PREFIX + docId.trim(), {
      headers: { Authorization: 'Bearer ' + cfg.token },
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

export async function getDocumentsForLeadFromRedis(leadId: string): Promise<LoneWolfDocument[]> {
  const cfg = getRedisConfig();
  if (!cfg) return [];

  try {
    const cleanLeadId = leadId.trim();
    const indexRes = await fetch(cfg.url + '/lrange/' + LEAD_DOCS_KEY_PREFIX + cleanLeadId + '/0/-1', {
      headers: { Authorization: 'Bearer ' + cfg.token },
      cache: 'no-store',
    });

    let docIds: string[] = [];
    if (indexRes.ok) {
      const indexData = await indexRes.json();
      if (Array.isArray(indexData?.result)) {
        docIds = indexData.result.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0);
      }
    }

    if (docIds.length === 0) {
      const masterRes = await fetch(cfg.url + '/lrange/' + DOC_LIST_KEY + '/0/-1', {
        headers: { Authorization: 'Bearer ' + cfg.token },
        cache: 'no-store',
      });
      if (masterRes.ok) {
        const masterData = await masterRes.json();
        if (Array.isArray(masterData?.result)) {
          docIds = masterData.result.filter((id: unknown): id is string => typeof id === 'string');
        }
      }
    }

    const uniqueIds = Array.from(new Set(docIds));
    if (uniqueIds.length === 0) return [];

    const mgetCommands = uniqueIds.map((id: string) => ['GET', DOC_KEY_PREFIX + id.trim()]);
    const results = await redisPipeline(mgetCommands);

    const docs: LoneWolfDocument[] = [];
    for (const item of results) {
      if (item?.result) {
        try {
          let resObj = item.result;
          while (typeof resObj === 'string') {
            resObj = JSON.parse(resObj);
          }
          if (resObj && (resObj.leadId === cleanLeadId || !resObj.leadId)) {
            docs.push(resObj as LoneWolfDocument);
          }
        } catch {
          // Skip invalid
        }
      }
    }

    return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Failed to fetch documents for lead:', err);
    return [];
  }
}

export async function deleteDocumentFromRedis(docId: string, leadId?: string): Promise<boolean> {
  try {
    const cleanId = docId.trim();
    let effectiveLeadId = leadId;

    if (!effectiveLeadId) {
      const existing = await getDocumentByIdFromRedis(cleanId);
      if (existing?.leadId) {
        effectiveLeadId = existing.leadId;
      }
    }

    const commands: (string | number)[][] = [
      ['DEL', DOC_KEY_PREFIX + cleanId],
      ['LREM', DOC_LIST_KEY, '0', cleanId],
    ];

    if (effectiveLeadId) {
      commands.push(['LREM', LEAD_DOCS_KEY_PREFIX + effectiveLeadId.trim(), '0', cleanId]);
    }

    await redisTransaction(commands);
    return true;
  } catch (err) {
    console.error('Failed to delete document from Upstash Redis transaction:', err);
    return false;
  }
}