import { getBlob } from '@potentiel-libraries/http-client';

const apiUrl = process.env.FILIGRANE_FACILE_ENDPOINT;

export const getFile = async (token: string): Promise<ReadableStream> => {
  const fileUrl = new URL(`${apiUrl}/api/document/${token}`);

  const watermarkedFile = await getBlob(fileUrl);
  return watermarkedFile.stream();
};
