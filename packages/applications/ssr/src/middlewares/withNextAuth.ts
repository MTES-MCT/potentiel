import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { CustomMiddleware } from './middleware';

export function withNextAuth(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signIn', request.url));
    }

    return middleware(request, event, NextResponse.next());
  };
}
