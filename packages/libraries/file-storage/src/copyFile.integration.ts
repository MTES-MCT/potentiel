import { before, beforeEach, describe, it } from 'node:test';
import { expect } from 'chai';
import { download } from './download';
import { upload } from './upload';

import { copyFile } from './copyFile';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration';

describe(`copy file`, () => {
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
    Quand un fichier est copié
    Alors la copie devrait être récupérable depuis le bucket`, async () => {
    const sourcePath = 'path/to/file.pdf';
    const targetPath = 'path/to/another/file.pdf';

    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(sourcePath, content);
    await copyFile(sourcePath, targetPath);

    const actual = await download(targetPath);
    expect(actual).not.to.be.null;
  });
});
