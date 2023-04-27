import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const getFiles = async (pattern: string): Promise<string[]> => {
  const files = await getClient()
    .listObjects({ Bucket: getBucketName(), Prefix: pattern })
    .promise();

  if (!files.Contents || files.Contents.length === 0 || !files.Contents[0].Key) {
    return [];
  }
  return files.Contents.map((file) => file.Key || undefined).filter((file) => file) as string[];
};
