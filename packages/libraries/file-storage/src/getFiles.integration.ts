import { Readable } from 'stream';
import { getClient } from './getClient';
import { upload } from './upload';
import { getFiles } from './getFiles';

describe(`get files`, () => {
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
    Alors sa clés d'accès ne devraient être récupérable depuis le bucket`, async () => {
    const pattern = 'path/to';
    const filePath = `${pattern}/file.pdf`;
    const content = Readable.from("Contenu d'un fichier", {
      encoding: 'utf8',
    });
    await upload(filePath, content);

    await expect(getFiles(pattern)).resolves.toEqual([filePath]);
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand aucun fichier n'est téléversés
    Alors aucune clés d'accès ne devtait être récupérable depuis le bucket`, async () => {
    const pattern = 'path/to';

    await expect(getFiles(pattern)).resolves.toEqual([]);
  });
});
