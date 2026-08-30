import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createSessionToken, ADMIN_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';
import { checkRateLimit } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';

    // Rate limiting: max 5 login attempts per 15 minutes per IP
    const rate = await checkRateLimit('login_attempts', ip, 5, 15 * 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many failed login attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const password = body?.password;

    if (!password || typeof password !== 'string' || !verifyAdminPassword(password)) {
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