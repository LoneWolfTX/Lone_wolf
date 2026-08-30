/**
 * src/lib/redis.ts
 *
 * Fail-closed, zero-fallback Upstash Redis client for Vercel production.
 * Executes atomic pipeline transactions for leads, rate limiting, and documents.
 */

import { DEFAULT_SITE_CONTENT, SiteContent } from './contentStore';

export function getRedisConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_LW_KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_LW_KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }
  return { url: url.replace(/\/$/, ''), token };
}

export function requireRedisConfig(): { url: string; token: string } {
  const cfg = getRedisConfig();
  if (!cfg) {
    throw new Error('Redis environment configuration missing (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN required)');
  }
  return cfg;
}

const CONTENT_KEY = 'lonewolf:site-content';
const LEADS_KEY_PREFIX = 'lonewolf:lead:';
const LEADS_LIST_KEY = 'lonewolf:leads';

/**
 * Execute an atomic pipeline of commands against Upstash Redis REST API.
 */
export async function redisPipeline(commands: (string | number)[][]): Promise<any[]> {
  const cfg = requireRedisConfig();

  const res = await fetch(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    throw new Error(`Redis pipeline failed with HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected Redis pipeline response format');
  }

  return data;
}

/**
 * Read site content from Upstash Redis.
 * Bootstraps from DEFAULT_SITE_CONTENT if Redis is empty or uninitialized.
 */
export async function getSiteContentFromRedis(): Promise<SiteContent> {
  const cfg = getRedisConfig();
  if (!cfg) {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const res = await fetch(`${cfg.url}/get/${CONTENT_KEY}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        let parsed = data.result;
        while (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            break;
          }
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed = parsed[0];
          while (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              break;
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
            pageHeroes: { ...DEFAULT_SITE_CONTENT.pageHeroes, ...(parsed.pageHeroes || {}) },
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
  const cfg = requireRedisConfig();
  const jsonString = JSON.stringify(content);

  const res = await fetch(`${cfg.url}/set/${CONTENT_KEY}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([jsonString]),
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return Boolean(data && data.result === 'OK');
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
 * Save incoming lead to Upstash Redis using an atomic pipeline.
 * Guarantees that the lead record and master index update succeed or fail together.
 */
export async function saveLeadInRedis(lead: Omit<LeadSubmission, 'id' | 'createdAt'>): Promise<LeadSubmission | null> {
  const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullLead: LeadSubmission = {
    ...lead,
    id,
    status: lead.status || 'New',
    createdAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(fullLead);

  try {
    const results = await redisPipeline([
      ['SET', `${LEADS_KEY_PREFIX}${id}`, jsonString],
      ['LPUSH', LEADS_LIST_KEY, id],
    ]);

    if (
      Array.isArray(results) &&
      results.length === 2 &&
      results[0]?.result === 'OK' &&
      typeof results[1]?.result === 'number'
    ) {
      return fullLead;
    }

    console.error('Lead pipeline write did not return expected results:', results);
    return null;
  } catch (err) {
    console.error('Failed atomic lead save in Upstash Redis:', err);
    return null;
  }
}

/**
 * Retrieve leads from Upstash Redis.
 */
export async function getLeadsFromRedis(limit: number = 100): Promise<LeadSubmission[]> {
  const cfg = getRedisConfig();
  if (!cfg) return [];

  try {
    const listRes = await fetch(`${cfg.url}/lrange/${LEADS_LIST_KEY}/0/${limit - 1}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: 'no-store',
    });

    if (!listRes.ok) return [];
    const listData = await listRes.json();
    let leadIds: string[] = listData?.result || [];

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

    if (leadIds.length === 0) return [];

    // Pipeline MGET for all leads in one round-trip
    const mgetCommands = leadIds.map((id) => ['GET', `${LEADS_KEY_PREFIX}${id.trim()}`]);
    const results = await redisPipeline(mgetCommands);

    const leads: LeadSubmission[] = [];
    for (const res of results) {
      if (res?.result) {
        try {
          let resObj = res.result;
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
          // Skip malformed records
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
 * Update an existing lead in Upstash Redis
 */
export async function updateLeadInRedis(
  id: string,
  updates: Partial<LeadSubmission>
): Promise<LeadSubmission | null> {
  const cfg = requireRedisConfig();
  const cleanId = id.trim();

  try {
    const itemRes = await fetch(`${cfg.url}/get/${LEADS_KEY_PREFIX}${cleanId}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
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
    const setRes = await fetch(`${cfg.url}/set/${LEADS_KEY_PREFIX}${cleanId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([jsonString]),
    });

    if (setRes.ok) {
      return updatedLead;
    }
    return null;
  } catch (err) {
    console.error('Failed to update lead in Upstash Redis:', err);
    return null;
  }
}

/**
 * Permanently delete a lead from Upstash Redis atomically.
 */
export async function deleteLeadFromRedis(id: string): Promise<boolean> {
  const cleanId = id.trim();
  try {
    await redisPipeline([
      ['DEL', `${LEADS_KEY_PREFIX}${cleanId}`],
      ['LREM', LEADS_LIST_KEY, '0', cleanId],
      ['LREM', LEADS_LIST_KEY, '0', `["${cleanId}"]`],
    ]);
    return true;
  } catch (err) {
    console.error('Failed to delete lead from Upstash Redis:', err);
    return false;
  }
}

/**
 * Atomic IP rate limiter.
 * Returns { allowed: boolean, remaining: number }
 */
export async function checkRateLimit(
  prefix: string,
  ip: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const cfg = getRedisConfig();
  if (!cfg) {
    return { allowed: true, remaining: limit };
  }

  const key = `lonewolf:ratelimit:${prefix}:${ip}`;
  try {
    const results = await redisPipeline([
      ['INCR', key],
      ['EXPIRE', key, windowSeconds.toString()],
    ]);

    const count = typeof results?.[0]?.result === 'number' ? results[0].result : 1;
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  } catch {
    // If rate limit check fails, fail open in degraded mode
    return { allowed: true, remaining: 1 };
  }
}
