import { GetObjectCommand } from '@aws-sdk/client-s3';

import { getBucketName } from './getBucketName.js';
import { getClient } from './getClient.js';
import { FichierInexistant } from './fichierInexistant.error.js';

export const download = async (filePath: string) => {
  try {
    const result = await getClient().send(
      new GetObjectCommand({ Bucket: getBucketName(), Key: filePath }),
    );

    if (!result.Body) {
      throw new FichierInexistant(filePath);
    }

    return result.Body.transformToWebStream();
  } catch {
    throw new FichierInexistant(filePath);
  }
};
