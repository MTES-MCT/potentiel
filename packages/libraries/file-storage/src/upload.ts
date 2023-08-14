import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { Upload } from '@aws-sdk/lib-storage';

export const upload = async (filePath: string, content: Readable) => {
  return new Upload({
    client: getClient(),
    params: {
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    },
  }).done();
};
