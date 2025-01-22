import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { CustomMiddleware, MiddlewareFactory } from './middleware';

export const chain = (functions: MiddlewareFactory[], index = 0): CustomMiddleware => {
  const current = functions[index];

  if (current) {
    const next = chain(functions, index + 1);
    return current(next);
  }

  return (_request: NextRequest, _event: NextFetchEvent, response: NextResponse) => {
    return response;
  };
};
