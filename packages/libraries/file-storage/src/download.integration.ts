import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { upload } from './upload';
import { download } from './download';
import { FichierInexistant } from './fichierInexistant.error';

import { createOrRecreateBucket, setTestBucket } from './test-utils';

describe(`download file`, () => {
  const bucketName = 'potentiel';

  beforeAll(() => {
    setTestBucket(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors le fichier devrait être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(filePath, content);

    await expect(download(filePath)).resolves.toBeTruthy();
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand aucun fichier n'est téléversé
    Alors le fichier ne devrait pas être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';

    await expect(download(filePath)).rejects.toBeInstanceOf(FichierInexistant);
  });
});
