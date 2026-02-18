import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { getCookieCache } from 'better-auth/cookies';

import { CustomMiddleware } from './middleware';

export function withAuth(nextMiddleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const session = await getCookieCache(request, { isSecure: true, strategy: 'jwe' });
    if (!session) {
      redirect('/auth/signIn?callbackUrl=' + encodeURIComponent(request.url));
    }

    return nextMiddleware(request, event, NextResponse.next());
  };
}
