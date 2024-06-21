import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { FichierInexistant } from './fichierInexistant.error';

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

/** Renames a file in the same bucket */
export const renameFile = async (fromName: string, toName: string) => {
  await assertFileExists(fromName);

  try {
    const response = await getClient().send(
      new CopyObjectCommand({
        Bucket: getBucketName(),
        Key: toName,
        CopySource: [getBucketName(), fromName].join('/'),
      }),
    );
    if (!response.CopyObjectResult) {
      throw new Error();
    }
    await assertFileExists(toName);
  } catch (e) {
    console.log(e);
    throw new CopyFailedError();
  }

  try {
    await getClient().send(
      new DeleteObjectCommand({
        Bucket: getBucketName(),
        Key: fromName,
      }),
    );
  } catch {
    throw new DeleteFailedError();
  }
};
