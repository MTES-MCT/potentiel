'use client';

import { useEffect, useState } from 'react';

import { CSRF_FORM_FIELD, CSRF_TOKEN_COOKIE } from '@/utils/csrf/constants';

function readCookie(name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export function FormCsrfInput() {
  const [token, setToken] = useState(() =>
    typeof document === 'undefined' ? '' : readCookie(CSRF_TOKEN_COOKIE),
  );

  useEffect(() => {
    setToken(readCookie(CSRF_TOKEN_COOKIE));
  }, []);

  return <input type="hidden" name={CSRF_FORM_FIELD} value={token} />;
}
