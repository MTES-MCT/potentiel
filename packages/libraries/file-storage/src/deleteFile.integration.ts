import { before, beforeEach, describe, it } from 'node:test';

import { assert, expect } from 'chai';

import { download } from './download';
import { upload } from './upload';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration';
import { assertFileExists } from './assertFileExists';
import { deleteFile } from './deleteFile';
import { FichierInexistant } from './fichierInexistant.error';

describe(`delete file`, () => {
  const bucketName = 'potentiel';
  before(() => {
    setTestBucketEnvVariable(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné un fichier téléverśe
    Quand un fichier est supprimé
    Alors il ne devrait plus être récupérable depuis le bucket`, async () => {
    const sourcePath = 'path/to/file.pdf';

    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(sourcePath, content);
    await assertFileExists(sourcePath);
    await deleteFile(sourcePath);

    try {
      await download(sourcePath);
      assert.fail('should throw');
    } catch (e) {
      expect(e).to.be.instanceOf(FichierInexistant);
    }
  });
});
