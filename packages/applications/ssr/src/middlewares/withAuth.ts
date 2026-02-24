import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getCookieCache } from 'better-auth/cookies';

import { CustomMiddleware } from './middleware';

export function withAuth(nextMiddleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const session = await getCookieCache(request, { isSecure: true, strategy: 'jwe' });
    if (!session) {
      const url = new URL('/auth/signIn', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }

    return nextMiddleware(request, event, NextResponse.next());
  };
}
