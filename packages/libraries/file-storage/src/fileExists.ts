import { HeadObjectCommand } from '@aws-sdk/client-s3';

import { getBucketName } from './getBucketName.js';
import { getClient } from './getClient.js';

export const fileExists = async (filePath: string) => {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: getBucketName(), Key: filePath }));
    return true;
  } catch {
    return false;
  }
};
