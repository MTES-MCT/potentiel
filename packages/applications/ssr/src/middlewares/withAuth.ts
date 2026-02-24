import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getCookieCache } from 'better-auth/cookies';

import { CustomMiddleware } from './middleware';

export function withAuth(nextMiddleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const session = await getCookieCache(request, { isSecure: true, strategy: 'jwe' });
    if (!session) {
      return NextResponse.redirect(
        new URL('/auth/signIn?callbackUrl=' + encodeURIComponent(request.url), request.url),
      );
    }

    return nextMiddleware(request, event, NextResponse.next());
  };
}
