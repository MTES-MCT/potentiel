import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';

import { getClient } from '@potentiel-libraries/file-storage';

import { createS3ClientWithMD5 } from './createS3ClientWithMD5.js';

export const resetBucket = async (bucketName: string) => {
  try {
    const objectsToDelete = await getClient().send(
      new ListObjectsV2Command({ Bucket: bucketName }),
    );

    if (objectsToDelete.Contents?.length) {
      await createS3ClientWithMD5().send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key })) },
        }),
      );
    }

    await getClient().send(
      new DeleteBucketCommand({
        Bucket: bucketName,
      }),
    );
  } catch {}

  await getClient().send(
    new CreateBucketCommand({
      Bucket: bucketName,
    }),
  );
};
