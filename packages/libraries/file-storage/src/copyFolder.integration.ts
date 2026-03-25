import { before, beforeEach, describe, it } from 'node:test';
import { join } from 'path';

import { expect } from 'chai';

import { download } from './download.js';
import { upload } from './upload.js';
import { copyFolder } from './copyFolder.js';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration.js';

describe(`copy folder`, () => {
  const bucketName = 'potentiel';

  before(() => {
    setTestBucketEnvVariable(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné un endpoint et un bucket
    Et un dossier contenant des fichiers
    Quand le dossier est copié
    Alors la copie devrait être récupérable depuis le bucket
    Et l'original devrait  être récupérable depuis le bucket`, async () => {
    const sourcePath = 'path/source';
    const sourceFilePath1 = join(sourcePath, 'file1.pdf');
    const sourceFilePath2 = join(sourcePath, 'file2.pdf');

    const targetPath = 'path/target';
    const targetFilePath1 = join(targetPath, 'file1.pdf');
    const targetFilePath2 = join(targetPath, 'file2.pdf');

    const content1 = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu du fichier 1`, 'utf-8'));
        controller.close();
      },
    });

    const content2 = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu du fichier 2`, 'utf-8'));
        controller.close();
      },
    });

    await upload(sourceFilePath1, content1);
    await upload(sourceFilePath2, content2);

    await copyFolder(sourcePath, targetPath);

    const actualTarget1 = await download(targetFilePath1);
    const actualTarget2 = await download(targetFilePath2);

    expect(actualTarget1).not.to.be.null;
    expect(actualTarget2).not.to.be.null;

    const actualSource1 = await download(sourceFilePath1);
    const actualSource2 = await download(sourceFilePath2);

    expect(actualSource1).not.to.be.null;
    expect(actualSource2).not.to.be.null;
  });
});
