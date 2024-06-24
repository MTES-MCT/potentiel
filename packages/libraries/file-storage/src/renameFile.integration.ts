import { before, beforeEach, describe, it } from 'node:test';
import { expect } from 'chai';

import { download } from './download';
import { upload } from './upload';
import { renameFile } from './renameFile';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration';

describe(`rename file`, () => {
  const bucketName = 'potentiel';

  before(() => {
    setTestBucketEnvVariable(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné un endpoint et un bucket
    Et un fichier téléverśe
    Quand un fichier est renommé
    Alors il devrait être récupérable depuis le bucket`, async () => {
    const originalName = 'original-name';
    const newName = 'new-name';

    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(originalName, content);

    await renameFile(originalName, newName);

    const actual = await download(newName);
    expect(actual).not.to.be.null;
  });
});
