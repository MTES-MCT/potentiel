import * as zod from 'zod';

import { get } from '@potentiel-libraries/http-client';

import { getApiUrl } from './getApiUrl.js';

const schema = zod.object({
  url: zod.string().min(1),
});

export async function isWatermarkedFileAvailable(token: string): Promise<boolean> {
  const url = new URL(`/api/document/url/${token}`, getApiUrl());

  const response = await get({
    url,
    /**
     * 409: Le document n'est pas encore prêt
     * 404: Si on va trop vite, le document n'existe pas encore
     * On peut donc réessayer au maximum 10 fois
     */
    retryPolicyOptions: {
      maxAttempts: 10,
      handleAnotherError: (error) => [409, 404].includes(error.context.status),
    },
  });

  return schema.safeParse(response).success;
}
