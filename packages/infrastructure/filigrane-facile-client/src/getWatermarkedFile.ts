import { getBlob } from '@potentiel-libraries/http-client';

import { getApiUrl } from './getApiUrl.js';

export const getWatermarkedFile = async (token: string): Promise<Blob> => {
  const url = new URL(`/api/document/${token}`, getApiUrl());

  const watermarkedFile = await getBlob({ url });

  return watermarkedFile;
};
