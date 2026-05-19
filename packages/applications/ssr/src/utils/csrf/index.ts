import crypto from 'node:crypto';

import { CSRF_FORM_FIELD, CSRF_SECRET_COOKIE, CSRF_TOKEN_COOKIE } from './constants';

export { CSRF_FORM_FIELD, CSRF_SECRET_COOKIE, CSRF_TOKEN_COOKIE };

export type CookieJar = {
  get: (name: string) => { value: string } | undefined;
};

function getCsrfSecret() {
  const secret = process.env.CSRF_SECRET ?? '';
  if (!secret || secret.length < 32) {
    throw new Error(
      'CSRF_SECRET environment variable must be set and be at least 32 characters long',
    );
  }
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getCsrfSecret()).update(payload).digest('hex');
}

export function generateCsrfSecret() {
  return crypto.randomBytes(32).toString('base64url');
}

const formatMessage = (sessionToken: string, nonce: string) => {
  return `${sessionToken.length}!${sessionToken}!${nonce.length}!${nonce}`;
};

export function createCsrfToken(sessionToken: string) {
  const nonce = crypto.randomBytes(32).toString('hex');
  const message = formatMessage(sessionToken, nonce);
  const hmacSignature = sign(message);
  return `${hmacSignature}.${nonce}`;
}

export function isValidCsrfToken(requestCsrfToken: string, sessionToken: string) {
  const parts = requestCsrfToken.split('.');
  if (parts.length !== 2) return false;

  const [hmacSignatureFromRequest, nonce] = parts;
  if (!hmacSignatureFromRequest || !nonce) return false;

  const message = formatMessage(sessionToken, nonce);
  const expectedSignature = sign(message);

  const a = Buffer.from(hmacSignatureFromRequest);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const verifyCsrfToken = async (formData: FormData, cookies: CookieJar) => {
  const submittedToken = formData.get(CSRF_FORM_FIELD);
  if (submittedToken === null) {
    throw new CsrfError('Missing CSRF token in form data');
  }
  if (typeof submittedToken !== 'string') {
    throw new CsrfError('Invalid CSRF token in form data');
  }
  const sessionToken = cookies.get(CSRF_SECRET_COOKIE)?.value;
  if (!sessionToken) {
    throw new CsrfError('Missing CSRF session token');
  }
  if (!isValidCsrfToken(submittedToken, sessionToken)) {
    throw new CsrfError('CSRF token mismatch');
  }
};

export class CsrfError extends Error {}
