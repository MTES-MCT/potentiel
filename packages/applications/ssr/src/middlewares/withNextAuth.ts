import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import NextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

import { CustomMiddleware } from './middleware';

export function withNextAuth(nextMiddleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const result = await NextAuthMiddleware(request as NextRequestWithAuth, event);
    // redirect if not authenticated
    if (result) {
      return result;
    }

    return nextMiddleware(request, event, NextResponse.next());
  };
}
