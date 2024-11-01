import { getBlob } from '@potentiel-libraries/http-client';

import { getApiUrl } from './getApiUrl';

export const getWatermarkedFile = async (token: string): Promise<Blob> => {
  const fileUrl = new URL(`/api/document/${token}`, getApiUrl());

  const watermarkedFile = await getBlob(fileUrl);

  return watermarkedFile;
};
