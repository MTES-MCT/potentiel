import { connection, NextResponse } from 'next/server';

import { getOpenApiSpecs } from '@potentiel-applications/api-documentation';

export const GET = async () => {
  await connection();

  return NextResponse.json(getOpenApiSpecs(process.env.BASE_URL), {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
};
