import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

import { CustomMiddlewareProps } from './chain';

export function withAuthMiddleware(middleware: CustomMiddlewareProps): CustomMiddlewareProps {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signIn', request.url));
    }

    return middleware(request, event, response);
  };
}
