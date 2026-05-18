import { NextRequest, NextResponse } from 'next/server';
import {
  createCsrfToken,
  CSRF_SECRET_COOKIE,
  CSRF_TOKEN_COOKIE,
  generateCsrfSecret,
} from '@/utils/csrf';

function getOrCreateCsrfSessionToken(req: NextRequest, res: NextResponse) {
  const existing = req.cookies.get(CSRF_SECRET_COOKIE)?.value;
  if (existing) return existing;

  const newToken = generateCsrfSecret();
  res.cookies.set({
    name: CSRF_SECRET_COOKIE,
    value: newToken,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  return newToken;
}

/** Middleware that populates a CSRF token for each incoming request */
export function withCSRF() {
  return async (req: NextRequest) => {
    const method = req.method.toUpperCase();
    const res = NextResponse.next();

    if (method !== 'GET') {
      return res;
    }

    const sessionToken = getOrCreateCsrfSessionToken(req, res);
    const token = createCsrfToken(sessionToken);
    res.cookies.set({
      name: CSRF_TOKEN_COOKIE,
      value: token,
      httpOnly: false,
    });
    return res;
  };
}
