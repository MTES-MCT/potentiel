import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const updateFile = async (filePath: string, content: string) => {
  await getClient()
    .putObject({
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    })
    .promise();
};
