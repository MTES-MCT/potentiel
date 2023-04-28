import { Readable } from 'stream';
import { FichierInexistant, download } from './download';
import { getClient } from './getClient';
import { upload } from './upload';
import { renameFile } from './renameFile';

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
    Alors le fichier devrait être récupérable depuis le bucket avec son nouveau nom`, async () => {
    const oldFilePath = 'path/to/file.pdf';
    const newFilePath = 'path/to/file-rename.pdf';
    const content = Readable.from("Contenu d'un fichier", {
      encoding: 'utf8',
    });
    await upload(oldFilePath, content);

    await renameFile(oldFilePath, newFilePath);

    await expect(download(oldFilePath)).rejects.toBeInstanceOf(FichierInexistant);
    await expect(download(newFilePath)).resolves.toBeTruthy();
  });
});
