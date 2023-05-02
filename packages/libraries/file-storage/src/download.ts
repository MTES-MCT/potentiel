import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export class FichierInexistant extends Error {
  constructor() {
    super(`Le fichier n'existe pas`);
  }
}

export const download = async (filePath: string) => {
  try {
    const result = await getClient()
      .getObject({ Bucket: getBucketName(), Key: filePath })
      .promise();
    return Readable.from(result.Body as Buffer);
  } catch (e) {
    throw new FichierInexistant();
  }
};
