import { before, beforeEach, describe, it } from 'node:test';
import { expect } from 'chai';

import { getFiles } from './getFiles';
import { upload } from './upload';
import { setTestBucket, createOrRecreateBucket } from './test-utils';

describe(`get files`, () => {
  const bucketName = 'potentiel';

  before(() => {
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

    const files = await getFiles(pattern);
    expect(files).to.have.length(1);
    expect(files[0]).to.eq(filePath);
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand aucun fichier n'est téléversés
    Alors aucune clés d'accès ne devtait être récupérable depuis le bucket`, async () => {
    const pattern = 'path/to';

    const files = await getFiles(pattern);
    expect(files).to.have.length(0);
  });
});
