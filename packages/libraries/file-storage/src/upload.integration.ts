import { before, beforeEach, describe, it } from 'node:test';

import { expect } from 'chai';

import { download } from './download.js';
import { upload } from './upload.js';
import { setTestBucketEnvVariable, createOrRecreateBucket } from './test-utils.integration.js';

describe(`upload file`, () => {
  const bucketName = 'potentiel';

  before(() => {
    setTestBucketEnvVariable(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors il devrait être récupérable depuis le bucket`, async () => {
    const filePath = 'path/to/file.pdf';
    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(filePath, content);

    const actual = await download(filePath);
    expect(actual).not.to.be.null;
  });
});
