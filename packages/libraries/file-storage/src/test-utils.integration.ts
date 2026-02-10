import {
  HeadBucketCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';

import { getClient } from './getClient.js';

const isBucketExists = async (bucketName: string) => {
  try {
    await getClient().send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch {
    return false;
  }
};

const deleteBucket = async (bucketName: string) => {
  const objectsToDelete = await getClient().send(new ListObjectsCommand({ Bucket: bucketName }));

  if (objectsToDelete.Contents?.length) {
    await getClient().send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key! })) },
      }),
    );
  }

  await getClient().send(new DeleteBucketCommand({ Bucket: bucketName }));
};

export const createOrRecreateBucket = async (bucketName: string) => {
  if (await isBucketExists(bucketName)) {
    await deleteBucket(bucketName);
  }

  await getClient().send(new CreateBucketCommand({ Bucket: bucketName }));
};

export const setTestBucketEnvVariable = (bucketName: string) => {
  process.env.AWS_REGION = 'localhost';
  process.env.S3_ENDPOINT = 'http://localhost:9001';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
  process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
};
