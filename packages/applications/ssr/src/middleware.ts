import { CsrfError, createCsrfProtect } from '@edge-csrf/nextjs';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { getToken } from 'next-auth/jwt';

export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse,
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

type MiddlewareFactory = (middleware: CustomMiddleware) => CustomMiddleware;

export const chain = (functions: MiddlewareFactory[], index = 0): CustomMiddleware => {
  const current = functions[index];

  if (current) {
    const next = chain(functions, index + 1);
    return current(next);
  }

  return (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    return response;
  };
};

const csrfProtect = createCsrfProtect({
  cookie: {
    sameSite: true,
    secure: true,
  },
});

function withCSRF(middleware: CustomMiddleware) {
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

function withNextAuth(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signIn', request.url));
    }

    return middleware(request, event, NextResponse.next());
  };
}

export default chain([withNextAuth, withCSRF]);

export const config = {
  // do not run middleware for paths matching one of following
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|illustrations|$).*)',
  ],
};
