import { NextRequest, NextResponse } from 'next/server';
import { getLeadsFromRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || '';

/**
 * GET /api/leads
 * Returns captured leads from Upstash Redis for Admin Studio.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('X-Admin-Password') || req.headers.get('Authorization');
    const providedPass = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

    if (!providedPass || providedPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password required.' },
        { status: 401 }
      );
    }

    const leads = await getLeadsFromRedis(100);
    return NextResponse.json({
      success: true,
      leads,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error fetching leads' },
      { status: 500 }
    );
  }
}
