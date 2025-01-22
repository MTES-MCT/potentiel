import { createCsrfProtect, CsrfError } from '@edge-csrf/nextjs';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { CustomMiddleware } from './middleware';

const csrfProtect = createCsrfProtect({
  cookie: {
    sameSite: true,
    secure: true,
    httpOnly: true,
  },
  token: {
    responseHeader: 'csrf_token',
  },
});

export function withCSRF(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next();

    try {
      await csrfProtect(request, response);
    } catch (err) {
      if (err instanceof CsrfError) {
        return NextResponse.redirect(new URL('/error', request.url));
      }
      throw err;
    }

    return middleware(request, event, response);
  };
}
