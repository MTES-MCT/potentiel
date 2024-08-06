import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { getLogger } from '@potentiel-libraries/monitoring';

import { copyFile } from './copyFile';
import { assertFileExists } from './assertFileExists';
import { getClient } from './getClient';
import { getBucketName } from './getBucketName';

class DeleteFailedError extends Error {
  constructor() {
    super('La suppression du fichier a échoué');
  }
}

/**
 * Renames a file in the same bucket
 * Do not use in domain, this is intended for CLI utility: files related to an immutable event are also immutable
 **/
export const renameFile = async (fromName: string, toName: string) => {
  await assertFileExists(fromName);

  await copyFile(fromName, toName);

  try {
    await getClient().send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: fromName }));
  } catch (e) {
    getLogger().warn('Delete failed', { error: e, fromName });
    throw new DeleteFailedError();
  }
};
