'use client';

import { CSRF_FORM_FIELD, CSRF_TOKEN_COOKIE } from '@/utils/csrf';
import { useEffect, useState } from 'react';

function readCookie(name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export function FormCsrfInput() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(readCookie(CSRF_TOKEN_COOKIE));
  }, []);

  return <input type="hidden" name={CSRF_FORM_FIELD} value={token} />;
}
