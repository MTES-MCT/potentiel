import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const upload = async (filePath: string, content: Buffer) => {
  await getClient()
    .upload({
      Bucket: getBucketName(),
      Key: filePath,
      Body: content,
    })
    .promise();
};
