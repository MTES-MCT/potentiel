import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { HeadObjectCommand } from '@aws-sdk/client-s3';

export const exists = async (filePath: string) => {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: getBucketName(), Key: filePath }));

    return true;
  } catch (e) {
    if ((e as Error).name === 'NotFound') {
      return false;
    }
    throw e;
  }
};
