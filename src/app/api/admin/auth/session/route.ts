import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authenticated = verifyAdminSession(req);
  return NextResponse.json(
    { authenticated },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}