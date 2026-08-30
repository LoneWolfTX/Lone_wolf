import { NextResponse } from 'next/server';
import { getSiteContentFromRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

/**
 * GET /api/content
 * Public, read-only, sanitized site content endpoint.
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
      { error: 'Failed to fetch content', details: err.message },
      { status: 500 }
    );
  }
}
