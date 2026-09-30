import { join } from 'node:path';
import { Readable } from 'node:stream';
import { before, beforeEach, describe, it } from 'node:test';

import { expect } from 'chai';

import { copyFilesFromFolder, copyFolder } from './copyFolder.js';
import { download } from './download.js';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration.js';
import { upload } from './upload.js';

describe(`copy files from folder`, () => {
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

    const content1 = Readable.toWeb(Readable.from(`Contenu du fichier 1`));
    const content2 = Readable.toWeb(Readable.from(`Contenu du fichier 2`));
    await upload(sourceFilePath1, content1);
    await upload(sourceFilePath2, content2);

    await copyFilesFromFolder(sourcePath, targetPath);

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

describe(`Copy folder`, () => {
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
    const sourceFiles = [
      `${sourcePath}/file-racine.pdf`,
      `${sourcePath}/sous-dossier/file-niveau1.pdf`,
      `${sourcePath}/sous-dossier/file-niveau2.pdf`,
    ];

    for (const [index, filePath] of sourceFiles.entries()) {
      await upload(filePath, Readable.toWeb(Readable.from(`Contenu ${index}`)));
    }

    const targetPath = 'path/target';
    await copyFolder(sourcePath, targetPath);

    const expectedTargetFiles = sourceFiles.map((filePath) =>
      filePath.replace(sourcePath, targetPath),
    );

    for (const filePath of expectedTargetFiles) {
      const actual = await download(filePath);
      expect(actual).not.to.be.null;
    }
  });
});
