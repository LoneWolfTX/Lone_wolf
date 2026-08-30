import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, verifyCsrfOrigin } from '@/lib/auth';
import { getCampaignsFromRedis, saveCampaignInRedis, deleteCampaignFromRedis } from '@/lib/marketing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const campaigns = await getCampaignsFromRedis();
    return NextResponse.json({ success: true, campaigns });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    const { action, campaign, campaignId } = body || {};

    if (action === 'delete' && campaignId) {
      const deleted = await deleteCampaignFromRedis(campaignId);
      return NextResponse.json({ success: deleted });
    }

    if (campaign && campaign.name) {
      const id = campaign.id || ('cmp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
      const fullCampaign = {
        ...campaign,
        id,
        createdAt: campaign.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const saved = await saveCampaignInRedis(fullCampaign);
      return NextResponse.json({ success: true, campaign: saved });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
