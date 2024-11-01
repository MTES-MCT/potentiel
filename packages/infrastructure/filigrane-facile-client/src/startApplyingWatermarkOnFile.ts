import * as zod from 'zod';

import { post } from '@potentiel-libraries/http-client';

import { getApiUrl } from './getApiUrl';

const schema = zod.object({
  token: zod.string().min(1),
});

export const startApplyingWatermarkOnFile = async (
  watermark: string,
  file: Blob,
): Promise<string> => {
  const url = new URL(`/api/document/files`, getApiUrl());
  const response = await post(url, { watermark, files: file });

  const result = schema.parse(response);

  return result.token;
};
