import { Readable } from 'stream';
import { getClient } from './getClient';
import { upload } from './upload';
import { updateFile } from './update';
import { getBucketName } from './getBucketName';

describe(`update file`, () => {
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
    Quand un fichier est modifié
    Alors il devrait être récupérable depuis le bucket
    Et son contenu a bien été modifé avec le nouveau contenu`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = Readable.from("Contenu d'un fichier", {
      encoding: 'utf8',
    });
    const newContent = Readable.from("Contenu d'un fichier mis à jour", {
      encoding: 'utf8',
    });

    await upload(filePath, content);

    await updateFile(filePath, newContent);

    const actual = await getClient()
      .getObject({ Bucket: getBucketName(), Key: filePath })
      .promise();

    expect(actual).not.toBeNull();
    expect(actual.Body!.toString()).toEqual(newContent);
  });
});
