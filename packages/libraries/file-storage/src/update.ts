import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const updateFile = async (filePath: string, content: Readable) => {
  await getClient()
    .putObject({
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    })
    .promise();
};
