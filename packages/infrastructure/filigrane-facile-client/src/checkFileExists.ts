import * as zod from 'zod';

import { get } from '@potentiel-libraries/http-client';

const apiUrl = process.env.FILIGRANE_FACILE_ENDPOINT;

const schema = zod.object({
  url: zod.string().min(1),
});

export async function checkFileExists(token: string): Promise<boolean> {
  const checkFileUrl = new URL(`${apiUrl}/api/document/url/${token}`);

  const response = await get(checkFileUrl);

  return schema.safeParse(response).success;
}
