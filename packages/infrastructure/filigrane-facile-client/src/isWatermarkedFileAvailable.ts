import * as zod from 'zod';

import { get } from '@potentiel-libraries/http-client';

import { getApiUrl } from './getApiUrl';

const schema = zod.object({
  url: zod.string().min(1),
});

export async function isWatermarkedFileAvailable(token: string): Promise<boolean> {
  const checkFileUrl = new URL(`/api/document/url/${token}`, getApiUrl());

  const response = await get(checkFileUrl);

  return schema.safeParse(response).success;
}
