import { NextResponse } from 'next/server';

export const middleware = (request: Request) => {
  // TODO CORS + Rate Limiter
  NextResponse.next();
};

export const config = {
  matcher: '/api/:path*',
};
