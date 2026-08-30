import { getRedisConfig, requireRedisConfig, redisPipeline } from './redis';

export type SpendSource = 'Manual' | 'GoogleAds' | 'Meta' | 'Other';

export interface MarketingCampaign {
  id: string; // e.g. cmp_google_dumpster_core_2026_01
  name: string; // e.g. "Google — DFW 20 Yard — Fall 2026"
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
  const cfg = getRedisConfig();
  if (!cfg) return getFallbackCampaigns();

  try {
    const listRes = await fetch(`${cfg.url}/lrange/${CAMPAIGNS_LIST_KEY}/0/-1`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: 'no-store',
    });

    if (!listRes.ok) return getFallbackCampaigns();
    const listData = await listRes.json();
    const ids: string[] = Array.isArray(listData?.result) ? listData.result : [];

    if (ids.length === 0) return getFallbackCampaigns();

    const mgetCommands = ids.map((id) => ['GET', `${CAMPAIGNS_KEY_PREFIX}${id}`]);
    const results = await redisPipeline(mgetCommands);

    const campaigns: MarketingCampaign[] = [];
    for (const item of results) {
      if (item?.result) {
        try {
          const parsed = typeof item.result === 'string' ? JSON.parse(item.result) : item.result;
          if (parsed && parsed.id) campaigns.push(parsed);
        } catch {
          // Ignore
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
 * Save or update a campaign in Redis atomically
 */
export async function saveCampaignInRedis(campaign: MarketingCampaign): Promise<MarketingCampaign> {
  const cfg = requireRedisConfig();
  const jsonString = JSON.stringify(campaign);

  await redisPipeline([
    ['SET', `${CAMPAIGNS_KEY_PREFIX}${campaign.id}`, jsonString],
    ['LPUSH', CAMPAIGNS_LIST_KEY, campaign.id],
  ]);

  return campaign;
}

/**
 * Delete a campaign from Redis
 */
export async function deleteCampaignFromRedis(id: string): Promise<boolean> {
  try {
    await redisPipeline([
      ['DEL', `${CAMPAIGNS_KEY_PREFIX}${id}`],
      ['LREM', CAMPAIGNS_LIST_KEY, '0', id],
    ]);
    return true;
  } catch (err) {
    console.error('Failed to delete campaign from Redis:', err);
    return false;
  }
}

/**
 * Fetch all spend entries from Redis
 */
export async function getSpendEntriesFromRedis(): Promise<MarketingSpendEntry[]> {
  const cfg = getRedisConfig();
  if (!cfg) return [];

  try {
    const listRes = await fetch(`${cfg.url}/lrange/${SPEND_LIST_KEY}/0/-1`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: 'no-store',
    });

    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const ids: string[] = Array.isArray(listData?.result) ? listData.result : [];

    if (ids.length === 0) return [];

    const mgetCommands = ids.map((id) => ['GET', `${SPEND_KEY_PREFIX}${id}`]);
    const results = await redisPipeline(mgetCommands);

    const entries: MarketingSpendEntry[] = [];
    for (const item of results) {
      if (item?.result) {
        try {
          const parsed = typeof item.result === 'string' ? JSON.parse(item.result) : item.result;
          if (parsed && parsed.id) entries.push(parsed);
        } catch {
          // Ignore
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
 * Save spend entry to Redis atomically
 */
export async function saveSpendEntryInRedis(entry: MarketingSpendEntry): Promise<MarketingSpendEntry> {
  const cfg = requireRedisConfig();
  const jsonString = JSON.stringify(entry);

  await redisPipeline([
    ['SET', `${SPEND_KEY_PREFIX}${entry.id}`, jsonString],
    ['LPUSH', SPEND_LIST_KEY, entry.id],
  ]);

  return entry;
}

/**
 * Fallback predefined campaigns
 */
export function getFallbackCampaigns(): MarketingCampaign[] {
  return [
    {
      id: 'cmp_google_dfw_search_core',
      name: 'Google Ads — DFW Core Dumpster Search',
      platform: 'Google Ads',
      utmCampaign: 'dfw_search_core',
      utmSource: 'google',
      utmMedium: 'cpc',
      active: true,
      spendSource: 'Manual',
      notes: 'Primary high-intent exact match campaign in Tarrant, Dallas, and Denton Counties',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'cmp_meta_residential_cleanout',
      name: 'Meta Ads — Residential Cleanouts & Remodels',
      platform: 'Facebook Ads',
      utmCampaign: 'dfw_residential_cleanout',
      utmSource: 'facebook',
      utmMedium: 'paid_social',
      active: true,
      spendSource: 'Manual',
      notes: 'Targeting homeowners in DFW Metroplex',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];
}
