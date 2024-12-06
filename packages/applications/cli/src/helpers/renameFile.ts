import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { getLogger } from '@potentiel-libraries/monitoring';
import { fileExists, copyFile, getBucketName, getClient } from '@potentiel-libraries/file-storage';

class DeleteFailedError extends Error {
  constructor() {
    super('La suppression du fichier a échoué');
  }
}
export class RenameFailedError extends Error {}

/**
 * Renames a file in the same bucket
 * Do not use in domain, this is intended for CLI utility: files related to an immutable event are also immutable
 **/
export const renameFile = async (fromName: string, toName: string) => {
  const exists = await fileExists(fromName);
  if (!exists) {
    throw new RenameFailedError(`From file not found: ${fromName}`);
  }

  await copyFile(fromName, toName);

  try {
    await getClient().send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: fromName }));
  } catch (e) {
    getLogger('Cli.helpers.renameFile').warn('Delete failed', { error: e, fromName });
    throw new DeleteFailedError();
  }
};
