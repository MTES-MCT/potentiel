import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const deleteFile = async (filePath: string) => {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: filePath,
    }),
  );
};
