import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const download = async (filePath: string) => {
  const list = await getClient()
    .listObjects({ Bucket: getBucketName(), Prefix: filePath })
    .promise();

  const key = list.Contents![0].Key;

  console.log('key', key);

  const result = await getClient()
    .getObject({ Bucket: getBucketName(), Key: key || '' })
    .promise();

  return result.Body as Readable;
};
