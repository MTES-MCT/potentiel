import { download } from './download';
import { getClient } from './getClient';
import { upload } from './upload';

describe(`upload file`, () => {
  const bucketName = 'potentiel';
  beforeAll(() => {
    process.env.S3_ENDPOINT = 'http://localhost:9443/s3';
    process.env.S3_BUCKET = bucketName;
    process.env.AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
    process.env.AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
  });

  beforeEach(async () => {
    await getClient()
      .deleteBucket({
        Bucket: bucketName,
      })
      .promise();

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
    const content = Buffer.from("Contenu d'un fichier", 'utf8');

    await upload(filePath, content);

    const actual = await download(filePath);

    await getClient()
      .getObject({
        Bucket: bucketName,
        Key: filePath,
      })
      .promise();

    expect(actual).toStrictEqual(content);
  });
});
