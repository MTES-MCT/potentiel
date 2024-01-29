import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { download } from './download';
import { getClient } from './getClient';
import { upload } from './upload';
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  HeadBucketCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { copyFile } from './copyFile';

describe(`copy file`, () => {
  const bucketName = 'potentiel';
  beforeAll(() => {
    process.env.AWS_REGION = 'localhost';
    process.env.S3_ENDPOINT = 'http://localhost:9001';
    process.env.S3_BUCKET = bucketName;
    process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
    process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
  });

  beforeEach(async () => {
    const isBucketExists = async () => {
      try {
        await getClient().send(
          new HeadBucketCommand({
            Bucket: bucketName,
          }),
        );
        return true;
      } catch (err) {
        return false;
      }
    };

    if (await isBucketExists()) {
      const objectsToDelete = await getClient().send(
        new ListObjectsCommand({ Bucket: bucketName }),
      );

      if (objectsToDelete.Contents?.length) {
        await getClient().send(
          new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key! })) },
          }),
        );
      }

      await getClient().send(
        new DeleteBucketCommand({
          Bucket: bucketName,
        }),
      );
    }

    await getClient().send(
      new CreateBucketCommand({
        Bucket: bucketName,
      }),
    );
  });

  it(`
    Etant donné un endpoint et un bucket
    Et un fichier téléverśe
    Quand un fichier est copié
    Alors la copie devrait être récupérable depuis le bucket`, async () => {
    const sourcePath = 'path/to/file.pdf';
    const targetPath = 'path/to/another/file.pdf';

    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(sourcePath, content);
    await copyFile(sourcePath, targetPath);

    const actual = await download(targetPath);
    expect(actual).not.toBeNull();
  });
});
