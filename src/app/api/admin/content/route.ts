import { NextRequest, NextResponse } from 'next/server';
import { getSiteContentFromRedis, setSiteContentInRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || 'LoneWolf2026!';

/**
 * GET /api/admin/content
 * Returns authoritative published site content from Upstash Redis.
 */
export async function GET() {
  try {
    const content = await getSiteContentFromRedis();
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch content from Upstash Redis', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Server-authenticated update of site content into Upstash Redis.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Password Security Authorization Check
    const authHeader = req.headers.get('X-Admin-Password') || req.headers.get('Authorization');
    const providedPass = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

    if (!providedPass || providedPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password header required.' },
        { status: 401 }
      );
    }

    // 2. Read and Validate Payload
    const payload = await req.json().catch(() => null);

    if (!payload || typeof payload !== 'object' || (!payload.homepage && !payload.business)) {
      return NextResponse.json(
        { success: false, error: 'Invalid site content JSON payload received.' },
        { status: 400 }
      );
    }

    // 3. Write payload to Upstash Redis
    const success = await setSiteContentInRedis(payload);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Site content successfully saved and published to Vercel + Upstash Redis.',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Upstash Redis write failed. Content was NOT published.' },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error saving content to Upstash Redis.' },
      { status: 500 }
    );
  }
}
