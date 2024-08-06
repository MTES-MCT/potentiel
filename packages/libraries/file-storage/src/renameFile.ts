import { DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { FichierInexistant } from './fichierInexistant.error';
import { copyFile } from './copyFile';

class CopyFailedError extends Error {
  constructor() {
    super('La copie du fichier a échoué');
  }
}
class DeleteFailedError extends Error {
  constructor() {
    super('La suppression du fichier a échoué');
  }
}

const assertFileExists = async (filePath: string) => {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: getBucketName(), Key: filePath }));
  } catch (e) {
    throw new FichierInexistant(filePath);
  }
};

/**
 * Renames a file in the same bucket
 **/
export const renameFile = async (fromName: string, toName: string) => {
  await assertFileExists(fromName);

  try {
    const response = await copyFile(fromName, toName);
    if (!response.CopyObjectResult) {
      throw new Error();
    }
    await assertFileExists(toName);
  } catch (e) {
    getLogger().warn('Copy failed', { error: e, fromName, toName });
    throw new CopyFailedError();
  }

  try {
    await getClient().send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: fromName }));
  } catch (e) {
    getLogger().warn('Delete failed', { error: e, fromName, toName });
    throw new DeleteFailedError();
  }
};
