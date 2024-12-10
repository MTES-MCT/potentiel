import { NextResponse } from 'next/server';

import { getOpenApiSpecs } from '@potentiel-applications/api-documentation';

export const GET = async () => {
  return NextResponse.json(await getOpenApiSpecs());
};
