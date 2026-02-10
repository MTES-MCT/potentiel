import path from 'node:path';

import { CopyObjectCommand } from '@aws-sdk/client-s3';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getClient } from './getClient.js';
import { getBucketName } from './getBucketName.js';
import { fileExists } from './fileExists.js';

class CopyFailedError extends Error {
  constructor(message: string) {
    super(`La copie du fichier a échoué: ${message}`);
  }
}

export const copyFile = async (sourceKey: string, targetKey: string) => {
  try {
    const response = await getClient().send(
      new CopyObjectCommand({
        Bucket: getBucketName(),
        Key: targetKey,
        CopySource: path.join(getBucketName(), encodeURIComponent(sourceKey)),
      }),
    );
    if (!response.CopyObjectResult) {
      throw new Error();
    }
    const exists = await fileExists(targetKey);
    if (!exists) {
      throw new CopyFailedError(`Target file not found: ${targetKey}`);
    }
  } catch (e) {
    getLogger().warn('Copy failed', { error: e, sourceKey, targetKey });
    if (e instanceof CopyFailedError) {
      throw e;
    }
    throw new CopyFailedError((e as Error).message);
  }
};
