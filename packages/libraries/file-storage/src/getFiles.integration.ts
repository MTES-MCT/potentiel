import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getFiles } from './getFiles';

import { upload } from './upload';
import { setTestBucket, createOrRecreateBucket } from './test-utils';

describe(`get files`, () => {
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
    Alors sa clés d'accès ne devraient être récupérable depuis le bucket`, async () => {
    const pattern = 'path/to';
    const filePath = `${pattern}/file.pdf`;
    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
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
