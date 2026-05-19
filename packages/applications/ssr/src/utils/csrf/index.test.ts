import assert from 'node:assert';
import { beforeEach, describe, test } from 'node:test';

import {
  type CookieJar,
  CSRF_FORM_FIELD,
  CSRF_SECRET_COOKIE,
  CsrfError,
  createCsrfToken,
  isValidCsrfToken,
  verifyCsrfToken,
} from './index';

beforeEach(() => {
  process.env.CSRF_SECRET = 'abcdefghijklmnopqrstuvwxyz012345';
});

const cookieJarWithSessionToken = (sessionToken: string | undefined): CookieJar => ({
  get: (name: string) =>
    name === CSRF_SECRET_COOKIE && sessionToken ? { value: sessionToken } : undefined,
});

const csrfErrorPredicate =
  (expectedMessage: string) =>
  (error: unknown): error is CsrfError =>
    error instanceof CsrfError && error.message === expectedMessage;

describe('createCsrfToken', () => {
  test('should create a token that can be validated with the same session token', () => {
    const sessionToken = 'session-token';

    const csrfToken = createCsrfToken(sessionToken);

    assert.match(csrfToken, /^[a-f0-9]{64}\.[a-f0-9]{64}$/);
    assert.equal(isValidCsrfToken(csrfToken, sessionToken), true);
  });
});

describe('isValidCsrfToken', () => {
  test('should return false when token format is invalid', () => {
    const sessionToken = 'session-token';

    assert.equal(isValidCsrfToken('invalid-token', sessionToken), false);
    assert.equal(isValidCsrfToken('signature-only.', sessionToken), false);
    assert.equal(isValidCsrfToken('.nonce-only', sessionToken), false);
  });

  test('should return false when nonce is tampered', () => {
    const sessionToken = 'session-token';
    const csrfToken = createCsrfToken(sessionToken);
    const [signature, nonce] = csrfToken.split('.');
    const tamperedLastChar = nonce.at(-1) === '0' ? '1' : '0';
    const tamperedNonce = `${nonce.slice(0, -1)}${tamperedLastChar}`;

    assert.equal(isValidCsrfToken(`${signature}.${tamperedNonce}`, sessionToken), false);
  });

  test('should return false with a different session token', () => {
    const csrfToken = createCsrfToken('session-token-1');

    assert.equal(isValidCsrfToken(csrfToken, 'session-token-2'), false);
  });
});

describe('verifyCsrfToken', () => {
  test('should throw when csrf token is missing from form data', async () => {
    const formData = new FormData();
    const cookies = cookieJarWithSessionToken('session-token');

    await assert.rejects(
      () => verifyCsrfToken(formData, cookies),
      csrfErrorPredicate('Missing CSRF token in form data'),
    );
  });

  test('should throw when csrf token in form data is not a string', async () => {
    const formData = new FormData();
    formData.set(CSRF_FORM_FIELD, new Blob(['token-content']), 'token.txt');
    const cookies = cookieJarWithSessionToken('session-token');

    await assert.rejects(
      () => verifyCsrfToken(formData, cookies),
      csrfErrorPredicate('Invalid CSRF token in form data'),
    );
  });

  test('should throw when csrf session token is missing', async () => {
    const formData = new FormData();
    formData.set(CSRF_FORM_FIELD, 'submitted-token');
    const cookies = cookieJarWithSessionToken(undefined);

    await assert.rejects(
      () => verifyCsrfToken(formData, cookies),
      csrfErrorPredicate('Missing CSRF session token'),
    );
  });

  test('should throw when csrf token does not match the session token', async () => {
    const formData = new FormData();
    const sessionToken = 'session-token';
    const otherSessionToken = 'other-session-token';
    const cookies = cookieJarWithSessionToken(sessionToken);

    formData.set(CSRF_FORM_FIELD, createCsrfToken(otherSessionToken));

    await assert.rejects(
      () => verifyCsrfToken(formData, cookies),
      csrfErrorPredicate('CSRF token mismatch'),
    );
  });

  test('should not throw when csrf token matches the session token', async () => {
    const formData = new FormData();
    const sessionToken = 'session-token';
    const cookies = cookieJarWithSessionToken(sessionToken);

    formData.set(CSRF_FORM_FIELD, createCsrfToken(sessionToken));

    await assert.doesNotReject(() => verifyCsrfToken(formData, cookies));
  });
});
