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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await csrfProtect(request as any, response as any);
    } catch (err) {
      if (err instanceof CsrfError) {
        const isAction = request.method === 'POST' && request.headers.has('Next-Action');
        if (isAction) {
          return NextResponse.json(
            {
              status: 'failed',
            },
            {
              status: 403,
              statusText: 'Invalid CSRF token',
            },
          );
        }
        return NextResponse.redirect(new URL('/error', request.url));
      }
      throw err;
    }

    return middleware(request, event, response);
  };
}
