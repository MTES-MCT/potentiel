import path from 'node:path';

import { CopyObjectCommand } from '@aws-sdk/client-s3';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getClient } from './getClient';
import { getBucketName } from './getBucketName';
import { assertFileExists } from './assertFileExists';

class CopyFailedError extends Error {
  constructor() {
    super('La copie du fichier a échoué');
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
    await assertFileExists(targetKey);
  } catch (e) {
    getLogger().warn('Copy failed', { error: e, sourceKey, targetKey });
    throw new CopyFailedError();
  }
};
