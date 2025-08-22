// biome-ignore lint/style/noRestrictedImports: missing type in next exports, check again in Next 15
import type { NextMiddlewareResult } from 'next/dist/server/web/types';
import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse,
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

export type MiddlewareFactory = (middleware: CustomMiddleware) => CustomMiddleware;
