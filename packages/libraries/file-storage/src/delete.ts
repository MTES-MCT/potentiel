import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const deleteFile = async (filePath: string) => {
  await getClient()
    .deleteObject({
      Bucket: getBucketName(),
      Key: filePath,
    })
    .promise();
};
