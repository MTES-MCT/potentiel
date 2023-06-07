import { Readable } from 'stream';
import { download } from './download';
import { getClient } from './getClient';
import { upload } from './upload';
import { deleteFile } from './delete';
import { FichierInexistant } from './fichierInexistant.error';

describe(`upload file`, () => {
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
    Quand un fichier est supprimé
    Alors il devrait ne devrait plus être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = Readable.from("Contenu d'un fichier", {
      encoding: 'utf8',
    });

    await upload(filePath, content);
    await deleteFile(filePath);

    await expect(download(filePath)).rejects.toBeInstanceOf(FichierInexistant);
  });
});
