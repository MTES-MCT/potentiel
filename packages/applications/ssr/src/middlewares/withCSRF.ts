import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

import { CsrfError, createCsrfProtect } from '@potentiel-libraries/csrf';

import type { CustomMiddleware } from './middleware';

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
      // biome-ignore lint/suspicious/noExplicitAny: explicit any allowed here
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
