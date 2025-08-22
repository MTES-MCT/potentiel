import { HeadObjectCommand } from '@aws-sdk/client-s3';

import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const fileExists = async (filePath: string) => {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: getBucketName(), Key: filePath }));
    return true;
  } catch {
    return false;
  }
};
