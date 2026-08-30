import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createSessionToken, ADMIN_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';
import { checkRateLimit } from '@/lib/redis';

export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  if (process.env.NODE_ENV === 'test' || process.env.ENABLE_TEST_OVERRIDE === 'true') {
    const testIp = req.headers.get('x-test-ip');
    if (testIp) return testIp.trim();
  }
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown-ip';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    const body = await req.json().catch(() => null);
    const password = body?.password;

    if (!password || typeof password !== 'string' || !verifyAdminPassword(password)) {
      const rate = await checkRateLimit('failed_login_attempts', ip, 5, 15 * 60);
      if (!rate.allowed) {
        return NextResponse.json(
          { success: false, error: 'Too many failed login attempts. Please wait 15 minutes before trying again.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const isProd = process.env.NODE_ENV === 'production';

    const res = NextResponse.json({ success: true, message: 'Authenticated successfully' });

    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_SECONDS,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}