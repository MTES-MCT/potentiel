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
import { copyFolder } from './copyFolder';
import { join } from 'path';

describe(`copy folder`, () => {
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
    Et un dossier contenant des fichiers
    Quand le dossier est copié
    Alors la copie devrait être récupérable depuis le bucket`, async () => {
    const sourcePath = 'path/source';
    const sourceFilePath1 = join(sourcePath, 'file1.pdf');
    const sourceFilePath2 = join(sourcePath, 'file2.pdf');

    const targetPath = 'path/target';
    const targetFilePath1 = join(targetPath, 'file1.pdf');
    const targetFilePath2 = join(targetPath, 'file2.pdf');

    const content1 = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu du fichier 1`, 'utf-8'));
        controller.close();
      },
    });

    const content2 = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu du fichier 2`, 'utf-8'));
        controller.close();
      },
    });

    await upload(sourceFilePath1, content1);
    await upload(sourceFilePath2, content2);

    await copyFolder(sourcePath, targetPath);

    const actual1 = await download(targetFilePath1);
    const actual2 = await download(targetFilePath2);

    expect(actual1).not.toBeNull();
    expect(actual2).not.toBeNull();
  });
});
