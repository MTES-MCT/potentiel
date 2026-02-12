import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { CustomMiddleware } from './middleware';

export function withNextAuth(nextMiddleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      redirect('/auth/signIn');
    }

    return nextMiddleware(request, event, NextResponse.next());
  };
}
