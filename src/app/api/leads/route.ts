import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromRedis, updateLeadInRedis, deleteLeadFromRedis } from '@/lib/redis';
import { verifyAdminSession, verifyCsrfOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/leads
 * Authenticated Admin-only read of lead intake.
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leads = await getLeadsFromRedis(150);
    return NextResponse.json(
      { success: true, leads, total: leads.length },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * Authenticated Admin-only mutations (status update, delete, archive).
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
    if (!body || !body.leadId) {
      return NextResponse.json({ success: false, error: 'leadId is required' }, { status: 400 });
    }

    const { action, leadId, status, archived } = body;

    if (action === 'delete') {
      const deleted = await deleteLeadFromRedis(leadId);
      return NextResponse.json({ success: deleted, leadId });
    }

    if (action === 'update_status' && status) {
      const updated = await updateLeadInRedis(leadId, { status });
      return NextResponse.json({ success: !!updated, lead: updated });
    }

    if (action === 'archive') {
      const updated = await updateLeadInRedis(leadId, { archived: archived !== undefined ? archived : true });
      return NextResponse.json({ success: !!updated, lead: updated });
    }

    return NextResponse.json({ success: false, error: 'Unrecognized lead action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + err.message }, { status: 500 });
  }
}
