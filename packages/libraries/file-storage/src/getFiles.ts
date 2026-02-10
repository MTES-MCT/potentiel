import { ListObjectsCommand } from '@aws-sdk/client-s3';

import { getBucketName } from './getBucketName.js';
import { getClient } from './getClient.js';

export const getFiles = async (pattern: string): Promise<string[]> => {
  const files = await getClient().send(
    new ListObjectsCommand({ Bucket: getBucketName(), Prefix: pattern }),
  );

  if (!files.Contents || files.Contents.length === 0 || !files.Contents[0].Key) {
    return [];
  }
  return files.Contents.map((file) => file.Key || undefined).filter((file) => file) as string[];
};
