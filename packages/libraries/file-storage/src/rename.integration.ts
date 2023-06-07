import { Readable } from 'stream';
import { getClient } from './getClient';
import { upload } from './upload';
import { getBucketName } from './getBucketName';
import { renameFile } from './rename';

describe(`rename file`, () => {
  const bucketName = 'potentiel';
  beforeAll(() => {
    process.env.S3_ENDPOINT = 'http://localhost:9443/s3';
    process.env.S3_BUCKET = bucketName;
    process.env.AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
    process.env.AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
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
    Quand un fichier est renommé
    Alors il devrait être récupérable depuis le bucket
    Et l'ancien fichier devrait être supprimé`, async () => {
    const filePath = 'path/to/file.pdf';
    const newFilePath = 'path/to/file2.pdf';
    const content = "Contenu d'un fichier";
    const file = Readable.from("Contenu d'un fichier", {
      encoding: 'utf8',
    });
    await upload(filePath, file);

    await renameFile(filePath, newFilePath);

    const actual = await getClient()
      .getObject({ Bucket: getBucketName(), Key: newFilePath })
      .promise();

    expect(actual).not.toBeNull();
    expect(actual.Body!.toString()).toEqual(content);
  });
});
