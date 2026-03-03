import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse,
) => NextResponse | Promise<NextResponse>;

export type MiddlewareFactory = (middleware: CustomMiddleware) => CustomMiddleware;
