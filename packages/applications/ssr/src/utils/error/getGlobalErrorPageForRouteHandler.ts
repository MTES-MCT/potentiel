import { NextRequest } from 'next/server';

export const getGlobalErrorPageForRouteHandler = (request: NextRequest) =>
  new URL('/global-error', request.url);
