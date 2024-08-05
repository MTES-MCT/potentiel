import { before, beforeEach, describe, it } from 'node:test';
import { join } from 'node:path';

import { assert, expect } from 'chai';

import { download } from './download';
import { upload } from './upload';
import { renameFolder } from './renameFolder';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration';
import { FichierInexistant } from './fichierInexistant.error';

describe(`rename folder`, () => {
  const bucketName = 'potentiel';

  const uploadTestFile = async (fileName: string, contentString: string) => {
    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(contentString, 'utf-8'));
        controller.close();
      },
    });

    await upload(fileName, content);
  };

  before(() => {
    setTestBucketEnvVariable(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné des fichiers téléverśes
    Quand le dossier est renommé
    Alors les fichiers devraient être récupérables depuis le nouveau dossier
    Et ne devraient plus être récupérables depuis l'ancien dossier`, async () => {
    const originalFolderName = 'original-name';
    const newFolderName = 'new-name';
    const originalFile1 = join(originalFolderName, 'file1');
    const originalFile2 = join(originalFolderName, 'file2');

    const newFile1 = join(newFolderName, 'file1');
    const newFile2 = join(newFolderName, 'file2');

    await uploadTestFile(originalFile1, 'content 1');
    await uploadTestFile(originalFile2, 'content 2');

    await renameFolder(originalFolderName, newFolderName);

    const actual1 = await download(newFile1);
    expect(actual1).not.to.be.null;
    const actual2 = await download(newFile2);
    expect(actual2).not.to.be.null;

    try {
      await download(originalFile1);
      assert.fail('should throw');
    } catch (e) {
      expect(e).to.be.instanceOf(FichierInexistant);
    }
    try {
      await download(originalFile2);
      assert.fail('should throw');
    } catch (e) {
      expect(e).to.be.instanceOf(FichierInexistant);
    }
  });
});
