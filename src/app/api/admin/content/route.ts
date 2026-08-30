import { NextRequest, NextResponse } from 'next/server';
import { getSiteContentFromRedis, setSiteContentInRedis } from '@/lib/redis';
import { verifyAdminSession, verifyCsrfOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/content
 * Authenticated Admin read of site content.
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const content = await getSiteContentFromRedis();
    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch content from Redis', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Authenticated Admin update of site content.
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
  }

  try {
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== 'object' || (!payload.homepage && !payload.business)) {
      return NextResponse.json({ success: false, error: 'Invalid content payload' }, { status: 400 });
    }

    const success = await setSiteContentInRedis(payload);
    if (success) {
      return NextResponse.json({ success: true, message: 'Content saved to Redis successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to write content to Redis' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + err.message }, { status: 500 });
  }
}
