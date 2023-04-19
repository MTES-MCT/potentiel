import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const download = async (filePath: string) => {
  const result = await getClient().getObject({ Bucket: getBucketName(), Key: filePath }).promise();

  return Readable.from(result.Body as Buffer);
};
