import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { Readable } from 'stream';
import { download } from './download';
import { getClient } from './getClient';
import { upload } from './upload';

describe(`upload file`, () => {
  const bucketName = 'potentiel';
  beforeAll(() => {
    process.env.S3_ENDPOINT = 'http://localhost:9001';
    process.env.S3_BUCKET = bucketName;
    process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
    process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
  });

  beforeEach(async () => {
    const isBucketExists = async () => {
      try {
        await getClient()
          .headBucket({
            Bucket: bucketName,
          })
          .promise();
        return true;
      } catch (err) {
        return false;
      }
    };

    if (await isBucketExists()) {
      const objectsToDelete = await getClient().listObjects({ Bucket: bucketName }).promise();

      if (objectsToDelete.Contents?.length) {
        await getClient()
          .deleteObjects({
            Bucket: bucketName,
            Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key! })) },
          })
          .promise();
      }

      await getClient()
        .deleteBucket({
          Bucket: bucketName,
        })
        .promise();
    }

    await getClient()
      .createBucket({
        Bucket: bucketName,
      })
      .promise();
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
