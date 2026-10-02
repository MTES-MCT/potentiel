import { join } from 'node:path';
import { Readable } from 'node:stream';
import { before, beforeEach, describe, it } from 'node:test';

import { expect } from 'chai';

import { copyFolder } from './copyFolder.js';
import { download } from './download.js';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration.js';
import { upload } from './upload.js';

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
    Et un dossier contenant des fichiers à plusieurs niveaux
    Quand le dossier est copié
    Alors toute l'arborescence devrait être préservée dans la cible`, async () => {
    const sourcePath = 'path/source';
    const sourceFilePath1 = join(sourcePath, 'file1.pdf');
    const sourceFilePath2 = join(sourcePath, 'sous-dossier', 'file2.pdf');
    const sourceFiles = [sourceFilePath1, sourceFilePath2];

    const targetPath = 'path/target';
    const expectedTargetFiles = sourceFiles.map((filePath) =>
      filePath.replace(sourcePath, targetPath),
    );

    for (const [index, filePath] of sourceFiles.entries()) {
      await upload(filePath, Readable.toWeb(Readable.from(`Contenu ${index}`)));
    }

    await copyFolder(sourcePath, targetPath);

    for (const filePath of expectedTargetFiles) {
      const actual = await download(filePath);
      expect(actual).not.to.be.null;
    }
  });
});
