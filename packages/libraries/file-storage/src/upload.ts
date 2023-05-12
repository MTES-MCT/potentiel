import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const upload = async (filePath: string, content: Readable) => {
  await getClient()
    .upload({
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    })
    .promise();
};
