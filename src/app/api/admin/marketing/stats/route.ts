import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getLeadsFromRedis } from '@/lib/redis';
import { getCampaignsFromRedis, getSpendEntriesFromRedis } from '@/lib/marketing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leads = await getLeadsFromRedis(100);
    const campaigns = await getCampaignsFromRedis();
    const spendEntries = await getSpendEntriesFromRedis();

    const totalSpend = spendEntries.reduce((sum, s) => sum + s.amount, 0);
    const totalLeads = leads.length;
    const bookedLeads = leads.filter((l) => l.status === 'Booked' || l.status === 'Completed').length;

    const stats = {
      totalSpend,
      totalLeads,
      bookedLeads,
      cpl: totalLeads > 0 ? totalSpend / totalLeads : 0,
      cac: bookedLeads > 0 ? totalSpend / bookedLeads : 0,
      campaigns,
    };

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
