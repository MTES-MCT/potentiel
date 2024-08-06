import { HeadObjectCommand } from '@aws-sdk/client-s3';

import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { FichierInexistant } from './fichierInexistant.error';

export const assertFileExists = async (filePath: string) => {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: getBucketName(), Key: filePath }));
  } catch (e) {
    throw new FichierInexistant(filePath);
  }
};
