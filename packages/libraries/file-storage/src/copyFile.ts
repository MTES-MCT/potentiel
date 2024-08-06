import path from 'node:path';

import { CopyObjectCommand } from '@aws-sdk/client-s3';

import { getClient } from './getClient';
import { getBucketName } from './getBucketName';

export const copyFile = async (sourceKey: string, targetKey: string) => {
  return await getClient().send(
    new CopyObjectCommand({
      Bucket: getBucketName(),
      Key: targetKey,
      CopySource: path.join(getBucketName(), encodeURIComponent(sourceKey)),
    }),
  );
};
