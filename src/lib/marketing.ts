import { UPSTASH_URL, UPSTASH_TOKEN } from './redis';

export type SpendSource = 'Manual' | 'GoogleAds' | 'Meta' | 'Other';

export interface MarketingCampaign {
  id: string; // e.g. cmp_google_dumpster_core_2026_01
  name: string; // e.g. "Google — Houston 20 Yard — Fall 2026"
  platform: string; // e.g. "Google Ads", "Facebook Ads", "Craigslist"
  utmCampaign: string; // e.g. "dfw_20yard"
  utmSource?: string;
  utmMedium?: string;
  googleCampaignId?: string;
  metaCampaignId?: string;
  active: boolean;
  spendSource: SpendSource;
  notes?: string;
  targetCity?: string;
  targetService?: string;
  createdAt: string;
  updatedAt: string;

  // Computed / Analytics fields
  spend?: number;
  leads?: number;
  bookings?: number;
  cpl?: number;
  cac?: number;
  revenue?: number;
  roas?: number;
}

export interface MarketingSpendEntry {
  id: string;
  campaignId: string;
  amount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}

const CAMPAIGNS_KEY_PREFIX = 'lonewolf:campaign:';
const CAMPAIGNS_LIST_KEY = 'lonewolf:campaigns';
const SPEND_KEY_PREFIX = 'lonewolf:spend:';
const SPEND_LIST_KEY = 'lonewolf:spend_entries';

/**
 * Fetch all marketing campaigns from Upstash Redis
 */
export async function getCampaignsFromRedis(): Promise<MarketingCampaign[]> {
  try {
    const listRes = await fetch(`${UPSTASH_URL}/lrange/${CAMPAIGNS_LIST_KEY}/0/-1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    if (!listRes.ok) return getFallbackCampaigns();
    const listData = await listRes.json();
    const ids: string[] = Array.isArray(listData?.result) ? listData.result : [];

    if (ids.length === 0) return getFallbackCampaigns();

    const campaigns: MarketingCampaign[] = [];
    for (const id of ids) {
      const itemRes = await fetch(`${UPSTASH_URL}/get/${CAMPAIGNS_KEY_PREFIX}${id}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (itemRes.ok) {
        const data = await itemRes.json();
        if (data?.result) {
          try {
            const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            if (parsed && parsed.id) campaigns.push(parsed);
          } catch {
            // Ignore parse error
          }
        }
      }
    }
    return campaigns.length > 0 ? campaigns : getFallbackCampaigns();
  } catch (err) {
    console.error('Failed to get campaigns from Redis:', err);
    return getFallbackCampaigns();
  }
}

/**
 * Save marketing campaign in Upstash Redis
 */
export async function saveCampaignInRedis(campaign: MarketingCampaign): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(campaign);
    await fetch(`${UPSTASH_URL}/set/${CAMPAIGNS_KEY_PREFIX}${campaign.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    await fetch(`${UPSTASH_URL}/lpush/${CAMPAIGNS_LIST_KEY}/${campaign.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    return true;
  } catch (err) {
    console.error('Failed to save campaign in Redis:', err);
    return false;
  }
}

/**
 * Delete marketing campaign from Upstash Redis
 */
export async function deleteCampaignFromRedis(id: string): Promise<boolean> {
  try {
    await fetch(`${UPSTASH_URL}/del/${CAMPAIGNS_KEY_PREFIX}${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    await fetch(`${UPSTASH_URL}/lrem/${CAMPAIGNS_LIST_KEY}/0/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    return true;
  } catch (err) {
    console.error('Failed to delete campaign from Redis:', err);
    return false;
  }
}

/**
 * Fetch spend entries from Upstash Redis
 */
export async function getSpendEntriesFromRedis(): Promise<MarketingSpendEntry[]> {
  try {
    const listRes = await fetch(`${UPSTASH_URL}/lrange/${SPEND_LIST_KEY}/0/-1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });

    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const ids: string[] = Array.isArray(listData?.result) ? listData.result : [];

    const entries: MarketingSpendEntry[] = [];
    for (const id of ids) {
      const itemRes = await fetch(`${UPSTASH_URL}/get/${SPEND_KEY_PREFIX}${id}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (itemRes.ok) {
        const data = await itemRes.json();
        if (data?.result) {
          try {
            const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            if (parsed && parsed.id) entries.push(parsed);
          } catch {
            // Ignore parse error
          }
        }
      }
    }
    return entries;
  } catch (err) {
    console.error('Failed to get spend entries from Redis:', err);
    return [];
  }
}

/**
 * Save spend entry in Upstash Redis
 */
export async function saveSpendEntryInRedis(entry: MarketingSpendEntry): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(entry);
    await fetch(`${UPSTASH_URL}/set/${SPEND_KEY_PREFIX}${entry.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: jsonString,
    });

    await fetch(`${UPSTASH_URL}/lpush/${SPEND_LIST_KEY}/${entry.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    return true;
  } catch (err) {
    console.error('Failed to save spend entry in Redis:', err);
    return false;
  }
}

function getFallbackCampaigns(): MarketingCampaign[] {
  return [
    {
      id: 'cmp_google_20yard_2026',
      name: 'Google Ads — DFW 20 Yard Dumpster',
      platform: 'Google Ads',
      utmCampaign: 'dfw_20yard',
      utmSource: 'google',
      utmMedium: 'cpc',
      active: true,
      spendSource: 'Manual',
      notes: 'Primary paid search campaign for 20-yard dumpster rentals in DFW',
      targetCity: 'Fort Worth',
      targetService: '20 Yard Dumpster',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cmp_meta_fall_cleanup_2026',
      name: 'Facebook Ads — Fall Property Cleanup',
      platform: 'Facebook Ads',
      utmCampaign: 'fall_cleanup',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      active: true,
      spendSource: 'Manual',
      notes: 'Social campaign targeting homeowners doing renovation & yard cleanups',
      targetCity: 'Arlington',
      targetService: '15 Yard Dumpster',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
