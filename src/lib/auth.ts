import crypto from 'crypto';
import { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'lonewolf_admin_session';
export const SESSION_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is missing');
  }
  return secret;
}

function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    throw new Error('ADMIN_PASSWORD environment variable is missing');
  }
  return pwd;
}

export function verifyAdminPassword(provided: string): boolean {
  if (!provided || typeof provided !== 'string') return false;

  const expected = getAdminPassword();
  const providedHash = crypto.createHash('sha256').update(provided).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();

  return crypto.timingSafeEqual(providedHash, expectedHash);
}

export function createSessionToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadBase64)
    .digest('base64url');

  return payloadBase64 + '.' + signature;
}

export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadBase64, providedSig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadBase64)
    .digest('base64url');

  const providedBuf = Buffer.from(providedSig);
  const expectedBuf = Buffer.from(expectedSig);

  if (providedBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return false;

  try {
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp !== 'number' || payload.exp < now) {
      return false;
    }
    if (typeof payload.iat !== 'number' || payload.iat > now + 60) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function verifyAdminSession(req: NextRequest | Request): boolean {
  let cookieHeader: string | null = null;

  if ('cookies' in req && typeof (req as any).cookies?.get === 'function') {
    const sessionCookie = (req as NextRequest).cookies.get(ADMIN_COOKIE_NAME);
    if (sessionCookie?.value) {
      return verifySessionToken(sessionCookie.value);
    }
  }

  if ('headers' in req) {
    cookieHeader = req.headers.get('cookie');
  }

  if (!cookieHeader) return false;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(ADMIN_COOKIE_NAME + '=')) {
      const token = c.substring(ADMIN_COOKIE_NAME.length + 1);
      return verifySessionToken(token);
    }
  }

  return false;
}

export function verifyCsrfOrigin(req: NextRequest | Request): boolean {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (!origin) {
    const fetchSite = req.headers.get('sec-fetch-site');
    if (fetchSite && ['same-origin', 'same-site'].includes(fetchSite)) {
      return true;
    }
    return true;
  }

  try {
    const originUrl = new URL(origin);
    if (host && (originUrl.host === host || originUrl.host === host.split(':')[0])) {
      return true;
    }
    if (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1') {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}