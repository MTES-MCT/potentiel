import { parse } from 'node:url';

import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

import { getSessionUser } from '@/auth/getSessionUser';
import type { CustomMiddleware } from './middleware';

export function withAuth(nextMiddleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const utilisateur = await getSessionUser(request);
    if (!utilisateur) {
      const url = new URL('/auth/signIn', request.url);
      const { path } = parse(request.url, true);
      if (path) {
        const callbackUrl = new URL(path, process.env.BASE_URL);
        url.searchParams.set('callbackUrl', callbackUrl.toString());
      }
      return NextResponse.redirect(url);
    }

    return nextMiddleware(request, event, NextResponse.next());
  };
}
