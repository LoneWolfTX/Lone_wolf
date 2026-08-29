/**
 * src/lib/redis.ts
 *
 * Upstash Redis Server Client (Vercel Production Architecture)
 * Single authoritative database for editable site content and lead intake.
 * Uses exact Vercel Upstash REST API environment variables.
 */

import { DEFAULT_SITE_CONTENT, SiteContent } from './contentStore';

export const UPSTASH_URL =
  process.env.UPSTASH_REDIS_LW_KV_REST_API_URL ||
  process.env.KV_REST_API_URL ||
  'https://glowing-rabbit-227227.upstash.io';

export const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_LW_KV_REST_API_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  'gQAAAAAAA3ebAAIgcDJlMzRjNDdlZjI1OWQ0NGE2OWYzMjQ3ODQzMzFlZDBmYg';

const CONTENT_KEY = 'lonewolf:site-content';
const LEADS_KEY_PREFIX = 'lonewolf:lead:';
const LEADS_LIST_KEY = 'lonewolf:leads';

/**
 * Read site content from Upstash Redis.
 * Bootstraps from DEFAULT_SITE_CONTENT if Redis is empty or uninitialized.
 */
export async function getSiteContentFromRedis(): Promise<SiteContent> {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${CONTENT_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        let parsed = data.result;
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            // Raw string
          }
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed = parsed[0];
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              // Raw string
            }
          }
        }
        if (parsed && typeof parsed === 'object' && (parsed.homepage || parsed.business)) {
          return {
            ...DEFAULT_SITE_CONTENT,
            ...parsed,
            business: { ...DEFAULT_SITE_CONTENT.business, ...(parsed.business || {}) },
            contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
            pricing: { ...DEFAULT_SITE_CONTENT.pricing, ...(parsed.pricing || {}) },
            dimensions: { ...DEFAULT_SITE_CONTENT.dimensions, ...(parsed.dimensions || {}) },
            rentalPeriods: { ...DEFAULT_SITE_CONTENT.rentalPeriods, ...(parsed.rentalPeriods || {}) },
            dumpsterEntities: Array.isArray(parsed.dumpsterEntities) ? parsed.dumpsterEntities : DEFAULT_SITE_CONTENT.dumpsterEntities,
            dumpsterPages: Array.isArray(parsed.dumpsterPages) ? parsed.dumpsterPages : DEFAULT_SITE_CONTENT.dumpsterPages,
            faqs: Array.isArray(parsed.faqs) ? parsed.faqs : DEFAULT_SITE_CONTENT.faqs,
          };
        }
      }
    }
  } catch (err) {
    console.error('Failed to load content from Upstash Redis:', err);
  }

  return DEFAULT_SITE_CONTENT;
}

/**
 * Write site content to Upstash Redis (Server-only write).
 */
export async function setSiteContentInRedis(content: SiteContent): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(content);
    const res = await fetch(`${UPSTASH_URL}/set/${CONTENT_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([jsonString]),
    });

    if (res.ok) {
      const data = await res.json();
      return data && (data.result === 'OK' || data.result === 'OK');
    }
  } catch (err) {
    console.error('Failed to write content to Upstash Redis:', err);
  }

  return false;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  deliveryAddress: string;
  service: string;
  projectType: string;
  preferredDate?: string;
  rentalDuration?: string;
  status?: string;
  archived?: boolean;
  updatedAt?: string;
  notes?: string;
  createdAt: string;
  emailNotified?: boolean;
  smsNotified?: boolean;

  // Attribution & Acquisition Fields
  leadMethod?: 'Website Form' | 'Phone' | 'Manual' | 'Other';
  firstTouchSource?: string;
  firstTouchMedium?: string;
  firstTouchCampaign?: string;
  firstTouchContent?: string;
  firstTouchTerm?: string;
  firstTouchLandingPage?: string;
  firstTouchReferrer?: string;
  firstTouchGclid?: string;
  firstTouchFbclid?: string;
  firstTouchAt?: string;

  lastTouchSource?: string;
  lastTouchMedium?: string;
  lastTouchCampaign?: string;
  lastTouchContent?: string;
  lastTouchTerm?: string;
  lastTouchLandingPage?: string;
  lastTouchReferrer?: string;
  lastTouchGclid?: string;
  lastTouchFbclid?: string;
  lastTouchAt?: string;

  normalizedSource?: string;
  reportingAttributionSource?: string;
  reportingAttributionCampaignId?: string;
  attributedCampaignId?: string;
  manuallyOverriddenSource?: string;
  overrideTimestamp?: string;
  isRepeatCustomer?: boolean;
  possibleRepeatCustomer?: boolean;
  lostReason?: string;
  lostReasonNote?: string;
}

/**
 * Save incoming lead to Upstash Redis so leads NEVER disappear.
 */
export async function saveLeadInRedis(lead: Omit<LeadSubmission, 'id' | 'createdAt'>): Promise<LeadSubmission | null> {
  try {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullLead: LeadSubmission = {
      ...lead,
      id,
      createdAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(fullLead);

    // Save lead details
    await fetch(`${UPSTASH_URL}/set/${LEADS_KEY_PREFIX}${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    // Add lead ID to master list
    await fetch(`${UPSTASH_URL}/lpush/${LEADS_LIST_KEY}/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });

    return fullLead;
  } catch (err) {
    console.error('Failed to save lead in Upstash Redis:', err);
    return null;
  }
}

/**
 * Retrieve leads from Upstash Redis.
 */
export async function getLeadsFromRedis(limit: number = 50): Promise<LeadSubmission[]> {
  try {
    const listRes = await fetch(`${UPSTASH_URL}/lrange/${LEADS_LIST_KEY}/0/${limit - 1}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    if (!listRes.ok) return [];
    const listData = await listRes.json();
    let leadIds: string[] = listData?.result || [];

    // Parse array strings if nested
    leadIds = leadIds.map((item) => {
      if (typeof item === 'string' && item.startsWith('[')) {
        try {
          const arr = JSON.parse(item);
          return Array.isArray(arr) ? arr[0] : item;
        } catch {
          return item;
        }
      }
      return item;
    });

    const leads: LeadSubmission[] = [];
    for (const id of leadIds) {
      if (!id || typeof id !== 'string') continue;
      const cleanId = id.trim();
      const itemRes = await fetch(`${UPSTASH_URL}/get/${LEADS_KEY_PREFIX}${cleanId}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (itemRes.ok) {
        const itemData = await itemRes.json();
        if (itemData?.result) {
          try {
            let resObj = itemData.result;
            while (typeof resObj === 'string') {
              resObj = JSON.parse(resObj);
            }
            if (resObj && typeof resObj === 'object' && resObj.name) {
              leads.push({
                status: 'New',
                archived: false,
                ...resObj,
              } as LeadSubmission);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
    return leads;
  } catch (err) {
    console.error('Failed to fetch leads from Upstash Redis:', err);
    return [];
  }
}

/**
 * Update an existing lead in Upstash Redis (status, archived, etc.)
 */
export async function updateLeadInRedis(
  id: string,
  updates: Partial<LeadSubmission>
): Promise<LeadSubmission | null> {
  try {
    const cleanId = id.trim();
    const itemRes = await fetch(`${UPSTASH_URL}/get/${LEADS_KEY_PREFIX}${cleanId}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    if (!itemRes.ok) return null;
    const itemData = await itemRes.json();
    if (!itemData?.result) return null;

    let existingLead: any = itemData.result;
    while (typeof existingLead === 'string') {
      existingLead = JSON.parse(existingLead);
    }

    const updatedLead: LeadSubmission = {
      status: 'New',
      archived: false,
      ...existingLead,
      ...updates,
      id: cleanId,
      updatedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(updatedLead);

    await fetch(`${UPSTASH_URL}/set/${LEADS_KEY_PREFIX}${cleanId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    return updatedLead;
  } catch (err) {
    console.error('Failed to update lead in Upstash Redis:', err);
    return null;
  }
}

/**
 * Permanently delete a lead from Upstash Redis (Key + Master List).
 */
export async function deleteLeadFromRedis(id: string): Promise<boolean> {
  try {
    const cleanId = id.trim();

    // 1. Delete key lonewolf:lead:<id>
    await fetch(`${UPSTASH_URL}/del/${LEADS_KEY_PREFIX}${cleanId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    // 2. Remove id from master list lonewolf:leads
    await fetch(`${UPSTASH_URL}/lrem/${LEADS_LIST_KEY}/0/${cleanId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    // 3. Remove nested array string ["id"] if present in legacy list
    await fetch(`${UPSTASH_URL}/lrem/${LEADS_LIST_KEY}/0/["${cleanId}"]`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });

    return true;
  } catch (err) {
    console.error('Failed to delete lead from Upstash Redis:', err);
    return false;
  }
}
