import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { Readable } from 'stream';
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

describe(`upload file`, () => {
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
    Quand un fichier est téléversé
    Alors il devrait être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = Readable.from("Contenu d'un fichier", {
      encoding: 'utf8',
    });

    await upload(filePath, content);

    const actual = await download(filePath);
    expect(actual).not.toBeNull();
  });
});
