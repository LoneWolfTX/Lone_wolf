import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  const isProd = process.env.NODE_ENV === 'production';

  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return res;
}