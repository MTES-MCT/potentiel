import { NextResponse } from 'next/server';

import { getOpenApiSpecs } from '@potentiel-applications/api-documentation';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  return NextResponse.json(getOpenApiSpecs(process.env.BASE_URL), {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
};
