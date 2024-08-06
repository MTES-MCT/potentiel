import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getClient } from './getClient';
import { getBucketName } from './getBucketName';

class DeleteFailedError extends Error {
  constructor() {
    super('La suppression du fichier a échoué');
  }
}

export const deleteFile = async (key: string) => {
  try {
    await getClient().send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }));
  } catch (e) {
    getLogger().warn('Delete failed', { error: e, key });
    throw new DeleteFailedError();
  }
};
