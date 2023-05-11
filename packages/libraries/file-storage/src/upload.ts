import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export type Upload = (filePath: string, content: Readable) => Promise<void>;

export const upload: Upload = async (filePath: string, content: Readable) => {
  await getClient()
    .upload({
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    })
    .promise();
};
