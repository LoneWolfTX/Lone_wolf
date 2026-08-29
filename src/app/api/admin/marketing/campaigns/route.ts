import { NextRequest, NextResponse } from 'next/server';
import {
  getCampaignsFromRedis,
  saveCampaignInRedis,
  deleteCampaignFromRedis,
  getSpendEntriesFromRedis,
  saveSpendEntryInRedis,
  MarketingCampaign,
  MarketingSpendEntry,
} from '@/lib/marketing';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest): boolean {
  const pwd = req.headers.get('X-Admin-Password');
  const validPwd = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || 'LoneWolf2026!';
  return pwd === validPwd;
}

/**
 * GET /api/admin/marketing/campaigns
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await getCampaignsFromRedis();
    const spendEntries = await getSpendEntriesFromRedis();

    return NextResponse.json({
      success: true,
      campaigns,
      spendEntries,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/marketing/campaigns
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.action) {
      return NextResponse.json({ success: false, error: 'action parameter required' }, { status: 400 });
    }

    const { action } = body;

    if (action === 'save_campaign') {
      const { campaign } = body;
      if (!campaign || !campaign.name) {
        return NextResponse.json({ success: false, error: 'Campaign name required' }, { status: 400 });
      }

      const id = campaign.id || `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const fullCampaign: MarketingCampaign = {
        id,
        name: campaign.name,
        platform: campaign.platform || 'Google Ads',
        utmCampaign: campaign.utmCampaign || campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        googleCampaignId: campaign.googleCampaignId,
        metaCampaignId: campaign.metaCampaignId,
        active: campaign.active !== false,
        spendSource: campaign.spendSource || 'Manual',
        notes: campaign.notes || '',
        targetCity: campaign.targetCity || '',
        targetService: campaign.targetService || '',
        createdAt: campaign.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveCampaignInRedis(fullCampaign);
      return NextResponse.json({ success: true, campaign: fullCampaign });
    }

    if (action === 'delete_campaign') {
      const { id } = body;
      if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
      await deleteCampaignFromRedis(id);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_spend_entry') {
      const { spendEntry } = body;
      if (!spendEntry || !spendEntry.campaignId || !spendEntry.amount || !spendEntry.startDate || !spendEntry.endDate) {
        return NextResponse.json({ success: false, error: 'campaignId, amount, startDate, and endDate required' }, { status: 400 });
      }

      const id = spendEntry.id || `spd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const fullEntry: MarketingSpendEntry = {
        id,
        campaignId: spendEntry.campaignId,
        amount: Number(spendEntry.amount) || 0,
        startDate: spendEntry.startDate,
        endDate: spendEntry.endDate,
        note: spendEntry.note || '',
        createdAt: spendEntry.createdAt || new Date().toISOString(),
      };

      await saveSpendEntryInRedis(fullEntry);
      return NextResponse.json({ success: true, spendEntry: fullEntry });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
