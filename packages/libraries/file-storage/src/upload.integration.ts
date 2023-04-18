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

  beforeEach((done) => {
    getClient().deleteBucket(
      {
        Bucket: bucketName,
      },
      (error, data) => {
        console.log(error);
        console.log(data);
        done();
      },
    );

    getClient().createBucket(
      {
        Bucket: bucketName,
      },
      (error, data) => {
        console.log(error);
        console.log(data);
        done();
      },
    );
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors il devrait être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = Buffer.from("Contenu d'un fichier", 'utf8');

    await upload(filePath, content);

    const getFileContent = new Promise<Buffer>((resolve, reject) => {
      getClient().getObject(
        {
          Bucket: bucketName,
          Key: filePath,
        },
        (error, data) => {
          if (error) {
            reject(error);
          }

          resolve(data.Body as Buffer);
        },
      );
    });

    const actual = await getFileContent;

    expect(actual).toStrictEqual(content);
  });
});
