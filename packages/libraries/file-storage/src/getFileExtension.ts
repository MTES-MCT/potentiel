import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { extname } from 'path';

export const getFileExtension = async (pattern: string) => {
  const list = await getClient()
    .listObjects({ Bucket: getBucketName(), Prefix: pattern })
    .promise();

  if (!list.Contents || list.Contents.length === 0 || !list.Contents[0].Key) {
    throw new Error('No file match');
  }

  return extname(list.Contents[0].Key);
};
