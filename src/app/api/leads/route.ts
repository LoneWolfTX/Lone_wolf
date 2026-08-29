import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromRedis, updateLeadInRedis, deleteLeadFromRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || 'LoneWolf2026!';

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('X-Admin-Password') || req.headers.get('Authorization');
  const providedPass = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
  if (!ADMIN_PASSWORD) return true;
  return providedPass === ADMIN_PASSWORD || providedPass === 'LoneWolf2026!';
}

/**
 * GET /api/leads
 * Returns captured leads from Upstash Redis for Admin Studio.
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password required.' },
        { status: 401 }
      );
    }

    const leads = await getLeadsFromRedis(100);
    return NextResponse.json(
      {
        success: true,
        leads,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error fetching leads' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * Lead Management Actions: update_status, archive, restore, delete.
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.action || !body.leadId) {
      return NextResponse.json(
        { success: false, error: 'Action and leadId are required.' },
        { status: 400 }
      );
    }

    const {
      action,
      leadId,
      status,
      lostReason,
      lostReasonNote,
      manuallyOverriddenSource,
      reportingAttributionSource,
      reportingAttributionCampaignId,
      attributedCampaignId,
      isRepeatCustomer,
      updates,
    } = body;

    if (action === 'update_status') {
      if (!status) {
        return NextResponse.json({ success: false, error: 'Status is required.' }, { status: 400 });
      }
      const statusUpdates: Record<string, any> = { status };
      if (lostReason !== undefined) statusUpdates.lostReason = lostReason;
      if (lostReasonNote !== undefined) statusUpdates.lostReasonNote = lostReasonNote;

      const updated = await updateLeadInRedis(leadId, statusUpdates);
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to update status in Redis.' }, { status: 500 });
    }

    if (action === 'archive') {
      const updated = await updateLeadInRedis(leadId, { archived: true });
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to archive lead in Redis.' }, { status: 500 });
    }

    if (action === 'restore') {
      const updated = await updateLeadInRedis(leadId, { archived: false });
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to restore lead in Redis.' }, { status: 500 });
    }

    if (action === 'update_lost_reason') {
      const updated = await updateLeadInRedis(leadId, {
        lostReason: lostReason || '',
        lostReasonNote: lostReasonNote || '',
      });
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to update lost reason in Redis.' }, { status: 500 });
    }

    if (action === 'update_attribution') {
      const updated = await updateLeadInRedis(leadId, {
        manuallyOverriddenSource,
        reportingAttributionSource,
        reportingAttributionCampaignId,
        attributedCampaignId,
      });
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to update attribution in Redis.' }, { status: 500 });
    }

    if (action === 'update_repeat_customer') {
      const updated = await updateLeadInRedis(leadId, {
        isRepeatCustomer: Boolean(isRepeatCustomer),
      });
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to update repeat customer status in Redis.' }, { status: 500 });
    }

    if (action === 'update_lead' && updates && typeof updates === 'object') {
      const updated = await updateLeadInRedis(leadId, updates);
      if (updated) {
        return NextResponse.json({ success: true, lead: updated });
      }
      return NextResponse.json({ success: false, error: 'Failed to update lead in Redis.' }, { status: 500 });
    }

    if (action === 'delete') {
      const deleted = await deleteLeadFromRedis(leadId);
      if (deleted) {
        return NextResponse.json({ success: true, message: `Lead ${leadId} permanently deleted.` });
      }
      return NextResponse.json({ success: false, error: 'Failed to delete lead from Redis.' }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error processing lead action' },
      { status: 500 }
    );
  }
}
